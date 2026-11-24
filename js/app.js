(() => {
  const STORE_KEY = "oybr:v1";
  const DAY_MS = 86400000;
  const $ = (s) => document.querySelector(s);

  // ---------- State ----------
  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  const defaults = () => ({ plan: "balanced", start: todayISO(), version: "NIV", theme: "auto", studyLang: "both", progress: {}, notes: {} });

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY));
      if (raw && typeof raw === "object") return Object.assign(defaults(), raw);
    } catch (_) {}
    return defaults();
  }
  let state = load();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) { toast("Could not save – storage unavailable"); }
  }

  // progress[plan] = { "<day>:<trackId>": true }
  const prog = () => (state.progress[state.plan] ||= {});
  const notes = () => (state.notes[state.plan] ||= {});

  // ---------- Dates ----------
  const parseISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const dateForDay = (i) => new Date(parseISO(state.start).getTime() + i * DAY_MS + 12 * 3600000); // noon avoids DST edges
  function todayIndex() {
    const t = parseISO(todayISO()).getTime();
    return Math.round((t - parseISO(state.start).getTime()) / DAY_MS);
  }
  const clampDay = (i) => Math.max(0, Math.min(PLAN_DAYS - 1, i));
  const fmt = (d, opts) => d.toLocaleDateString(undefined, opts);

  // ---------- Plan helpers ----------
  const plan = () => buildPlan(state.plan);
  const isTrackDone = (d, t) => !!prog()[`${d}:${t}`];
  const dayStatus = (d) => {
    const tracks = plan()[d];
    const n = tracks.filter((t) => isTrackDone(d, t.trackId)).length;
    return n === 0 ? "none" : n === tracks.length ? "done" : "part";
  };

  function stats() {
    const p = plan();
    let readCh = 0, totalCh = 0, doneDays = 0;
    p.forEach((tracks, d) => {
      tracks.forEach((t) => { totalCh += t.chapters; if (isTrackDone(d, t.trackId)) readCh += t.chapters; });
      if (dayStatus(d) === "done") doneDays++;
    });
    const ti = todayIndex();
    let behind = 0;
    for (let d = 0; d < Math.min(ti, PLAN_DAYS); d++) if (dayStatus(d) !== "done") behind++;
    // Streak: consecutive completed plan days ending at today (or yesterday if today not done yet).
    let streak = 0, d = clampDay(ti);
    if (ti >= 0 && ti < PLAN_DAYS && dayStatus(d) !== "done") d--;
    while (d >= 0 && dayStatus(d) === "done") { streak++; d--; }
    return { pct: totalCh ? Math.round((readCh / totalCh) * 1000) / 10 : 0, doneDays, behind, streak, readCh };
  }

  // ---------- Rendering ----------
  let current = clampDay(todayIndex());

  function renderStats() {
    const s = stats();
    $("#stat-pct").textContent = `${s.pct}%`;
    $("#stat-days").textContent = s.doneDays;
    $("#stat-streak").textContent = s.streak;
    $("#stat-behind").textContent = s.behind;
    $("#stat-behind").parentElement.classList.toggle("warn", s.behind > 0);
    $("#progress-bar").style.width = `${s.pct}%`;
    return s;
  }

  function passageURL(q) {
    return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(q)}&version=${encodeURIComponent(state.version)}`;
  }

  function renderDay() {
    const d = current, tracks = plan()[d], ti = todayIndex();
    $("#day-heading").textContent = `Day ${d + 1} of ${PLAN_DAYS}`;
    let rel = "";
    if (d === ti) rel = " · Today";
    else if (d === ti - 1) rel = " · Yesterday";
    else if (d === ti + 1) rel = " · Tomorrow";
    $("#day-date").textContent = fmt(dateForDay(d), { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + rel;
    $("#prev-day").disabled = d === 0;
    $("#next-day").disabled = d === PLAN_DAYS - 1;

    const ul = $("#readings");
    ul.innerHTML = "";
    tracks.forEach((t) => {
      const done = isTrackDone(d, t.trackId);
      const li = document.createElement("li");
      li.className = "reading" + (done ? " done" : "");
      const id = `chk-${t.trackId}`;
      const studyKey = `${d}:${t.trackId}`;
      const open = openStudy.has(studyKey);
      li.innerHTML = `
        <div class="reading-main">
          <input type="checkbox" id="${id}" ${done ? "checked" : ""}>
          <label for="${id}" class="reading-body">
            <span class="track">${t.trackName} · ${t.chapters} ch.</span>
            <span class="passages"></span>
          </label>
          <button class="study-btn" aria-expanded="${open}">Study</button>
        </div>`;
      const panel = buildStudyPanel(t.passages);
      panel.hidden = !open;
      li.append(panel);
      li.querySelector(".study-btn").addEventListener("click", (e) => {
        const nowOpen = panel.hidden;
        panel.hidden = !nowOpen;
        e.currentTarget.setAttribute("aria-expanded", nowOpen);
        if (nowOpen) openStudy.add(studyKey); else openStudy.delete(studyKey);
      });
      const ps = li.querySelector(".passages");
      t.passages.forEach((p, i) => {
        const a = document.createElement("a");
        a.href = passageURL(p.query);
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = p.label;
        a.title = `Read ${p.label} (${state.version})`;
        if (i) ps.append("; ");
        ps.append(a);
      });
      li.querySelector("input").addEventListener("change", (e) => setTrack(d, t.trackId, e.target.checked));
      ul.append(li);
    });

    renderBookStarts(tracks);

    const status = dayStatus(d);
    $("#mark-day").textContent = status === "done" ? "Mark day as unread" : "Mark whole day as read";
    $("#mark-day").classList.toggle("done", status === "done");
    $("#day-notes").value = notes()[d] || "";

    const s = renderStats();
    const banner = $("#behind-banner");
    if (ti < 0) {
      banner.textContent = `Your plan starts in ${-ti} day${ti === -1 ? "" : "s"}. You can read ahead anytime.`;
      banner.classList.remove("hidden");
    } else if (ti >= PLAN_DAYS) {
      banner.textContent = s.doneDays === PLAN_DAYS ? "You finished the whole Bible. Well done!" : `Your 365 days are over and ${PLAN_DAYS - s.doneDays} day(s) are still unread. Keep going!`;
      banner.classList.remove("hidden");
    } else if (s.behind > 0 && d === ti) {
      banner.textContent = `You're ${s.behind} day${s.behind === 1 ? "" : "s"} behind. Tap “First unread day” to catch up, or move your start date in Settings.`;
      banner.classList.remove("hidden");
    } else banner.classList.add("hidden");
  }

  // ---------- Study helpers ----------
  const openStudy = new Set();
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function linkList(links) {
    const ul = el("ul", "links");
    links.forEach((l) => {
      const li = el("li");
      const a = el("a", null, l.name);
      a.href = l.url; a.target = "_blank"; a.rel = "noopener";
      li.append(a);
      if (l.note) li.append(el("span", "link-note", l.note));
      ul.append(li);
    });
    return ul;
  }
  const showEn = () => state.studyLang !== "zh";
  const showZh = () => state.studyLang !== "en";

  function inlineLinks(links) {
    const row = el("p", "link-row");
    links.forEach((l, i) => {
      if (i) row.append(" ", el("span", "sep", "·"), " ");
      const a = el("a", null, l.name);
      a.href = l.url; a.target = "_blank"; a.rel = "noopener"; a.title = l.note || l.name;
      row.append(a);
    });
    return row;
  }

  function resourceKey() {
    const det = el("details", "res-key");
    det.append(el("summary", null, "About these resources"));
    const sample = STUDY.chapterLinks(0, 1);
    const items = [...(showEn() ? sample.en : []), ...(showZh() ? sample.zh : [])].map((l) => ({ name: l.name, note: l.note }));
    const ul = el("ul", "links");
    items.forEach((l) => { const li = el("li"); li.append(el("strong", null, l.name), el("span", "link-note", l.note)); ul.append(li); });
    det.append(ul);
    return det;
  }

  function buildStudyPanel(passages) {
    const panel = el("div", "study");
    passages.forEach((p) => {
      const book = BIBLE_BOOKS[p.bi];
      for (let c = p.from; c <= p.to; c++) {
        const links = STUDY.chapterLinks(p.bi, c);
        const box = el("div", "study-chapter");
        box.append(el("h4", null, book.chapters === 1 ? book.name : `${book.name} ${c}`));
        if (showEn()) box.append(inlineLinks(links.en));
        if (showZh()) { const zh = inlineLinks(links.zh); zh.classList.add("zh"); box.append(zh); }
        panel.append(box);
      }
      panel.append(buildIntro(p.bi, false));
    });
    panel.append(resourceKey());
    return panel;
  }

  const INTRO_LABELS = {
    en: { start: "Starting a new book", bg: "Book background", more: "Read background ▾", less: "Hide ▴",
          author: "Author", date: "Date", setting: "Setting", key: "Key passage", themes: "Major themes", watch: "Watch", zhRes: "中文資源",
          note: "Background notes are brief summaries. Where authorship or dating is debated, both views are given." },
    zh: { start: "開始新的一卷書", bg: "書卷背景", more: "閱讀背景 ▾", less: "收起 ▴",
          author: "作者", date: "年代", setting: "背景", key: "鑰節", themes: "主要信息", watch: "影片（英文）", zhRes: "中文資源",
          note: "以上為簡要介紹。作者或年代有爭議之處，並列傳統看法與學術看法。" },
  };
  // Language for background cards: follows the study setting; in "both" mode the reader can switch.
  const introLang = () => (state.studyLang === "both" ? state.introLang || "zh" : state.studyLang);

  function buildIntro(bi, startOfBook) {
    const book = BIBLE_BOOKS[bi], links = STUDY.bookLinks(bi);
    const lang = introLang(), L = INTRO_LABELS[lang];
    const intro = (lang === "zh" ? BOOK_INTROS_ZH : BOOK_INTROS)[bi];
    const det = el("details", "intro" + (startOfBook ? " start" : ""));
    det.open = openIntros.has(`${startOfBook}:${bi}`);
    det.addEventListener("toggle", () => { const k = `${startOfBook}:${bi}`; if (det.open) openIntros.add(k); else openIntros.delete(k); });
    const sum = el("summary");
    sum.dataset.more = L.more; sum.dataset.less = L.less;
    sum.append(el("span", "intro-kicker", startOfBook ? L.start : L.bg));
    sum.append(el("span", "intro-title", lang === "zh" ? `${STUDY_BOOKS[bi].zh} · ${book.name}` : `${book.name} · ${STUDY_BOOKS[bi].zh}`));
    sum.append(el("span", "intro-summary", intro.summary));
    det.append(sum);
    if (state.studyLang === "both") {
      const sw = el("div", "lang-switch");
      [["en", "English"], ["zh", "中文"]].forEach(([code, name]) => {
        const b = el("button", code === lang ? "active" : "", name);
        b.type = "button";
        b.setAttribute("aria-pressed", code === lang);
        b.addEventListener("click", () => { if (code === lang) return; state.introLang = code; save(); renderDay(); });
        sw.append(b);
      });
      det.append(sw);
    }
    const dl = el("dl");
    [[L.author, intro.author], [L.date, intro.date], [L.setting, intro.setting], [L.key, intro.key]].forEach(([k, v]) => {
      dl.append(el("dt", null, k), el("dd", null, v));
    });
    det.append(dl);
    const themes = el("ul", "themes");
    intro.themes.forEach((t) => themes.append(el("li", null, t)));
    det.append(el("p", "lang-label", L.themes), themes);
    if (showEn()) det.append(el("p", "lang-label", L.watch), linkList(links.videos));
    if (showZh()) { const zh = linkList(links.zh); zh.classList.add("zh"); det.append(el("p", "lang-label", L.zhRes), zh); }
    det.append(el("p", "intro-disclaimer", L.note));
    return det;
  }

  const openIntros = new Set();
  function renderBookStarts(tracks) {
    const box = $("#book-starts");
    box.innerHTML = "";
    tracks.forEach((t) => t.passages.forEach((p) => { if (p.from === 1) box.append(buildIntro(p.bi, true)); }));
  }

  function renderCalendar() {
    const root = $("#calendar");
    root.innerHTML = "";
    const ti = todayIndex(), p = plan();
    let monthKey = null, grid = null;
    for (let d = 0; d < PLAN_DAYS; d++) {
      const date = dateForDay(d);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (key !== monthKey) {
        monthKey = key;
        const box = document.createElement("div");
        box.className = "month";
        box.innerHTML = `<h3>${fmt(date, { month: "long", year: "numeric" })}</h3>`;
        grid = document.createElement("div");
        grid.className = "grid";
        ["S", "M", "T", "W", "T", "F", "S"].forEach((w) => { const h = document.createElement("span"); h.className = "wd"; h.textContent = w; grid.append(h); });
        for (let i = 0; i < date.getDay(); i++) grid.append(document.createElement("span"));
        box.append(grid);
        root.append(box);
      }
      const st = dayStatus(d);
      const b = document.createElement("button");
      b.className = `cell ${st}` + (d === ti ? " today" : "") + (st !== "done" && d < ti ? " missed" : "") + (d === current ? " selected" : "");
      b.textContent = date.getDate();
      b.title = `Day ${d + 1}: ` + p[d].map((t) => t.passages.map((x) => x.label).join("; ")).join(" | ");
      b.addEventListener("click", () => { current = d; show("today"); });
      grid.append(b);
    }
  }

  function renderSettings() {
    const sel = $("#plan-select");
    if (!sel.options.length) {
      Object.entries(PLANS).forEach(([id, p]) => sel.add(new Option(p.name, id)));
    }
    sel.value = state.plan;
    $("#start-date").value = state.start;
    $("#version-select").value = state.version;
    $("#theme-select").value = state.theme;
    $("#study-lang").value = state.studyLang;
  }

  function applyTheme() {
    if (state.theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", state.theme);
  }

  let view = "today";
  function show(v) {
    view = v;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === v));
    document.querySelectorAll(".view").forEach((s) => s.classList.toggle("hidden", s.id !== `view-${v}`));
    if (v === "today") renderDay();
    if (v === "calendar") { renderStats(); renderCalendar(); }
    if (v === "settings") { renderStats(); renderSettings(); }
    window.scrollTo({ top: 0 });
  }

  // ---------- Actions ----------
  function setTrack(d, trackId, val) {
    const k = `${d}:${trackId}`;
    if (val) prog()[k] = true; else delete prog()[k];
    save();
    const nowDone = dayStatus(d) === "done";
    renderDay();
    if (val && nowDone) toast(`Day ${d + 1} complete ✓`);
  }

  function toggleDay() {
    const d = current, done = dayStatus(d) === "done";
    plan()[d].forEach((t) => { const k = `${d}:${t.trackId}`; if (done) delete prog()[k]; else prog()[k] = true; });
    save();
    renderDay();
    if (!done) toast(`Day ${d + 1} complete ✓`);
  }

  function firstUnread() {
    for (let d = 0; d < PLAN_DAYS; d++) if (dayStatus(d) !== "done") return d;
    return PLAN_DAYS - 1;
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---------- Wiring ----------
  document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => show(t.dataset.view)));
  $("#prev-day").addEventListener("click", () => { current = clampDay(current - 1); renderDay(); });
  $("#next-day").addEventListener("click", () => { current = clampDay(current + 1); renderDay(); });
  $("#goto-today").addEventListener("click", () => { current = clampDay(todayIndex()); renderDay(); });
  $("#goto-unread").addEventListener("click", () => { current = firstUnread(); renderDay(); });
  $("#mark-day").addEventListener("click", toggleDay);

  let notesTimer;
  $("#day-notes").addEventListener("input", (e) => {
    const d = current, v = e.target.value;
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => { if (v.trim()) notes()[d] = v; else delete notes()[d]; save(); }, 300);
  });

  document.addEventListener("keydown", (e) => {
    if (view !== "today" || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowLeft") $("#prev-day").click();
    if (e.key === "ArrowRight") $("#next-day").click();
  });

  $("#plan-select").addEventListener("change", (e) => { state.plan = e.target.value; save(); renderStats(); toast("Plan changed"); });
  $("#start-date").addEventListener("change", (e) => {
    if (!e.target.value) return;
    state.start = e.target.value; save(); current = clampDay(todayIndex()); renderStats(); toast("Start date updated");
  });
  $("#version-select").addEventListener("change", (e) => { state.version = e.target.value; save(); toast(`Links now open in ${state.version}`); });
  $("#study-lang").addEventListener("change", (e) => { state.studyLang = e.target.value; save(); toast("Study links updated"); });
  $("#theme-select").addEventListener("change", (e) => { state.theme = e.target.value; save(); applyTheme(); });

  $("#export-btn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `bible-reading-progress-${todayISO()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $("#import-file").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data || typeof data.progress !== "object") throw new Error("bad file");
      state = Object.assign(defaults(), data);
      save(); applyTheme(); current = clampDay(todayIndex()); renderSettings(); renderStats();
      toast("Progress imported");
    } catch (_) { toast("That file doesn't look like a progress backup"); }
    e.target.value = "";
  });
  $("#reset-btn").addEventListener("click", () => {
    if (!confirm(`Clear all checkmarks and notes for “${PLANS[state.plan].name}”?`)) return;
    state.progress[state.plan] = {}; state.notes[state.plan] = {};
    save(); renderStats(); toast("Progress reset");
  });

  // Re-render when the date rolls over while the tab stays open.
  let lastDay = todayISO();
  setInterval(() => { if (todayISO() !== lastDay) { lastDay = todayISO(); show(view); } }, 60000);

  applyTheme();
  show("today");
})();

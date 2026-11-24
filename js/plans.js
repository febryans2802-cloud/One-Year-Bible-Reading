// Builds 365-day reading plans by splitting chapter lists evenly.
const PLAN_DAYS = 365;

function chapterList(filter) {
  const list = [];
  BIBLE_BOOKS.forEach((b, bi) => {
    if (!filter(b)) return;
    for (let c = 1; c <= b.chapters; c++) list.push({ bi, c });
  });
  return list;
}

// Split `list` into `days` contiguous slices whose sizes differ by at most one.
function splitEvenly(list, days) {
  const out = [];
  for (let d = 0; d < days; d++) {
    const a = Math.ceil((list.length * d) / days);
    const b = Math.ceil((list.length * (d + 1)) / days);
    out.push(list.slice(a, b));
  }
  return out;
}

// Turn a slice of chapters into readable passages, e.g.
// [{Gen 49},{Gen 50},{Exod 1}] -> ["Genesis 49–50", "Exodus 1"]
function toPassages(chapters) {
  const groups = [];
  for (const ch of chapters) {
    const g = groups[groups.length - 1];
    if (g && g.bi === ch.bi && g.to === ch.c - 1) g.to = ch.c;
    else groups.push({ bi: ch.bi, from: ch.c, to: ch.c });
  }
  return groups.map((g) => {
    const book = BIBLE_BOOKS[g.bi];
    let label;
    if (book.chapters === 1) label = book.name;
    else if (g.from === g.to) label = `${book.name} ${g.from}`;
    else label = `${book.name} ${g.from}–${g.to}`;
    return { label, query: label.replace("–", "-"), count: g.to - g.from + 1 };
  });
}

const PLANS = {
  balanced: {
    name: "Balanced (OT + NT + Psalms/Proverbs)",
    tracks: [
      { id: "ot", name: "Old Testament", filter: (b) => b.track === "ot" },
      { id: "nt", name: "New Testament", filter: (b) => b.track === "nt" },
      { id: "wis", name: "Psalms & Proverbs", filter: (b) => b.track === "wis" },
    ],
  },
  canonical: {
    name: "Cover to cover (Genesis → Revelation)",
    tracks: [{ id: "all", name: "Reading", filter: () => true }],
  },
  ntFirst: {
    name: "New Testament first, then Old",
    tracks: [{ id: "all", name: "Reading", order: "ntFirst" }],
  },
};

const _planCache = {};
function buildPlan(planId) {
  if (_planCache[planId]) return _planCache[planId];
  const plan = PLANS[planId] || PLANS.balanced;
  // days[d] = [{ trackId, trackName, passages:[...] }]
  const days = Array.from({ length: PLAN_DAYS }, () => []);
  for (const t of plan.tracks) {
    let list;
    if (t.order === "ntFirst") {
      list = chapterList((b) => b.track === "nt").concat(chapterList((b) => b.track !== "nt"));
    } else {
      list = chapterList(t.filter);
    }
    splitEvenly(list, PLAN_DAYS).forEach((slice, d) => {
      if (slice.length) days[d].push({ trackId: t.id, trackName: t.name, passages: toPassages(slice), chapters: slice.length });
    });
  }
  return (_planCache[planId] = days);
}

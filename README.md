# One Year Bible Reading

A small interactive website for reading the whole Bible (all 1,189 chapters) in 365 days.

## Features
- **Today view**: the day's passages, each linked to BibleGateway in the version you choose (NIV, ESV, NLT, KJV, NKJV, NASB, 和合本 繁/简, 新譯本).
- **Check off each passage** or the whole day, with a per-day notes box for reflections.
- **Progress stats**: percent of the Bible read, days done, current streak, and days behind, with a catch-up prompt.
- **Plan calendar**: all 365 days, color-coded as read, partly read, missed, or today. Tap a day to open it.
- **Three plans**:
  - *Balanced*: Old Testament, New Testament, and Psalms/Proverbs read in parallel tracks.
  - *Cover to cover*: Genesis through Revelation, in order.
  - *New Testament first*, then the Old Testament.
- **Study panel** (the “Study” button on each reading): links for every chapter to
  - NET Bible translators' notes, Enduring Word (David Guzik), Matthew Henry, and Bible Hub's page of about 20 classic commentaries
  - 中文: 信望愛 (FHL) CBOL 註釋 and 和合本 with original-language tools
- **Book background**: when a book begins, a card gives its author, date, setting, summary, themes and a key passage, with BibleProject overview videos and 查經資料大全 (ccbiblestudy.org). It is also available inside each Study panel.
- Settings choose English, 中文, or both for study links.
- Any start date, light/dark theme, and JSON export/import of progress.

Progress is stored in the browser's `localStorage`, so it doesn't sync between devices unless you export and import it.

## Run locally
No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages
Repository **Settings → Pages → Deploy from a branch**, then select the branch and `/ (root)`.

## How the plans are built
`js/plans.js` splits each track's chapter list evenly across 365 days, so daily load varies by at most one chapter per track. Chapter counts are in `js/bible.js`.

## Study resources
- `js/study.js` holds the URL data for each book (Chinese names and abbreviations, site slugs, BibleProject video slugs taken from bibleproject.com's sitemap).
- The links for chapter 1 and the last chapter of every book (904 URLs), plus a sample of middle chapters, were checked against the live sites. Each link had to load the correct page, not a 404 or a redirect to a homepage. If a site changes its URL scheme, update the patterns in `STUDY.chapterLinks` / `STUDY.bookLinks`.
- No commentary text is copied into this site. Every resource is a link, so the publishers' copyrights are respected.
- `js/intros.js` contains original short book introductions. Where authorship or dating is debated, both the traditional and the main scholarly view are given. Review them before relying on them.

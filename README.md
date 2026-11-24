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

# devboard

a dark personal dev dashboard. live github repo grid, public activity feed, and a quick-links panel you can customize.

built with react + vite. no backend — everything hits the github api directly from the browser.

---

## features

- **repos tab** — fetches and displays all your public repos (sorted by last update). shows language, stars, description, and time since last push. click to open on github.
- **activity tab** — public event feed. shows pushes, creates, stars, PRs, releases — anything that shows up in your github timeline.
- **links tab** — configurable quick-access link chips grouped by category. add/remove links, stored in localStorage so they persist across reloads.
- **clock** — live clock in the header. updates every second.

---

## structure

```
src/
  App.jsx              root layout, tab switcher
  App.module.css
  styles/
    global.css         css variables, reset
  hooks/
    useGitHub.js       data fetching (useRepos, useActivity) with 60s cache
  components/
    Clock.jsx          live clock
    RepoGrid.jsx       repo card grid
    ActivityFeed.jsx   github event feed
    QuickLinks.jsx     editable link chips
    *.module.css       scoped styles
```

## usage

```sh
npm install
npm run dev         # dev server at localhost:5173
npm run build       # production build to dist/
```

## stack

- react 18 + vite 5
- css modules (no css-in-js, no tailwind)
- github rest api v3 (unauthenticated — 60 req/h limit)
- no external ui library

## testing

built, dev server started, opened in browser. repos tab loads all repos correctly with language dots and timestamps. activity tab renders event feed. links tab renders with add/remove working. clock updates every second. all tested live.

**not tested:** github api rate limiting behavior, localStorage corruption fallback, repos with no description or language.

## license

MIT

# TaskFlow

A fast, production-ready todo app built with React.

**Live demo → [todo-list-gamma-two-83.vercel.app](https://todo-list-gamma-two-83.vercel.app/)**

## Features

- **Add, complete & delete tasks** — keyboard-friendly (press Enter to add)
- **Priority levels** — Low / Medium / High with colour indicators
- **Due date & time** — Day / Month / Year and Hour / Minute / AM-PM dropdowns, plus Today / Tomorrow shortcuts; overdue tasks highlighted
- **Grouped list** — tasks grouped by day, week or month of their due date (Overdue first, No date last)
- **Edit anything** — name, priority, date, time and flag can all be changed after adding
- **Reminders** — browser notifications when a task is due (9:00 if no time is set); ignored reminders nag again every 30 min until you finish or snooze (10 min / 1 hr / tomorrow)
- **Flags** — flag important tasks and filter to just those
- **Added timestamp** — every task shows when it was created
- **Inline editing** — double-click any task to rename it
- **Filter** — All / Active / Flagged / Completed tabs
- **Sort** — Due time, Newest first, Priority, A → Z
- **Search** — instant full-text search
- **Progress bar** — live completion percentage
- **Clear completed** — bulk-delete finished tasks
- **Dark mode** — syncs to OS preference, persisted across sessions
- **Persistent storage** — tasks survive page refreshes via `localStorage`
- **Responsive** — works on mobile and desktop

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/) for dev server and builds
- [Vitest](https://vitest.dev/) + React Testing Library for tests
- Plain CSS with custom properties (no UI library)
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run tests in watch mode
npm run lint     # lint with ESLint
npm run build    # production build (outputs to build/)
npm run preview  # serve the production build locally
```

## Project structure

```
src/
  hooks/
    useTodos.js          # state + localStorage persistence
  components/
    TodoApp.jsx          # root container, filtering & sorting logic
    TodoInput.jsx        # add-task form with priority & due date
    TodoItem.jsx         # single task row with inline edit
    TodoFilters.jsx      # search, filter tabs, sort select
    TodoStats.jsx        # progress bar
    Header.jsx           # navbar with dark-mode toggle
    Footer.jsx
  App.jsx                # dark-mode state + layout
  main.jsx               # entry point (createRoot)
```

## Deployment

The app is deployed to Vercel and auto-deploys on every push to `main`.

---

© 2026 Ayyappa Swamy

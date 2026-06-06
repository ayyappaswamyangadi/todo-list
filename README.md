# TaskFlow

A fast, production-ready todo app built with React.

**Live demo → [todo-list-gamma-two-83.vercel.app](https://todo-list-gamma-two-83.vercel.app/)**

## Features

- **Add, complete & delete tasks** — keyboard-friendly (press Enter to add)
- **Priority levels** — Low / Medium / High with colour indicators
- **Due dates** — overdue tasks highlighted, due-today flagged in amber
- **Inline editing** — double-click any task to rename it
- **Filter** — All / Active / Completed tabs
- **Sort** — Newest first, Priority, Due date, A → Z
- **Search** — instant full-text search
- **Progress bar** — live completion percentage
- **Clear completed** — bulk-delete finished tasks
- **Dark mode** — syncs to OS preference, persisted across sessions
- **Persistent storage** — tasks survive page refreshes via `localStorage`
- **Responsive** — works on mobile and desktop

## Tech stack

- [React 17](https://reactjs.org/)
- Plain CSS with custom properties (no UI library)
- Create React App
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
npm install
npm start        # http://localhost:3000
npm run build    # production build
```

## Project structure

```
src/
  hooks/
    useTodos.js          # state + localStorage persistence
  components/
    TodoApp.js           # root container, filtering & sorting logic
    TodoInput.js         # add-task form with priority & due date
    TodoItem.js          # single task row with inline edit
    TodoFilters.js       # search, filter tabs, sort select
    TodoStats.js         # progress bar
    Header.js            # navbar with dark-mode toggle
    Footer.js
```

## Deployment

The app is deployed to Vercel and auto-deploys on every push to `main`.

---

© 2026 Ayyappa Swamy

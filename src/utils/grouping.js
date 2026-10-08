import { localDateString, formatDay } from './reminders'

export const GROUP_MODES = ['day', 'week', 'month', 'none']

const OVERDUE = { key: '0-overdue', label: 'Overdue' }
const NO_DATE = { key: '9-none', label: 'No date' }

const parse = dueDate => {
  const [y, m, d] = dueDate.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Monday of the week containing `date`.
const startOfWeek = date => new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7))

function dayGroup(date, now) {
  const opts = { weekday: 'long', day: 'numeric', month: 'short' }
  if (date.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  const full = date.toLocaleDateString(undefined, opts)
  const rel = formatDay(date, now)
  return { key: `1-${localDateString(date)}`, label: ['Today', 'Tomorrow', 'Yesterday'].includes(rel) ? `${rel} · ${full}` : full }
}

function weekGroup(date, now) {
  const start = startOfWeek(date)
  const diff = Math.round((start - startOfWeek(now)) / (7 * 24 * 60 * 60 * 1000))
  const named = { [-1]: 'Last week', 0: 'This week', 1: 'Next week' }[diff]
  const opts = { day: 'numeric', month: 'short' }
  if (start.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  return { key: `1-${localDateString(start)}`, label: named ?? `Week of ${start.toLocaleDateString(undefined, opts)}` }
}

function monthGroup(date, now) {
  const sameMonth = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  const label = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  return { key: `1-${localDateString(date).slice(0, 7)}`, label: sameMonth ? `This month · ${label}` : label }
}

const GROUPERS = { day: dayGroup, week: weekGroup, month: monthGroup }

// Splits an already-sorted list into [{ key, label, todos }] by due date.
// Unfinished tasks from before today go under "Overdue" at the top,
// tasks without a date go under "No date" at the bottom.
export function groupTodos(todos, mode, now = new Date()) {
  if (mode === 'none') return [{ key: 'all', label: null, todos }]

  const today = localDateString(now)
  const groups = new Map()
  for (const todo of todos) {
    let group
    if (!todo.dueDate) group = NO_DATE
    else if (!todo.completed && todo.dueDate < today) group = OVERDUE
    else group = GROUPERS[mode](parse(todo.dueDate), now)

    if (!groups.has(group.key)) groups.set(group.key, { ...group, todos: [] })
    groups.get(group.key).todos.push(todo)
  }
  return [...groups.values()].sort((a, b) => a.key.localeCompare(b.key))
}

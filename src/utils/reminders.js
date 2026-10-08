// Reminder timing rules — kept free of React/DOM so they're easy to test
// and to port to the iOS app later.

// Tasks with a date but no time get reminded at this time of day.
export const DEFAULT_REMINDER_TIME = '09:00'

// If a reminder is ignored (task not done, not snoozed), nag again this often.
export const RENOTIFY_INTERVAL_MS = 30 * 60 * 1000

const pad = n => String(n).padStart(2, '0')

// YYYY-MM-DD in local time (toISOString() would give the UTC date).
export function localDateString(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function localTimeString(d = new Date()) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// When the reminder for a task should fire, as a ms timestamp (or null).
export function reminderTimestamp({ dueDate, dueTime }) {
  if (!dueDate) return null
  const [y, m, d] = dueDate.split('-').map(Number)
  const [hh, mm] = (dueTime || DEFAULT_REMINDER_TIME).split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm).getTime()
}

// Fields to store when a task's date/time is set or changed. If the time is
// already in the past (e.g. "today" with no time, added in the afternoon),
// count it as just notified — you've seen it — so the next nag comes later.
export function scheduleFields(dueDate, dueTime, now = Date.now()) {
  const fields = { dueDate: dueDate || null, dueTime: (dueDate && dueTime) || null, snoozedUntil: null }
  const at = reminderTimestamp(fields)
  fields.lastNotifiedAt = at !== null && at <= now ? now : null
  return fields
}

// The reminder time has passed, the task isn't done, and it isn't snoozed.
export function isReminderDue(todo, now = Date.now()) {
  if (todo.completed) return false
  const at = reminderTimestamp(todo)
  if (at === null || at > now) return false
  if (todo.snoozedUntil && todo.snoozedUntil > now) return false
  return true
}

// Due, and not notified within the last RENOTIFY_INTERVAL_MS.
export function shouldNotify(todo, now = Date.now()) {
  if (!isReminderDue(todo, now)) return false
  return !todo.lastNotifiedAt || now - todo.lastNotifiedAt >= RENOTIFY_INTERVAL_MS
}

export function isOverdue(todo, now = Date.now()) {
  if (todo.completed || !todo.dueDate) return false
  if (todo.dueTime) return reminderTimestamp(todo) < now
  return todo.dueDate < localDateString(new Date(now))
}

// "Today", "Tomorrow", "Yesterday", or e.g. "Fri, 10 Oct" (+ year if not this year).
export function formatDay(date, now = new Date()) {
  const day = localDateString(date)
  const offset = (n) => localDateString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + n))
  if (day === offset(0)) return 'Today'
  if (day === offset(1)) return 'Tomorrow'
  if (day === offset(-1)) return 'Yesterday'
  const opts = { weekday: 'short', day: 'numeric', month: 'short' }
  if (date.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  return date.toLocaleDateString(undefined, opts)
}

export function formatTime(date) {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

// Full form, e.g. "Thu, 8 Oct 2026, 6:30 pm" (time only if `withTime`).
export function formatFull(ts, withTime = true) {
  const date = new Date(ts)
  const day = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  return withTime ? `${day}, ${formatTime(date)}` : day
}

// "Today" / "Tomorrow" / "Yesterday", or null for other days.
export function relativeDay(ts, now = new Date()) {
  const label = formatDay(new Date(ts), now)
  return ['Today', 'Tomorrow', 'Yesterday'].includes(label) ? label : null
}

// Label for a task's due date/time, e.g. "Today, 6:30 pm" or "Fri, 10 Oct".
export function formatDue(todo, now = new Date()) {
  if (!todo.dueDate) return null
  const at = new Date(reminderTimestamp(todo))
  return todo.dueTime ? `${formatDay(at, now)}, ${formatTime(at)}` : formatDay(at, now)
}

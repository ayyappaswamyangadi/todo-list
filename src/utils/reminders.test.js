import {
  reminderTimestamp, scheduleFields, isReminderDue, shouldNotify, isOverdue, RENOTIFY_INTERVAL_MS,
} from './reminders'

const at = (y, m, d, hh = 0, mm = 0) => new Date(y, m - 1, d, hh, mm).getTime()

test('reminder time uses the due time, or 9:00 when only a date is set', () => {
  expect(reminderTimestamp({ dueDate: '2026-10-08', dueTime: '18:30' })).toBe(at(2026, 10, 8, 18, 30))
  expect(reminderTimestamp({ dueDate: '2026-10-08', dueTime: null })).toBe(at(2026, 10, 8, 9))
  expect(reminderTimestamp({ dueDate: null })).toBeNull()
})

test('scheduling a time already in the past counts as just notified', () => {
  const now = at(2026, 10, 8, 15)
  expect(scheduleFields('2026-10-08', null, now).lastNotifiedAt).toBe(now)
  expect(scheduleFields('2026-10-08', '18:00', now).lastNotifiedAt).toBeNull()
})

test('a due reminder notifies, then nags again after the interval until done', () => {
  const todo = { dueDate: '2026-10-08', dueTime: '10:00', completed: false, lastNotifiedAt: null }
  const due = at(2026, 10, 8, 10)
  expect(shouldNotify(todo, due - 1)).toBe(false)
  expect(shouldNotify(todo, due)).toBe(true)

  const notified = { ...todo, lastNotifiedAt: due }
  expect(shouldNotify(notified, due + RENOTIFY_INTERVAL_MS - 1)).toBe(false)
  expect(shouldNotify(notified, due + RENOTIFY_INTERVAL_MS)).toBe(true)
  expect(shouldNotify({ ...notified, completed: true }, due + RENOTIFY_INTERVAL_MS)).toBe(false)
})

test('snoozed reminders stay quiet until the snooze ends', () => {
  const due = at(2026, 10, 8, 10)
  const todo = { dueDate: '2026-10-08', dueTime: '10:00', completed: false, snoozedUntil: due + 600000 }
  expect(isReminderDue(todo, due + 1000)).toBe(false)
  expect(shouldNotify(todo, due + 600000)).toBe(true)
})

test('overdue: past the time if one is set, otherwise past the day', () => {
  const now = at(2026, 10, 8, 12)
  expect(isOverdue({ dueDate: '2026-10-08', dueTime: '11:00' }, now)).toBe(true)
  expect(isOverdue({ dueDate: '2026-10-08', dueTime: null }, now)).toBe(false)
  expect(isOverdue({ dueDate: '2026-10-07', dueTime: null }, now)).toBe(true)
})

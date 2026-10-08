import React from 'react'
import { formatDue, localDateString, reminderTimestamp, DEFAULT_REMINDER_TIME } from '../utils/reminders'

const MINUTE = 60 * 1000

function tomorrowMorning(now) {
  const d = new Date(now)
  d.setDate(d.getDate() + 1)
  return reminderTimestamp({ dueDate: localDateString(d), dueTime: DEFAULT_REMINDER_TIME })
}

function PermissionNotice({ permission, onEnable }) {
  if (permission === 'default') {
    return (
      <div className="notice">
        <span>🔔 Turn on notifications so TaskFlow can remind you, even when this tab is in the background.</span>
        <button className="notice-btn" onClick={onEnable}>Enable</button>
      </div>
    )
  }
  if (permission === 'denied') {
    return (
      <div className="notice notice-warn">
        Notifications are blocked for this site. Allow them from the site settings (the icon to the left of the address bar), then reload.
      </div>
    )
  }
  return null
}

export default function RemindersPanel({ dueNow, now, permission, onEnable, onDone, onSnooze }) {
  return (
    <>
      <PermissionNotice permission={permission} onEnable={onEnable} />

      {dueNow.length > 0 && (
        <section className="reminders-panel" aria-label="Reminders">
          <h2 className="reminders-title">
            🔔 {dueNow.length} {dueNow.length === 1 ? 'reminder needs' : 'reminders need'} attention
          </h2>
          <ul className="reminders-list">
            {dueNow.map(todo => (
              <li key={todo.id} className="reminder-row">
                <div className="reminder-info">
                  <span className="reminder-text">
                    {todo.flagged && <span className="flag-mark" aria-label="Flagged">⚑ </span>}
                    {todo.text}
                  </span>
                  <span className="reminder-due">Due {formatDue(todo, new Date(now))}</span>
                </div>
                <div className="reminder-actions">
                  <button className="reminder-btn done" onClick={() => onDone(todo.id)}>Done</button>
                  <button className="reminder-btn" onClick={() => onSnooze(todo.id, now + 10 * MINUTE)}>10 min</button>
                  <button className="reminder-btn" onClick={() => onSnooze(todo.id, now + 60 * MINUTE)}>1 hr</button>
                  <button className="reminder-btn" onClick={() => onSnooze(todo.id, tomorrowMorning(now))}>Tomorrow</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

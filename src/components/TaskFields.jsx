import React from 'react'
import { DEFAULT_REMINDER_TIME, localDateString, formatTime, reminderTimestamp } from '../utils/reminders'
import { DatePicker, TimePicker } from './DateTimePickers'

const PRIORITIES = ['low', 'medium', 'high']

const dayFromToday = n => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return localDateString(d)
}

const defaultReminderLabel = formatTime(new Date(reminderTimestamp({ dueDate: '2000-01-01', dueTime: DEFAULT_REMINDER_TIME })))

// Priority, due date/time and flag controls — shared by the add form and the edit form.
// `value` is { priority, dueDate, dueTime, flagged }; `onChange` receives a partial update.
export default function TaskFields({ value, onChange }) {
  const { priority, dueDate, dueTime, flagged } = value
  const today = dayFromToday(0)
  const tomorrow = dayFromToday(1)

  return (
    <div className="todo-input-extras">
      <div className="field-row">
        <span className="extras-label">Priority</span>
        {PRIORITIES.map(p => (
          <button
            key={p}
            type="button"
            className={`priority-chip priority-${p}${priority === p ? ' selected' : ''}`}
            onClick={() => onChange({ priority: p })}
            aria-pressed={priority === p}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className={`flag-chip${flagged ? ' selected' : ''}`}
          onClick={() => onChange({ flagged: !flagged })}
          aria-pressed={flagged}
          title="Mark as important. See just these with the Flagged tab."
        >
          ⚑ Flag
        </button>
      </div>

      <div className="field-row">
        <span className="extras-label">Date</span>
        <DatePicker value={dueDate} onChange={v => onChange({ dueDate: v })} />
        <button
          type="button"
          className={`priority-chip${dueDate === today ? ' selected-plain' : ''}`}
          onClick={() => onChange({ dueDate: today })}
        >
          Today
        </button>
        <button
          type="button"
          className={`priority-chip${dueDate === tomorrow ? ' selected-plain' : ''}`}
          onClick={() => onChange({ dueDate: tomorrow })}
        >
          Tomorrow
        </button>
      </div>

      <div className="field-row">
        <span className="extras-label">Time</span>
        <TimePicker value={dueTime} onChange={v => onChange({ dueTime: v })} />
        {(dueDate || dueTime) && (
          <button
            type="button"
            className="clear-due-btn"
            onClick={() => onChange({ dueDate: '', dueTime: '' })}
          >
            Clear date &amp; time
          </button>
        )}
      </div>

      {dueDate && !dueTime && (
        <span className="extras-hint">No time picked, so you’ll be reminded at {defaultReminderLabel} on that day.</span>
      )}
      {dueTime && !dueDate && (
        <span className="extras-hint">No date picked, so this is for today.</span>
      )}
    </div>
  )
}

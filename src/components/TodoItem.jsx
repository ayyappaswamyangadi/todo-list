import React, { useState, useRef, useEffect } from 'react'
import {
  formatFull, formatTime, relativeDay, isOverdue, localDateString,
  reminderTimestamp,
} from '../utils/reminders'
import TaskFields from './TaskFields'

const PRIORITY_COLOR = { low: 'var(--priority-low)', medium: 'var(--priority-medium)', high: 'var(--priority-high)' }

function TaskEditor({ todo, onSave, onCancel }) {
  const [text, setText] = useState(todo.text)
  const [fields, setFields] = useState({
    priority: todo.priority,
    dueDate: todo.dueDate || '',
    dueTime: todo.dueTime || '',
    flagged: !!todo.flagged,
  })
  const textRef = useRef(null)

  useEffect(() => { textRef.current?.focus() }, [])

  const save = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const { priority, dueDate, dueTime, flagged } = fields
    onSave({
      text: trimmed,
      priority,
      flagged,
      dueDate: dueDate || (dueTime ? localDateString() : null),
      dueTime: dueTime || null,
    })
  }

  return (
    <form
      className="task-editor"
      onSubmit={save}
      onKeyDown={e => { if (e.key === 'Escape') onCancel() }}
    >
      <input
        ref={textRef}
        className="todo-edit-input"
        value={text}
        maxLength={200}
        onChange={e => setText(e.target.value)}
        aria-label="Task name"
      />
      <TaskFields value={fields} onChange={update => setFields(f => ({ ...f, ...update }))} />
      <div className="task-editor-actions">
        <button type="submit" className="reminder-btn done" disabled={!text.trim()}>Save</button>
        <button type="button" className="reminder-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function DueDetail({ todo, now, overdue, dueToday, onClick }) {
  const at = reminderTimestamp(todo)
  const rel = relativeDay(at, new Date(now))
  const snoozed = todo.snoozedUntil && todo.snoozedUntil > now && !todo.completed

  return (
    <button
      type="button"
      className={`due-badge${overdue ? ' overdue' : dueToday ? ' today' : ''}`}
      onClick={onClick}
      title="Change date & time"
    >
      {overdue ? '⚠ Overdue · ' : '⏰ '}
      {rel && `${rel} · `}
      {formatFull(at, !!todo.dueTime)}
      {!todo.dueTime && ` · no time set, reminder at ${formatTime(new Date(at))}`}
      {snoozed && ` · snoozed until ${formatTime(new Date(todo.snoozedUntil))}`}
    </button>
  )
}

export default function TodoItem({ todo, now, onToggle, onDelete, onEdit, onToggleFlag }) {
  const [editing, setEditing] = useState(false)

  const overdue = isOverdue(todo, now)
  const dueToday = todo.dueDate && !todo.completed && !overdue && todo.dueDate === localDateString(new Date(now))

  if (editing) {
    return (
      <li className="todo-item editing">
        <TaskEditor
          todo={todo}
          onSave={updates => { onEdit(todo.id, updates); setEditing(false) }}
          onCancel={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}${overdue ? ' overdue' : ''}`}>
      <span
        className="priority-indicator"
        style={{ background: PRIORITY_COLOR[todo.priority] }}
        title={`${todo.priority} priority`}
      />

      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="todo-content">
        <span
          className="todo-text"
          onDoubleClick={() => !todo.completed && setEditing(true)}
          title={!todo.completed ? 'Double-click to edit' : undefined}
        >
          {todo.text}
        </span>

        <div className="todo-meta">
          <span className={`tag tag-${todo.priority}`}>{todo.priority} priority</span>
          {todo.flagged && <span className="tag tag-flag">⚑ Flagged</span>}
          {todo.dueDate && (
            <DueDetail
              todo={todo}
              now={now}
              overdue={overdue}
              dueToday={dueToday}
              onClick={() => !todo.completed && setEditing(true)}
            />
          )}
        </div>

        <div className="todo-meta">
          <span className="created-badge">Added {formatFull(todo.createdAt)}</span>
          {todo.completed && todo.completedAt && (
            <span className="created-badge">· Completed {formatFull(todo.completedAt)}</span>
          )}
        </div>
      </div>

      {!todo.completed && (
        <button
          className="todo-icon-btn"
          onClick={() => setEditing(true)}
          title="Edit task"
          aria-label="Edit task"
        >
          ✎
        </button>
      )}

      <button
        className={`todo-icon-btn flag-btn${todo.flagged ? ' flagged' : ''}`}
        onClick={() => onToggleFlag(todo.id)}
        title={todo.flagged ? 'Unflag' : 'Flag'}
        aria-label={todo.flagged ? 'Unflag task' : 'Flag task'}
        aria-pressed={!!todo.flagged}
      >
        ⚑
      </button>

      <button
        className="todo-delete-btn"
        onClick={() => onDelete(todo.id)}
        title="Delete task"
        aria-label="Delete task"
      >
        ✕
      </button>
    </li>
  )
}

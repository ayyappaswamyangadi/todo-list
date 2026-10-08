import React, { useState, useRef, useEffect } from 'react'

const PRIORITY_COLOR = { low: 'var(--priority-low)', medium: 'var(--priority-medium)', high: 'var(--priority-high)' }

function formatDate(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const editRef = useRef(null)

  useEffect(() => {
    if (editing) editRef.current?.focus()
  }, [editing])

  const commitEdit = () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, { text: trimmed })
    else setEditText(todo.text)
    setEditing(false)
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commitEdit() }
    if (e.key === 'Escape') { setEditText(todo.text); setEditing(false) }
  }

  const today = new Date().toISOString().split('T')[0]
  const isOverdue = todo.dueDate && !todo.completed && todo.dueDate < today
  const isDueToday = todo.dueDate && !todo.completed && todo.dueDate === today

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}${isOverdue ? ' overdue' : ''}`}>
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
        {editing ? (
          <input
            ref={editRef}
            className="todo-edit-input"
            value={editText}
            maxLength={200}
            onChange={e => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleEditKeyDown}
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={() => !todo.completed && setEditing(true)}
            title={!todo.completed ? 'Double-click to edit' : undefined}
          >
            {todo.text}
          </span>
        )}

        {todo.dueDate && (
          <span className={`due-badge${isOverdue ? ' overdue' : isDueToday ? ' today' : ''}`}>
            {isOverdue ? '⚠ Overdue · ' : isDueToday ? '📅 Today · ' : '📅 '}
            {formatDate(todo.dueDate)}
          </span>
        )}
      </div>

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

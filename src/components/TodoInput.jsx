import React, { useState, useRef } from 'react'
import { localDateString } from '../utils/reminders'
import TaskFields from './TaskFields'

const EMPTY_FIELDS = { priority: 'medium', dueDate: '', dueTime: '', flagged: false }

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('')
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef(null)

  const today = localDateString()

  const handleSubmit = (e) => {
    e && e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      inputRef.current?.focus()
      return
    }
    const { priority, dueDate, dueTime, flagged } = fields
    // Picking only a time means "today at that time".
    const date = dueDate || (dueTime ? today : null)
    onAdd({ text: trimmed, priority, dueDate: date, dueTime: dueTime || null, flagged })
    setText('')
    setFields(EMPTY_FIELDS)
    setExpanded(false)
    inputRef.current?.focus()
  }

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <div className="todo-input-row">
        <input
          ref={inputRef}
          type="text"
          className="todo-input"
          placeholder="Add a new task…"
          value={text}
          maxLength={200}
          onChange={e => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
        />
        <button type="submit" className="todo-add-btn" disabled={!text.trim()}>
          Add
        </button>
      </div>

      {expanded && (
        <TaskFields
          value={fields}
          onChange={update => setFields(f => ({ ...f, ...update }))}
        />
      )}
    </form>
  )
}

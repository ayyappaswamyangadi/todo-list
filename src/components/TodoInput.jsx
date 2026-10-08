import React, { useState, useRef } from 'react'

const PRIORITIES = ['low', 'medium', 'high']

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef(null)

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = (e) => {
    e && e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      inputRef.current?.focus()
      return
    }
    onAdd({ text: trimmed, priority, dueDate: dueDate || null })
    setText('')
    setDueDate('')
    setPriority('medium')
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
        <div className="todo-input-extras">
          <div className="priority-group">
            <span className="extras-label">Priority</span>
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                className={`priority-chip priority-${p}${priority === p ? ' selected' : ''}`}
                onClick={() => setPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <label className="date-label">
            <span className="extras-label">Due</span>
            <input
              type="date"
              className="date-input"
              value={dueDate}
              min={today}
              onChange={e => setDueDate(e.target.value)}
            />
          </label>
        </div>
      )}
    </form>
  )
}

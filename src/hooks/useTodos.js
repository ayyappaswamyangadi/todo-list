import { useState, useEffect, useCallback } from 'react'
import { scheduleFields } from '../utils/reminders'

const STORAGE_KEY = 'taskflow_todos_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function useTodos() {
  const [todos, setTodos] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback(({
    text, priority = 'medium', dueDate = null, dueTime = null, flagged = false, category = '',
  }) => {
    const now = Date.now()
    setTodos(prev => [
      {
        id: generateId(),
        text,
        priority,
        ...scheduleFields(dueDate, dueTime, now),
        flagged,
        category,
        completed: false,
        createdAt: now,
        completedAt: null,
      },
      ...prev,
    ])
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : null }
          : t
      )
    )
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  // Changing the date/time starts the reminder over (clears snooze and nag state).
  const editTodo = useCallback((id, updates) => {
    setTodos(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const next = { ...t, ...updates }
        const rescheduled = next.dueDate !== t.dueDate || next.dueTime !== t.dueTime
        return rescheduled ? { ...next, ...scheduleFields(next.dueDate, next.dueTime) } : next
      })
    )
  }, [])

  const toggleFlag = useCallback((id) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, flagged: !t.flagged } : t)))
  }, [])

  // Hide the reminder until `until`, then notify again.
  const snooze = useCallback((id, until) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, snoozedUntil: until, lastNotifiedAt: null } : t))
    )
  }, [])

  const markNotified = useCallback((ids, at) => {
    setTodos(prev => prev.map(t => (ids.includes(t.id) ? { ...t, lastNotifiedAt: at } : t)))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed))
  }, [])

  return {
    todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleFlag,
    snooze, markNotified, clearCompleted,
  }
}

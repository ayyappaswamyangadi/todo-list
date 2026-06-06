import { useState, useEffect, useCallback } from 'react'

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

  const addTodo = useCallback(({ text, priority = 'medium', dueDate = null, category = '' }) => {
    setTodos(prev => [
      {
        id: generateId(),
        text,
        priority,
        dueDate,
        category,
        completed: false,
        createdAt: Date.now(),
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

  const editTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed))
  }, [])

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted }
}

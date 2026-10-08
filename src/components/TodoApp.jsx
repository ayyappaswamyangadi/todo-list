import React, { useState, useMemo } from 'react'
import { useTodos } from '../hooks/useTodos'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import TodoFilters from './TodoFilters'
import TodoStats from './TodoStats'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export default function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('created')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = todos

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.text.toLowerCase().includes(q))
    }

    if (filter === 'active') list = list.filter(t => !t.completed)
    if (filter === 'completed') list = list.filter(t => t.completed)

    return [...list].sort((a, b) => {
      if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sort === 'due') {
        if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (sort === 'alpha') return a.text.localeCompare(b.text)
      return b.createdAt - a.createdAt
    })
  }, [todos, filter, sort, search])

  const completedCount = todos.filter(t => t.completed).length
  const highPriorityCount = todos.filter(t => t.priority === 'high' && !t.completed).length
  const isEmpty = filtered.length === 0

  return (
    <main className="todo-container">
      <TodoInput onAdd={addTodo} />

      {todos.length > 0 && (
        <TodoStats total={todos.length} completed={completedCount} highPriority={highPriorityCount} />
      )}

      {todos.length > 0 && (
        <TodoFilters
          filter={filter} setFilter={setFilter}
          sort={sort} setSort={setSort}
          search={search} setSearch={setSearch}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      )}

      {isEmpty && (
        <div className="todo-empty">
          {todos.length === 0 ? (
            <>
              <div className="empty-icon">📋</div>
              <p>No tasks yet. Add one above!</p>
            </>
          ) : (
            <>
              <div className="empty-icon">🔍</div>
              <p>No tasks match your current filter.</p>
            </>
          )}
        </div>
      )}

      {!isEmpty && (
        <ul className="todo-list">
          {filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}
    </main>
  )
}

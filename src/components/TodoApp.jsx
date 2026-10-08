import React, { useState, useMemo } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useReminders } from '../hooks/useReminders'
import { reminderTimestamp } from '../utils/reminders'
import { groupTodos, GROUP_MODES } from '../utils/grouping'
import RemindersPanel from './RemindersPanel'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import TodoFilters from './TodoFilters'
import TodoStats from './TodoStats'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }
const GROUP_KEY = 'taskflow_group_by'

function loadGroupBy() {
  try {
    const saved = localStorage.getItem(GROUP_KEY)
    return GROUP_MODES.includes(saved) ? saved : 'day'
  } catch {
    return 'day'
  }
}

export default function TodoApp() {
  const {
    todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleFlag,
    snooze, markNotified, clearCompleted,
  } = useTodos()
  const { now, dueNow, permission, requestPermission } = useReminders(todos, markNotified)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('due')
  const [groupBy, setGroupBy] = useState(loadGroupBy)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = todos

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.text.toLowerCase().includes(q))
    }

    if (filter === 'active') list = list.filter(t => !t.completed)
    if (filter === 'completed') list = list.filter(t => t.completed)
    if (filter === 'flagged') list = list.filter(t => t.flagged)

    return [...list].sort((a, b) => {
      if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sort === 'due') {
        if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return reminderTimestamp(a) - reminderTimestamp(b)
      }
      if (sort === 'alpha') return a.text.localeCompare(b.text)
      return b.createdAt - a.createdAt
    })
  }, [todos, filter, sort, search])

  const completedCount = todos.filter(t => t.completed).length
  const highPriorityCount = todos.filter(t => t.priority === 'high' && !t.completed).length
  const isEmpty = filtered.length === 0
  const groups = useMemo(() => groupTodos(filtered, groupBy, new Date(now)), [filtered, groupBy, now])

  const changeGroupBy = (mode) => {
    setGroupBy(mode)
    try { localStorage.setItem(GROUP_KEY, mode) } catch { /* not persisted */ }
  }

  return (
    <main className="todo-container">
      <RemindersPanel
        dueNow={dueNow}
        now={now}
        permission={permission}
        onEnable={requestPermission}
        onDone={toggleTodo}
        onSnooze={snooze}
      />

      <TodoInput onAdd={addTodo} />

      {todos.length > 0 && (
        <TodoStats total={todos.length} completed={completedCount} highPriority={highPriorityCount} />
      )}

      {todos.length > 0 && (
        <TodoFilters
          filter={filter} setFilter={setFilter}
          sort={sort} setSort={setSort}
          groupBy={groupBy} setGroupBy={changeGroupBy}
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

      {!isEmpty && groups.map(group => (
        <section key={group.key} className="todo-group" aria-label={group.label ?? 'Tasks'}>
          {group.label && (
            <h3 className={`group-title${group.key === '0-overdue' ? ' overdue' : ''}`}>
              {group.label}
              <span className="group-count">{group.todos.length}</span>
            </h3>
          )}
          <ul className="todo-list">
            {group.todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                now={now}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                onToggleFlag={toggleFlag}
              />
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}

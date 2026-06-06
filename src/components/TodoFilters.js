import React from 'react'

const FILTERS = ['all', 'active', 'completed']

export default function TodoFilters({
  filter, setFilter,
  sort, setSort,
  search, setSearch,
  completedCount,
  onClearCompleted,
}) {
  return (
    <div className="todo-filters">
      <div className="search-wrapper">
        <span className="search-icon" aria-hidden>🔍</span>
        <input
          type="search"
          className="search-input"
          placeholder="Search tasks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
        )}
      </div>

      <div className="filter-row">
        <div className="filter-tabs" role="group" aria-label="Filter tasks">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-tab${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <select
          className="sort-select"
          value={sort}
          onChange={e => setSort(e.target.value)}
          aria-label="Sort tasks"
        >
          <option value="created">Newest first</option>
          <option value="priority">Priority</option>
          <option value="due">Due date</option>
          <option value="alpha">A → Z</option>
        </select>
      </div>

      {completedCount > 0 && (
        <div className="filter-actions">
          <button className="clear-completed-btn" onClick={onClearCompleted}>
            Clear {completedCount} completed
          </button>
        </div>
      )}
    </div>
  )
}

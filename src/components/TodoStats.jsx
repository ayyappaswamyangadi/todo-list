import React from 'react'

export default function TodoStats({ total, completed, highPriority }) {
  if (total === 0) return null
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="todo-stats">
      <div className="stats-row">
        <div className="stats-numbers">
          <span className="stats-main">{completed} / {total} done</span>
          {highPriority > 0 && (
            <span className="stats-high-priority">· {highPriority} high priority</span>
          )}
        </div>
        <span className="stats-pct">{pct}%</span>
      </div>
      <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

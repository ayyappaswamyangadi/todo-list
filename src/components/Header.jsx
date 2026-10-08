import React from 'react'

export default function Header({ darkMode, onToggleDark }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-check" aria-hidden="true">✓</span>
        TaskFlow
      </div>
      <button
        className="dark-toggle"
        onClick={onToggleDark}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀' : '🌙'}
      </button>
    </nav>
  )
}

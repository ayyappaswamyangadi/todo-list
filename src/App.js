import React, { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import { Footer } from './components/Footer'
import TodoApp from './components/TodoApp'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('taskflow_dark')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    localStorage.setItem('taskflow_dark', darkMode)
  }, [darkMode])

  return (
    <>
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
      <TodoApp />
      <Footer />
    </>
  )
}

export default App

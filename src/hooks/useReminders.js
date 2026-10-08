import { useState, useEffect, useCallback } from 'react'
import { isReminderDue, shouldNotify, formatDue } from '../utils/reminders'

// Browsers throttle timers in background tabs to about once a minute,
// so polling is as precise as a timer here, and it also picks up any
// reminders that were missed while the tab or laptop was asleep.
const TICK_MS = 15 * 1000

const supported = typeof window !== 'undefined' && 'Notification' in window

function showNotification(todo) {
  if (!supported || Notification.permission !== 'granted') return
  const due = formatDue(todo)
  const n = new Notification(`⏰ ${todo.text}`, {
    body: due ? `Due ${due}${todo.flagged ? ' · flagged' : ''}` : 'Reminder',
    tag: todo.id, // replaces an earlier notification for the same task instead of stacking
    requireInteraction: true, // stays on screen until dismissed (where supported)
  })
  n.onclick = () => {
    window.focus()
    n.close()
  }
}

export function useReminders(todos, markNotified) {
  const [now, setNow] = useState(Date.now)
  const [permission, setPermission] = useState(supported ? Notification.permission : 'unsupported')

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const id = setInterval(tick, TICK_MS)
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('focus', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('focus', tick)
    }
  }, [])

  useEffect(() => {
    const toNotify = todos.filter(t => shouldNotify(t, now))
    if (toNotify.length === 0) return
    toNotify.forEach(showNotification)
    markNotified(toNotify.map(t => t.id), now)
  }, [todos, now, markNotified])

  const dueNow = todos.filter(t => isReminderDue(t, now))

  // Show the count in the tab title so a background tab still catches your eye.
  useEffect(() => {
    document.title = dueNow.length > 0 ? `(${dueNow.length}) TaskFlow` : 'TaskFlow'
  }, [dueNow.length])

  const requestPermission = useCallback(async () => {
    if (!supported) return
    setPermission(await Notification.requestPermission())
  }, [])

  return { now, dueNow, permission, requestPermission }
}

import React from 'react'

const pad = n => String(n).padStart(2, '0')
const daysInMonth = (y, m) => new Date(y, m, 0).getDate()
const range = (from, to, step = 1) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step)

const MONTHS = range(0, 11).map(i => new Date(2000, i, 1).toLocaleDateString(undefined, { month: 'short' }))
const YEARS_AHEAD = 5
const MINUTE_STEP = 5

// Day / Month / Year dropdowns. `value` is 'YYYY-MM-DD' or ''.
// Picking any part of an empty date fills the rest from today.
export function DatePicker({ value, onChange }) {
  const today = new Date()
  const thisYear = today.getFullYear()
  const [y, m, d] = value ? value.split('-').map(Number) : [null, null, null]

  const set = (part, v) => {
    const base = value ? { y, m, d } : { y: thisYear, m: today.getMonth() + 1, d: today.getDate() }
    const next = { ...base, [part]: Number(v) }
    next.d = Math.min(next.d, daysInMonth(next.y, next.m))
    onChange(`${next.y}-${pad(next.m)}-${pad(next.d)}`)
  }

  const years = range(thisYear, thisYear + YEARS_AHEAD)
  if (y && !years.includes(y)) years.unshift(y)
  const days = range(1, value ? daysInMonth(y, m) : 31)
  const weekday = value && new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short' })

  return (
    <span className="picker" role="group" aria-label="Due date">
      <select className="picker-select" aria-label="Day" value={d ?? ''} onChange={e => set('d', e.target.value)}>
        <option value="" disabled>Day</option>
        {days.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <select className="picker-select" aria-label="Month" value={m ?? ''} onChange={e => set('m', e.target.value)}>
        <option value="" disabled>Month</option>
        {MONTHS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
      </select>
      <select className="picker-select" aria-label="Year" value={y ?? ''} onChange={e => set('y', e.target.value)}>
        <option value="" disabled>Year</option>
        {years.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      {weekday && <span className="picker-weekday">{weekday}</span>}
    </span>
  )
}

function to12(hhmm) {
  const [H, min] = hhmm.split(':').map(Number)
  return { h: H % 12 || 12, min, period: H < 12 ? 'AM' : 'PM' }
}

function to24({ h, min, period }) {
  return `${pad((h % 12) + (period === 'PM' ? 12 : 0))}:${pad(min)}`
}

// Hour / Minute / AM-PM dropdowns. `value` is 'HH:MM' (24h) or ''.
// Picking any part of an empty time starts from the next full hour.
export function TimePicker({ value, onChange }) {
  const parsed = value ? to12(value) : null

  const set = (part, v) => {
    const base = parsed ?? to12(`${pad((new Date().getHours() + 1) % 24)}:00`)
    onChange(to24({ ...base, [part]: part === 'period' ? v : Number(v) }))
  }

  const minutes = range(0, 60 - MINUTE_STEP, MINUTE_STEP)
  if (parsed && !minutes.includes(parsed.min)) {
    minutes.push(parsed.min)
    minutes.sort((a, b) => a - b)
  }

  return (
    <span className="picker" role="group" aria-label="Due time">
      <select className="picker-select" aria-label="Hour" value={parsed?.h ?? ''} onChange={e => set('h', e.target.value)}>
        <option value="" disabled>Hour</option>
        {range(1, 12).map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <span className="picker-sep">:</span>
      <select className="picker-select" aria-label="Minute" value={parsed?.min ?? ''} onChange={e => set('min', e.target.value)}>
        <option value="" disabled>Min</option>
        {minutes.map(n => <option key={n} value={n}>{pad(n)}</option>)}
      </select>
      <select className="picker-select" aria-label="AM or PM" value={parsed?.period ?? ''} onChange={e => set('period', e.target.value)}>
        <option value="" disabled>AM/PM</option>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </span>
  )
}

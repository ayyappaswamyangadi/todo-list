import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  window.matchMedia = window.matchMedia || (() => ({ matches: false }))
})

test('renders the TaskFlow header and empty state', () => {
  render(<App />)
  expect(screen.getByText('TaskFlow')).toBeInTheDocument()
  expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
})

test('adds, completes and deletes a task', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByPlaceholderText(/add a new task/i), 'Buy milk{Enter}')
  expect(screen.getByText('Buy milk')).toBeInTheDocument()
  expect(screen.getByText('0 / 1 done')).toBeInTheDocument()

  await user.click(screen.getByRole('checkbox', { name: /buy milk/i }))
  expect(screen.getByText('1 / 1 done')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /delete task/i }))
  expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
})

test('flags a task and filters by flagged', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByPlaceholderText(/add a new task/i), 'Call mom{Enter}')
  await user.type(screen.getByPlaceholderText(/add a new task/i), 'Pay rent{Enter}')
  expect(screen.getAllByText(/^Added /)).toHaveLength(2)

  await user.click(screen.getAllByRole('button', { name: /flag task/i })[0])
  await user.click(screen.getByRole('button', { name: 'Flagged' }))
  expect(screen.getByText('Pay rent')).toBeInTheDocument()
  expect(screen.queryByText('Call mom')).not.toBeInTheDocument()
})

test('a task whose time has passed shows up in the reminders panel', async () => {
  const user = userEvent.setup()
  const past = new Date(Date.now() - 60 * 60 * 1000)
  const pad = n => String(n).padStart(2, '0')
  localStorage.setItem('taskflow_todos_v1', JSON.stringify([{
    id: '1', text: 'Submit form', priority: 'high', completed: false, flagged: false,
    dueDate: `${past.getFullYear()}-${pad(past.getMonth() + 1)}-${pad(past.getDate())}`,
    dueTime: `${pad(past.getHours())}:${pad(past.getMinutes())}`,
    createdAt: past.getTime(), lastNotifiedAt: null, snoozedUntil: null,
  }]))
  render(<App />)

  expect(screen.getByText(/1 reminder needs attention/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '1 hr' }))
  expect(screen.queryByText(/reminder needs attention/i)).not.toBeInTheDocument()
})

test('edits a task’s name, priority, date/time and flag after it was added', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByPlaceholderText(/add a new task/i), 'Buy milk{Enter}')
  expect(screen.getByText('medium priority')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /edit task/i }))
  const name = screen.getByRole('textbox', { name: /task name/i })
  await user.clear(name)
  await user.type(name, 'Buy oat milk')
  await user.click(screen.getByRole('button', { name: 'high' }))
  await user.click(screen.getByRole('button', { name: /⚑ flag/i }))
  await user.selectOptions(screen.getByLabelText('Day'), '15')
  await user.selectOptions(screen.getByLabelText('Month'), '1')
  await user.selectOptions(screen.getByLabelText('Year'), String(new Date().getFullYear() + 1))
  await user.selectOptions(screen.getByLabelText('Hour'), '6')
  await user.selectOptions(screen.getByLabelText('Minute'), '30')
  await user.selectOptions(screen.getByLabelText('AM or PM'), 'PM')
  await user.click(screen.getByRole('button', { name: 'Save' }))

  expect(screen.getByText('Buy oat milk')).toBeInTheDocument()
  expect(screen.getByText('high priority')).toBeInTheDocument()
  expect(screen.getByText('⚑ Flagged')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: new RegExp(`15.*${new Date().getFullYear() + 1}.*6:30`, 'i') })).toBeInTheDocument()
})

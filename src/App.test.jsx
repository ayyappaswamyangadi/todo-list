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

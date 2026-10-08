import { groupTodos } from './grouping'

const now = new Date(2026, 9, 8, 12) // Thu 8 Oct 2026
const t = (id, dueDate, completed = false) => ({ id, dueDate, completed })
const todos = [
  t('overdue', '2026-10-01'),
  t('done-past', '2026-10-06', true),
  t('today', '2026-10-08'),
  t('fri', '2026-10-10'),
  t('next-week', '2026-10-14'),
  t('nov', '2026-11-03'),
  t('nodate', null),
]
const summary = groups => groups.map(g => [g.label, g.todos.map(x => x.id)])

test('groups by day with Overdue first and No date last', () => {
  const groups = groupTodos(todos, 'day', now)
  expect(groups[0].label).toBe('Overdue')
  expect(groups[0].todos.map(x => x.id)).toEqual(['overdue'])
  expect(groups.find(g => g.todos[0].id === 'today').label).toMatch(/^Today · /)
  expect(groups.at(-1).label).toBe('No date')
  expect(groups).toHaveLength(7)
})

test('groups by week (weeks start Monday)', () => {
  expect(summary(groupTodos(todos, 'week', now))).toEqual([
    ['Overdue', ['overdue']],
    ['This week', ['done-past', 'today', 'fri']],
    ['Next week', ['next-week']],
    [expect.stringMatching(/^Week of /), ['nov']],
    ['No date', ['nodate']],
  ])
})

test('groups by month', () => {
  const groups = summary(groupTodos(todos, 'month', now))
  expect(groups[1]).toEqual([expect.stringMatching(/^This month/), ['done-past', 'today', 'fri', 'next-week']])
  expect(groups[2][1]).toEqual(['nov'])
})

test('no grouping returns one unlabeled group', () => {
  expect(groupTodos(todos, 'none', now)).toEqual([{ key: 'all', label: null, todos }])
})

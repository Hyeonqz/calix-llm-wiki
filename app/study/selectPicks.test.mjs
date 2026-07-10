import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dueToday, nextTodos, todaysPicks } from './selectPicks.mjs'

const cats = [
  { label: 'OS', topics: [
    { id: 'a', status: 'done', added: '2026-07-01', srs: { next: '2026-07-09' } },
    { id: 'b', status: 'todo', added: '2026-07-02', srs: null },
  ] },
  { label: 'Net', topics: [
    { id: 'c', status: 'todo', added: '2026-07-01', srs: null },
    { id: 'd', status: 'done', added: '2026-07-01', srs: { next: '2026-07-20' } },
  ] },
]

test('dueToday returns only topics whose srs.next <= today', () => {
  assert.deepEqual(dueToday(cats, '2026-07-10').map((t) => t.id), ['a'])
})

test('dueToday tags each result with its category label', () => {
  assert.equal(dueToday(cats, '2026-07-10')[0].category, 'OS')
})

test('nextTodos round-robins oldest todo across categories', () => {
  // OS 'b' added 07-02, Net 'c' added 07-01. Round-robin walks categories in order: OS→Net.
  assert.deepEqual(nextTodos(cats, 5).map((t) => t.id), ['b', 'c'])
})

test('nextTodos respects the limit', () => {
  assert.equal(nextTodos(cats, 1).length, 1)
})

test('todaysPicks fills remaining slots after due items', () => {
  const { due, todos } = todaysPicks(cats, '2026-07-10', 2)
  assert.equal(due.length, 1)
  assert.equal(todos.length, 1) // limit 2 - 1 due = 1 todo
})

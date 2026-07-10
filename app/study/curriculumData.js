import fs from 'fs'
import path from 'path'

export { dueToday, nextTodos, todaysPicks } from './selectPicks.mjs'

// Reads repo-root study/curriculum.json. Missing/invalid file → empty curriculum.
export function readCurriculum() {
  const file = path.join(process.cwd(), 'study', 'curriculum.json')
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return { categories: [] }
  }
}

// Reads repo-root study/roadmap.json. Missing/invalid file → empty roadmap.
export function readRoadmap() {
  const file = path.join(process.cwd(), 'study', 'roadmap.json')
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return { weekly: [], monthly: [], yearly: [] }
  }
}

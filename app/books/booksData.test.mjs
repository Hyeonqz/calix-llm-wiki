import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFrontmatter, countChapters, countParts } from './booksData.mjs'

const META = `export default {
  index: '들어가며 (서문)',

  '_part1': { type: 'separator', title: 'Part 1 · 원론' },
  'step-01-birth': '01. 탄생',
  'step-02-problem': '02. 문제',

  '_part2': { type: 'separator', title: 'Part 2 · 발전사' },
  'step-03-layered': '03. 레이어드',

  '_appendix': { type: 'separator', title: '부록' },
  'appendix-a-d': '부록 A~D',
}`

test('countChapters: index·separator·부록 제외한 장만 센다', () => {
  // step 3개 (appendix-a-d는 부록이라 제외) = 3
  assert.equal(countChapters(META), 3)
})

test('countParts: 부록 구분자를 제외한 파트만 센다', () => {
  // _part1, _part2 = 2 (_appendix는 부록이라 제외)
  assert.equal(countParts(META), 2)
})

test('parseFrontmatter: 따옴표를 벗겨 키-값을 뽑는다', () => {
  const raw = `---
title: "들어가며"
book: "소프트웨어 아키텍처 Deep Dive"
status: 완간
---
# 본문`
  const fm = parseFrontmatter(raw)
  assert.equal(fm.book, '소프트웨어 아키텍처 Deep Dive')
  assert.equal(fm.title, '들어가며')
  assert.equal(fm.status, '완간')
})

test('parseFrontmatter: 프론트매터 없으면 빈 객체', () => {
  assert.deepEqual(parseFrontmatter('# 제목만'), {})
})

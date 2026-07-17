import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFrontmatter, countChapters, countParts, parseBookNav } from './booksData.mjs'

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

test('parseBookNav: 부(part)/장(chapter)을 등장 순서대로 뽑는다', () => {
  const nav = parseBookNav(META, 'sw')
  // index + step 3개 + appendix 1개 = chapter 5, separator = part 3 → 총 8
  assert.equal(nav.length, 8)
  // 첫 항목은 index → 책 루트로 링크
  assert.deepEqual(nav[0], { type: 'chapter', href: '/books/sw', label: '들어가며 (서문)' })
  // 두 번째는 파트 헤더
  assert.deepEqual(nav[1], { type: 'part', title: 'Part 1 · 원론' })
  // step 챕터는 슬러그로 링크
  assert.deepEqual(nav[2], { type: 'chapter', href: '/books/sw/step-01-birth', label: '01. 탄생' })
})

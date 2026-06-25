'use client'

import { useState } from 'react'

export default function TilLogoutButton() {
  const [hovered, setHovered] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px',
        background: 'transparent',
        border: `1px solid ${hovered ? '#9ca3af' : '#d1d5db'}`,
        borderRadius: '6px',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: hovered ? '#374151' : '#6b7280',
        cursor: loading ? 'default' : 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {loading ? '...' : '로그아웃'}
    </button>
  )
}

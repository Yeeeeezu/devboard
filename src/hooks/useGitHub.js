import { useState, useEffect } from 'react'

const CACHE = new Map()
const CACHE_TTL = 60_000

async function fetchGH(path) {
  const cached = CACHE.get(path)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data

  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get('x-ratelimit-reset')
    const remaining = res.headers.get('x-ratelimit-remaining')
    if (remaining === '0' && reset) {
      const resetDate = new Date(Number(reset) * 1000).toLocaleTimeString()
      throw new Error(`rate limited — resets at ${resetDate}`)
    }
  }

  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`)
  const data = await res.json()
  CACHE.set(path, { data, ts: Date.now() })
  return data
}

export function useRepos(user) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchGH(`/users/${user}/repos?sort=updated&per_page=30`)
      .then(data => {
        setRepos(data.filter(r => !r.fork && r.name !== user))
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [user])

  return { repos, loading, error }
}

export function useActivity(user) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchGH(`/users/${user}/events/public?per_page=30`)
      .then(data => { setEvents(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [user])

  return { events, loading, error }
}
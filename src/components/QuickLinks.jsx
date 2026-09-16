import { useState } from 'react'
import styles from './QuickLinks.module.css'

const DEFAULT_LINKS = [
  { label: 'github',    url: 'https://github.com/Yeeeeezu',          group: 'dev' },
  { label: 'docs',      url: 'https://docs.github.com',              group: 'dev' },
  { label: 'mdn',       url: 'https://developer.mozilla.org',        group: 'dev' },
  { label: 'crates.io', url: 'https://crates.io',                    group: 'dev' },
  { label: 'npm',       url: 'https://npmjs.com',                    group: 'dev' },
  { label: 'nuget',     url: 'https://nuget.org',                    group: 'dev' },
]

const STORAGE_KEY = 'devboard-links'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_LINKS
  } catch {
    return DEFAULT_LINKS
  }
}

function save(links) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(links)) } catch {}
}

export default function QuickLinks() {
  const [links, setLinks] = useState(load)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ label: '', url: '', group: 'dev' })

  function addLink() {
    if (!form.label || !form.url) return
    const url = form.url.startsWith('http') ? form.url : `https://${form.url}`
    const next = [...links, { ...form, url }]
    setLinks(next)
    save(next)
    setForm({ label: '', url: '', group: 'dev' })
    setAdding(false)
  }

  function removeLink(i) {
    const next = links.filter((_, idx) => idx !== i)
    setLinks(next)
    save(next)
  }

  const groups = [...new Set(links.map(l => l.group))]

  return (
    <div className={styles.container}>
      {groups.map(g => (
        <div key={g} className={styles.group}>
          <div className={styles.groupLabel}>{g}</div>
          <div className={styles.chips}>
            {links.filter(l => l.group === g).map((l, i) => (
              <div key={i} className={styles.chip}>
                <a href={l.url} target="_blank" rel="noreferrer" className={styles.chipLink}>
                  {l.label}
                </a>
                <button className={styles.remove} onClick={() => removeLink(links.indexOf(l))}>×</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {adding ? (
        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="label"
            value={form.label}
            onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          />
          <input
            className={styles.input}
            placeholder="url"
            value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
          />
          <input
            className={styles.input}
            placeholder="group"
            value={form.group}
            onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
          />
          <button className={styles.btnPrimary} onClick={addLink}>add</button>
          <button className={styles.btnSecondary} onClick={() => setAdding(false)}>cancel</button>
        </div>
      ) : (
        <button className={styles.btnAdd} onClick={() => setAdding(true)}>+ add link</button>
      )}
    </div>
  )
}

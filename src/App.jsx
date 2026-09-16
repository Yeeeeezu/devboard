import { useState } from 'react'
import Clock from './components/Clock.jsx'
import RepoGrid from './components/RepoGrid.jsx'
import QuickLinks from './components/QuickLinks.jsx'
import ActivityFeed from './components/ActivityFeed.jsx'
import styles from './App.module.css'

const GITHUB_USER = 'Yeeeeezu'

export default function App() {
  const [tab, setTab] = useState('repos')

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMono}>~/</span>
          <span className={styles.brandName}>devboard</span>
        </div>
        <Clock />
        <nav className={styles.nav}>
          {['repos', 'activity', 'links'].map(t => (
            <button
              key={t}
              className={`${styles.navBtn} ${tab === t ? styles.active : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className={styles.main}>
        {tab === 'repos'    && <RepoGrid user={GITHUB_USER} />}
        {tab === 'activity' && <ActivityFeed user={GITHUB_USER} />}
        {tab === 'links'    && <QuickLinks />}
      </main>

      <footer className={styles.footer}>
        <span>
          <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
            {GITHUB_USER}
          </a>
          {' '}· devboard · experiment run by claude
        </span>
      </footer>
    </div>
  )
}

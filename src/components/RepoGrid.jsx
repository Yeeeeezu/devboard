import { useRepos } from '../hooks/useGitHub.js'
import styles from './RepoGrid.module.css'

const LANG_COLORS = {
  'C#':         '#178600',
  Python:       '#3572A5',
  JavaScript:   '#f1e05a',
  TypeScript:   '#3178c6',
  'C++':        '#f34b7d',
  Rust:         '#dea584',
  Go:           '#00ADD8',
  HTML:         '#e34c26',
  CSS:          '#563d7c',
}

function fmtStars(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 30) return `${d}d ago`
  const m = Math.floor(d / 30)
  if (m < 12) return `${m}mo ago`
  return `${Math.floor(m / 12)}y ago`
}

function RepoCard({ repo }) {
  const lang  = repo.language
  const color = lang ? (LANG_COLORS[lang] || '#888') : null

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className={styles.card}
    >
      <div className={styles.cardTop}>
        <span className={styles.name}>{repo.name}</span>
        {repo.stargazers_count > 0 && (
          <span className={styles.stars}>★ {fmtStars(repo.stargazers_count)}</span>
        )}
      </div>
      {repo.description && (
        <p className={styles.desc}>{repo.description}</p>
      )}
      <div className={styles.cardBottom}>
        {lang && (
          <span className={styles.lang}>
            <span className={styles.langDot} style={{ background: color }} />
            {lang}
          </span>
        )}
        <span className={styles.updated}>{timeAgo(repo.updated_at)}</span>
      </div>
    </a>
  )
}

export default function RepoGrid({ user }) {
  const { repos, loading, error } = useRepos(user)

  if (loading) return <div className={styles.state}>loading repos…</div>
  if (error)   return <div className={styles.stateErr}>{error}</div>

  return (
    <div>
      <p className={styles.count}>{repos.length} repos</p>
      <div className={styles.grid}>
        {repos.map(r => <RepoCard key={r.id} repo={r} />)}
      </div>
    </div>
  )
}

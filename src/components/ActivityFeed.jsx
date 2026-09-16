import { useActivity } from '../hooks/useGitHub.js'
import styles from './ActivityFeed.module.css'

function describeEvent(e) {
  switch (e.type) {
    case 'PushEvent': {
      const n = e.payload.commits?.length ?? 0
      const ref = e.payload.ref?.replace('refs/heads/', '')
      return `pushed ${n} commit${n !== 1 ? 's' : ''} to ${e.repo.name} (${ref})`
    }
    case 'CreateEvent':
      return `created ${e.payload.ref_type} ${e.payload.ref ?? ''} in ${e.repo.name}`
    case 'DeleteEvent':
      return `deleted ${e.payload.ref_type} ${e.payload.ref} in ${e.repo.name}`
    case 'WatchEvent':
      return `starred ${e.repo.name}`
    case 'ForkEvent':
      return `forked ${e.repo.name}`
    case 'IssuesEvent':
      return `${e.payload.action} issue in ${e.repo.name}`
    case 'IssueCommentEvent':
      return `commented on issue in ${e.repo.name}`
    case 'PullRequestEvent':
      return `${e.payload.action} PR in ${e.repo.name}`
    case 'ReleaseEvent':
      return `released ${e.payload.release?.tag_name} in ${e.repo.name}`
    default:
      return `${e.type.replace('Event', '')} in ${e.repo.name}`
  }
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const TYPE_ICON = {
  PushEvent:        '↑',
  CreateEvent:      '+',
  DeleteEvent:      '×',
  WatchEvent:       '★',
  ForkEvent:        '⑂',
  IssuesEvent:      '!',
  IssueCommentEvent:'⌥',
  PullRequestEvent: '⇄',
  ReleaseEvent:     '◈',
}

export default function ActivityFeed({ user }) {
  const { events, loading, error } = useActivity(user)

  if (loading) return <div className={styles.state}>loading activity…</div>
  if (error)   return <div className={styles.stateErr}>{error}</div>
  if (!events.length) return <div className={styles.state}>no public activity</div>

  return (
    <div className={styles.feed}>
      {events.map(e => (
        <div key={e.id} className={styles.row}>
          <span className={styles.icon}>{TYPE_ICON[e.type] ?? '·'}</span>
          <span className={styles.desc}>{describeEvent(e)}</span>
          <span className={styles.time}>{timeAgo(e.created_at)}</span>
        </div>
      ))}
    </div>
  )
}

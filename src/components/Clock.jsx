import { useState, useEffect } from 'react'
import styles from './Clock.module.css'

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = n => String(n).padStart(2, '0')
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className={styles.clock}>
      <span className={styles.time}>{time}</span>
      <span className={styles.date}>{date}</span>
    </div>
  )
}

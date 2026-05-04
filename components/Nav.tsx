import { useState } from 'react'
import Link from 'next/link'

const NAV_CTA_URL = 'https://www.strivemath.com/?show_form=true&plan=navbar'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <nav>
      <div className="nav-inner">
        <a href="https://strivemath.com" className="nav-logo">Strive<span>.</span></a>
        <ul className="nav-links">
          <li><a href="https://www.strivemath.com">Coding</a></li>
          <li><Link href="/math">Mathematics</Link></li>
          <li><Link href="/ai-first-software-development">AI-First Software Development</Link></li>
          <li><Link href="/holidaycamps">Holiday Bootcamps</Link></li>
        </ul>
        <a href={NAV_CTA_URL} className="nav-cta">Book a Free Trial</a>
        <button
          className="nav-burger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>
      </div>
      <div className={`nav-mobile-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        <ul>
          <li><a href="https://www.strivemath.com" onClick={close}>Coding</a></li>
          <li><Link href="/math" onClick={close}>Mathematics</Link></li>
          <li><Link href="/ai-first-software-development" onClick={close}>AI-First Software Development</Link></li>
          <li><Link href="/holidaycamps" onClick={close}>Holiday Bootcamps</Link></li>
        </ul>
      </div>
    </nav>
  )
}

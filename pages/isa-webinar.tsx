import Head from 'next/head'
import Link from 'next/link'

const trialUrl = process.env.NEXT_PUBLIC_TRIAL_URL || '/math#trial'

export default function ISAWebinar() {
  return (
    <>
      <Head>
        <title>ISA Webinar: Turn ISA Results Into a Roadmap for Growth — Strive</title>
        <meta name="description" content="A free talk for parents on how to interpret ISA results and unlock your child's potential. Hosted by Pulkit Agarwal, CEO of Strive Math." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <nav>
        <div className="nav-inner">
          <a href="https://strivemath.com" className="nav-logo">Strive<span>.</span></a>
          <ul className="nav-links">
            <li><a href="https://www.strivemath.com">Coding</a></li>
            <li><Link href="/math">Mathematics</Link></li>
            <li><Link href="/ai-first-software-development">AI-First Software Development</Link></li>
            <li><Link href="/holidaycamps">Holiday Bootcamps</Link></li>
          </ul>
          <a href={trialUrl} className="nav-cta">Book a Free Trial</a>
        </div>
      </nav>

      <main>
        <section style={{ background: 'var(--bg-subtle)', paddingTop: '80px' }}>
          <div className="section-inner" style={{ maxWidth: '680px' }}>
            <div className="webinar-past-badge">Past Event</div>
            <h1 className="section-title" style={{ fontSize: '36px', lineHeight: 1.2 }}>
              Turn ISA Results Into a<br />
              <span style={{ background: 'var(--gradient-cta)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roadmap for Growth</span>
            </h1>
            <p className="section-lead" style={{ marginTop: '20px' }}>
              ISA results don&apos;t define your child — but understanding them can unlock their true potential.
            </p>

            <div style={{ marginTop: '48px' }}>
              <span className="section-tag">Speaker</span>
              <div className="webinar-speaker-card">
                <div className="webinar-speaker-avatar">P</div>
                <div>
                  <p className="webinar-speaker-name">Pulkit Agarwal</p>
                  <p className="webinar-speaker-title">CEO, Strive Math</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '48px' }}>
              <span className="section-tag">What was covered</span>
              <ul className="webinar-topics">
                <li>What is the ISA test and why international schools use it</li>
                <li>Interpreting your child&apos;s scores and percentile rankings</li>
                <li>Proven strategies to boost performance</li>
              </ul>
            </div>

            <div style={{ marginTop: '48px', padding: '28px 32px', background: 'white', borderRadius: '16px', border: '1px solid rgba(15,21,116,0.08)' }}>
              <p style={{ fontSize: '16px', color: 'var(--text-dark)', marginBottom: '16px' }}>
                This event has passed. If you have questions about your child&apos;s ISA results or how Strive can help, we&apos;d love to chat.
              </p>
              <a href={trialUrl} className="btn-primary">Book a Free Trial</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <p className="footer-logo">Strive<span>.</span></p>
          <p>1-on-1 live classes in Math and Coding for students aged 8–18.</p>
          <p>Online and open to students worldwide.</p>
        </div>
      </footer>
    </>
  )
}

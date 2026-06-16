import Head from 'next/head'
import type { ReactNode } from 'react'

export interface FaqItem {
  question: string
  answer: string        // used for JSON-LD (plain text)
  answerNode?: ReactNode // used for HTML rendering when links/markup are needed
}

interface FaqSectionProps {
  faqs: FaqItem[]
  variant?: 'static' | 'accordion'
  tag?: string
  lead?: ReactNode // inline content only (text, <a>, <strong>)
}

export default function FaqSection({
  faqs,
  variant = 'static',
  tag = 'Common questions',
  lead,
}: FaqSectionProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <section style={{ background: 'white' }}>
        <div className="section-inner">
          <span className="section-tag">{tag}</span>
          <h2 className="section-title">Frequently asked questions</h2>
          {lead && <p className="section-lead">{lead}</p>}
          {variant === 'accordion' ? (
            <div className="faq-grid faq-grid--accordion">
              {faqs.map((faq, i) => (
                <details key={i} className="faq-item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answerNode ?? faq.answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <div className="faq-grid">
              {faqs.map((faq, i) => (
                <article key={i} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answerNode ?? faq.answer}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

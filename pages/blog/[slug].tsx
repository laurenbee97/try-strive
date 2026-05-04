import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import YouTubeEmbed from '@/components/blog/YouTubeEmbed'
import CodeEmbed from '@/components/blog/CodeEmbed'

function BlogImage({ src, alt, title }: { src?: string; alt?: string; title?: string }) {
  if (title) {
    return (
      <figure className="blog-figure">
        <img src={src} alt={alt ?? ''} />
        <figcaption>{title}</figcaption>
      </figure>
    )
  }
  return <img src={src} alt={alt ?? ''} />
}

function BlogParagraph({ children }: { children?: React.ReactNode }) {
  if (React.isValidElement(children) && children.type === BlogImage) {
    return children
  }
  return <p>{children}</p>
}

function BlogLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http') || href?.startsWith('//')
  if (isExternal) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  }
  return <a href={href} {...props}>{children}</a>
}

const components = { img: BlogImage, p: BlogParagraph, a: BlogLink, YouTubeEmbed, CodeEmbed }

interface Frontmatter {
  title: string
  date: string
  updatedDate?: string
  description: string
  tags: string[]
  coverImage?: string
}

interface BlogPostProps {
  source: MDXRemoteSerializeResult
  frontmatter: Frontmatter
  slug: string
}

const trialUrl = 'https://www.strivemath.com/?show_form=true&plan=navbar'

export default function BlogPost({ source, frontmatter, slug }: BlogPostProps) {
  const publishDate = new Date(frontmatter.date)
  const modifiedDate = frontmatter.updatedDate ? new Date(frontmatter.updatedDate) : publishDate

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updatedDate || frontmatter.date,
    url: `https://try.strivemath.com/blog/${slug}`,
    author: { '@type': 'Organization', name: 'Strive', url: 'https://strivemath.com' },
    publisher: { '@type': 'Organization', name: 'Strive', url: 'https://strivemath.com' },
  }
  if (frontmatter.coverImage) jsonLd.image = `https://try.strivemath.com${frontmatter.coverImage}`
  if (frontmatter.tags?.length) jsonLd.keywords = frontmatter.tags.join(', ')

  return (
    <>
      <Head>
        <title>{frontmatter.title} — Strive Blog</title>
        <meta name="description" content={frontmatter.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
        <meta property="article:published_time" content={frontmatter.date} />
        {frontmatter.updatedDate && (
          <meta property="article:modified_time" content={frontmatter.updatedDate} />
        )}
        {frontmatter.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <nav>
        <div className="nav-inner">
          <a href="https://strivemath.com" className="nav-logo">
            Strive<span>.</span>
          </a>
          <ul className="nav-links">
            <li><a href="https://www.strivemath.com">Coding</a></li>
            <li><Link href="/math">Mathematics</Link></li>
            <li><Link href="/ai-first-software-development">AI-First Software Development</Link></li>
            <li><Link href="/holidaycamps">Holiday Bootcamps</Link></li>
          </ul>
          <a href={trialUrl} className="nav-cta">Book a Free Trial</a>
        </div>
      </nav>

      <main className="blog-post-layout">
        <article className="blog-prose">
          <header className="blog-post-header">
            <div className="blog-post-meta">
              <Link href="/blog" className="blog-back">← Blog</Link>
              <time dateTime={frontmatter.date}>
                {publishDate.toLocaleDateString('en-SG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {frontmatter.updatedDate && (
                <span className="blog-updated">
                  Updated{' '}
                  <time dateTime={frontmatter.updatedDate}>
                    {modifiedDate.toLocaleDateString('en-SG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </span>
              )}
            </div>
            <h1>{frontmatter.title}</h1>
            {frontmatter.tags?.length > 0 && (
              <ul className="blog-post-tags" aria-label="Tags">
                {frontmatter.tags.map(tag => <li key={tag}>{tag}</li>)}
              </ul>
            )}
          </header>

          {frontmatter.coverImage && (
            <div className="blog-post-cover">
              <img src={frontmatter.coverImage} alt={frontmatter.title} />
            </div>
          )}

          <div className="blog-prose-body">
            <MDXRemote {...source} components={components} />
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDir = path.join(process.cwd(), 'content', 'blog')

  if (!fs.existsSync(postsDir)) {
    return { paths: [], fallback: false }
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))
  return {
    paths: files.map(f => ({ params: { slug: f.replace(/\.mdx$/, '') } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params!.slug as string
  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data: frontmatter, content } = matter(raw)
  const source = await serialize(content)
  return { props: { source, frontmatter, slug } }
}

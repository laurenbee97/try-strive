# CLAUDE.md — Strive Site

## Project overview

Next.js 14 (Pages Router) marketing + blog site for Strive, an edtech company teaching maths and AI-first software development. Currently deployed to Vercel.

**Domain setup:**
- `images.strivemath.com` — live Vercel custom domain on this project. Used as `assetPrefix` (serves `_next/static/*` JS/CSS bundles) and as the base URL for all OG and JSON-LD image references in blog posts. Configured in `next.config.js` and via the `IMAGES_BASE` constant in `pages/blog/[slug].tsx`.
- `try.strivemath.com` — redirects to `strivemath.com` via path-forwarding (not served by this app). Do not add this as a Vercel domain for this project.

**Dev server:** `npm run dev` — usually starts on port 3000, but falls back to 3001/3002 if ports are occupied.

---

## Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 14 (Pages Router, SSG) |
| Styling | Custom CSS in `styles/globals.css` — no Tailwind |
| UI library | Chakra UI v2 — installed but barely used; deep component theming deferred to main site |
| Blog content | MDX via `next-mdx-remote` v4 (`serialize` + `MDXRemote`) |
| Frontmatter parsing | `gray-matter` |
| Fonts | Jost (headings/body), Roboto (body fallback), Inconsolata (mono) — loaded via Google Fonts in `_document.tsx` |
| Path alias | `@/*` → `./*` (configured in tsconfig.json) |
| Deployment | Vercel (`vercel.json` contains only `{ "framework": "nextjs" }`) |

---

## Directory structure

```
pages/
  index.tsx                     — Courses landing (2×2 card grid)
  math.tsx                      — Mathematics course page (full marketing page)
  ai-first-software-development.tsx — AI course page
  blog/
    index.tsx                   — Blog listing (reads content/blog/*.mdx at build time)
    [slug].tsx                  — Blog post page (SSG via getStaticPaths/getStaticProps)
  holidaycamps.tsx              — Placeholder (matches legacy Squarespace URL)
  math-confidence.tsx           — Placeholder
  math-performance.tsx          — Placeholder
  makepythonapps.tsx            — Placeholder
  codewithai.tsx                — Placeholder
  ai-first-coding-bootcamp.tsx  — Placeholder

components/blog/
  YouTubeEmbed.tsx              — Responsive 16:9 iframe, uses youtube-nocookie.com
  CodeEmbed.tsx                 — Generic sandboxed iframe for GeoGebra, CodePen, p5.js etc.

content/blog/
  sample-post.mdx               — Reference file documenting frontmatter schema and embed syntax
  joining-yc.mdx                — First real post (YC S21, published 2019-03-08)

public/images/blog/
  joining-yc/                   — cover.jpg, spirals.gif, multiplication-circles.gif,
                                   pythagorean-theorem.gif, singapore-team.jpg, yc-portfolio.png

styles/
  globals.css                   — Single stylesheet: design tokens, reset, nav, all page sections, blog

design-extract-output/          — Figma/design token exports (reference only, not imported)
```

---

## Shared nav pattern

Every page has an identical inline `<nav>` block — there is no shared `<Layout>` component. Each page defines its own `const trialUrl` hardcoded to the appropriate destination:

- `math.tsx` → `https://calendly.com/strive-trial-class/try-a-math-class`
- `index.tsx` and `ai-first-software-development.tsx` → `https://www.strivemath.com/?show_form=true&plan=navbar`

Current nav links: Mathematics `/math`, AI-First Software Development `/ai-first-software-development`, Blog `/blog`.

---

## Blog system

### Content location
All posts live in `content/blog/<slug>.mdx`. The slug becomes the URL: `content/blog/joining-yc.mdx` → `/blog/joining-yc`.

### Frontmatter schema

```yaml
title: "Post Title"             # required — used as <h1> and <title>
date: "2019-03-08"              # required — original publish date, ISO 8601
description: "..."              # required — used in meta description and listing card
tags: ["tag-one", "tag-two"]    # optional — shown as pill badges
updatedDate: "2024-06-01"       # optional — shown as "Updated" date; drives dateModified in JSON-LD
coverImage: "/images/blog/slug/cover.jpg"  # optional but expected — shown on listing card and top of post
```

### Images

Place images in `public/images/blog/<slug>/`. Reference them with absolute paths from `/public`:

```md
![Alt text](/images/blog/my-post/image.png)
![Alt with caption](/images/blog/my-post/image.png "Caption text shown below image")
```

The title attribute triggers a `<figure><figcaption>` wrapper. No title = plain `<img>`. Both are centered by default via CSS.

**Important:** Large GIFs are expensive — `multiplication-circles.gif` is 6.1 MB. Consider converting to `.mp4`/`.webm` for performance.

### MDX custom components

Registered in `pages/blog/[slug].tsx` `components` object:

| Component | Usage in MDX |
|---|---|
| `YouTubeEmbed` | `<YouTubeEmbed id="VIDEO_ID" title="optional" />` |
| `CodeEmbed` | `<CodeEmbed src="https://..." title="optional" height={500} />` |
| `img` → `BlogImage` | Automatic — handles figure/figcaption for captioned images |
| `p` → `BlogParagraph` | Automatic — unwraps `<p>` around block images to fix hydration error |

### Hydration fix (important to preserve)

Remark wraps image tags in `<p>` at AST build time. When `BlogImage` renders a `<figure>`, this creates invalid HTML (`<figure>` inside `<p>`), causing a React hydration mismatch. The `BlogParagraph` component in `[slug].tsx` detects when its sole child is a `BlogImage` and returns the child directly without the `<p>` wrapper. **Do not remove this component.**

### SEO / structured data

- Blog listing page: Schema.org `Blog` JSON-LD
- Blog post pages: Schema.org `BlogPosting` JSON-LD with `datePublished`, `dateModified`, `image`, `keywords`
- OG tags: `article:published_time`, `article:modified_time`, one `article:tag` per tag

---

## Design tokens

Canonical CSS variables are defined at the top of `styles/globals.css`. Short aliases map to them below:

```css
--primary          → #0F1574  (navy blue)
--accent-purple    → #7058FF
--accent-pink      → #FF4F84
--accent-orange    → #FFA41C
--accent-green     → #B0EB33
--accent-blue      → #2C81ED
--text-dark        → #575863
--text-muted       → #B1B1C2
--gradient-cta     → linear-gradient(to right, #FFA41C, #FF4F84, #7058FF)
```

The `design-extract-output/` folder contains Figma exports (design language doc, token JSON, Tailwind config, shadcn theme). These are reference only — not imported by the app.

---

## Adding a new blog post

1. Create `content/blog/<slug>.mdx` with required frontmatter
2. Add images to `public/images/blog/<slug>/`
3. If there's a cover image, set `coverImage: "/images/blog/<slug>/cover.jpg"` in frontmatter
4. The post appears automatically on `/blog` (sorted by date, newest first)

## Adding a new page (placeholder or full)

Copy the pattern from any placeholder page (e.g. `pages/holidaycamps.tsx`): Head with title/description/viewport, inline nav, main content. No shared Layout component exists yet.

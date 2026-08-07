# AGENTS.md — Lexies Scrubs

This file provides context for AI agents (GitHub Copilot, Copilot Workspace, etc.) working on this project.

---

## Project Overview

**Lexies Scrubs** is a public-facing English-language biology and medicine blog built by Lexi, a 10th-grade student who wants to become a doctor. The site works in two ways simultaneously: as a polished public science blog and as a student portfolio for college applications.

- Mission: discover, share, and explain surprising biology and medicine facts for teens
- Tone: curious, smart, accessible, teen-friendly — never textbook, never clickbait
- Primary audience: teens and young readers curious about biology and medicine

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, fullstack) |
| UI | React + Tailwind CSS |
| Database | MongoDB |
| Deployment | Vercel |
| Image hosting | External (Cloudinary or similar) |

---

## Dev Commands

```bash
npm run dev       # Start local development server (localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
```

---

## Project Structure
src/
app/
page.tsx # Home
facts/page.tsx # All Facts (paginated archive)
posts/[slug]/page.tsx # Single article page
about/page.tsx
about-lexi/page.tsx
myth-or-truth/page.tsx
contact/page.tsx
sources/page.tsx
admin/
login/page.tsx
posts/page.tsx
posts/new/page.tsx
posts/[id]/edit/page.tsx
api/
auth/
posts/
upload/
components/
layout/
cards/
article/
admin/
ui/
lib/
db.ts
auth.ts
posts.ts
seo.ts
upload.ts
models/
Post.ts

---

## Content Model (MongoDB — posts collection)

Each post has these fields:
- `title`, `slug`, `lead` (hook), `mainExplanation`
- `mythOrTruth` — `{ label, text }`
- `glossary` — `[{ term, definition }]`
- `whyThisMatters`, `keyTakeaways` (array of 3)
- `sources` — `[{ label, url }]`
- `coverImageUrl`, `coverImageAlt`
- `seoTitle`, `metaDescription`, `excerpt`
- `publishedAt`, `updatedAt`

Slug, excerpt, seoTitle, and metaDescription should be auto-generated but editable.

---

## Admin Area

Protected route at `/admin`. Authentication via session-based auth with secure cookies. Credentials stored in environment variables (hashed). Admin pages must have `noindex`.

Admin features (MVP):
- Sign in / sign out
- List all posts
- Create new post (structured form, NOT a rich text editor)
- Edit existing post
- Upload cover image
- Publish / save as draft

---

## Environment Variables
MONGODB_URI=
AUTH_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
IMAGE_HOST_CLOUD_NAME=
IMAGE_HOST_API_KEY=
IMAGE_HOST_API_SECRET=
NEXT_PUBLIC_SITE_URL=


---

## Article Format (required structure for every post)

1. Question headline
2. Hook (2–3 sentences)
3. Main explanation
4. Myth or Truth box
5. Glossary (key terms)
6. Why This Matters
7. 3 Key Takeaways
8. Sources (reliable: NIH, CDC, WHO, Mayo Clinic, Cleveland Clinic, PubMed)
9. Cover illustration

---

## Rules for AI Agents

- **Never** give personal medical advice or write anything that sounds like diagnosis or treatment
- **Never** copy text from external sources — all content must be original
- All public-facing content must be in **English**
- Keep language teen-friendly: clear, smart, not textbook, not clickbait
- Medical terms must be explained simply when introduced
- Every factual claim needs a reliable source (NIH, CDC, WHO, Mayo Clinic, Cleveland Clinic, PubMed, medical schools, children's hospitals)
- Admin pages must always have `noindex`
- Do not build features marked "What Not to Build Yet": rich editor, search, tags, scheduled publishing, revision history, comments, newsletter, analytics dashboard, reader accounts
- Keep the system simple and maintainable — this is a student-run project

---

## SEO Requirements

- Auto-generated page titles, meta descriptions, canonical URLs
- Open Graph metadata on every post
- Clean slugs: `/posts/why-doesnt-your-heart-sit-exactly-in-the-center`
- XML sitemap + robots.txt (exclude `/admin`)
- Share buttons on article pages: X, Facebook, Copy link

---

## Design System

- Color palette: soft pink + medical blue accents
- Vibe: modern science notebook, softer medical journal, school lab with personality
- Components: reusable content cards (mini magazine cover feel), consistent article templates
- Mobile-first layouts, clean typography, strong readability

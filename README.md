# Lexies Scrubs — README

A fullstack Next.js blog for science facts with admin publishing capabilities.

## Features

- **Public Blog**: Home, All Facts, About, Contact, Sources pages
- **Admin Area**: Secure login and post management
- **Structured Content**: Consistent article template with myth checks, glossaries, and key takeaways
- **SEO Optimized**: Metadata, Open Graph, sitemap support
- **Responsive Design**: Mobile-first Tailwind CSS styling

## Tech Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: Local JSON
- **Authentication**: JWT with secure cookies
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your `AUTH_SECRET` and `ADMIN_PASSWORD_HASH`.

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  admin/                # Admin dashboard and auth
  api/                  # API routes
  facts/                # Public facts archive
  posts/[slug]/         # Individual post pages
  about/                # Static pages
  contact/
  sources/
  myth-or-truth/
src/
  content/             # JSON data files
  lib/
    auth.ts            # Authentication
    posts.ts           # Post operations
    seo.ts             # SEO utilities
  models/
    Post.ts            # Post type definitions
```

## Admin Access

1. Go to `/admin/login`
2. Enter your admin password (the plain password that matches `ADMIN_PASSWORD_HASH` in `.env.local`)
3. Create, edit, and publish posts

## Creating a Post

The post editor includes:
- Title and slug
- Lead (hook)
- Main explanation
- Myth or Truth box
- Glossary terms
- Why This Matters section
- Key takeaways (3)
- Sources
- Cover image

All fields with * are required.

## Environment Variables

- `AUTH_SECRET` - JWT signing secret
- `ADMIN_PASSWORD_HASH` - Bcrypt hash for admin login password
- `NEXT_PUBLIC_SITE_URL` - Site URL for SEO and sharing

## Deployment

### To Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Important Notes

- **Admin pages use `/admin` route** - No public facing announcement
- **Password protection** - Change default admin password immediately
- **Educational disclaimer** included on all pages
- **No real medical advice** - Content is educational only

## Future Enhancements

- Draft mode
- Scheduled publishing
- Custom OG image generation
- Topic filters and search
- Reader submission inbox
- Analytics dashboard
- Social media integration

## Support

For issues or questions about the Lexies Scrubs project, refer to the technical instructions or contact the development team.

---

**Lexies Scrubs** — Where surprising facts turn into clear explanations.

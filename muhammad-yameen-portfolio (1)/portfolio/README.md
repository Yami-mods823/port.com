# Muhammad Yameen — Portfolio

A premium, cinematic, fully animated portfolio built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion**, with a real content-managed backend (Postgres + Vercel Blob storage) and an admin dashboard at `/moin`.

- Public site: dynamic Hero, AI Video / Claymation gallery (load-more, custom video player), About, animated Skills, Software Development, Projects, Contact — all editable from the admin panel, nothing hardcoded.
- Admin dashboard (`/moin`): manage general info, hero/about text, section titles, profile image & logo, videos (upload + metadata), projects, skills, and social links. No login is required yet, as requested — add auth before making this public long-term (see **Securing `/moin`** below).
- Storage: video/image files are uploaded to **Vercel Blob**, never stored in the database or on local disk — fully compatible with Vercel's serverless environment.
- Database: **Postgres** via Prisma — works with Vercel Postgres, Neon, or Supabase.

---

## 1. Project setup

```bash
npm install
```

Copy the environment template and fill it in (see steps 2 & 3 below):

```bash
cp .env.example .env
```

---

## 2. Database setup (Postgres)

Pick any of these free options:

- **Vercel Postgres** (powered by Neon) — in your Vercel project: Storage → Create Database → Postgres.
- **Neon** — https://neon.tech (free tier, works great with Vercel).
- **Supabase** — https://supabase.com (use the "connection pooling" URI).

Copy the connection string into `.env` as `DATABASE_URL`.

Then push the schema and seed initial content (default skills + empty social links):

```bash
npm run db:push
npm run db:seed
```

`npm run db:studio` opens Prisma Studio if you want to browse/edit data directly.

---

## 3. Cloud storage setup (Vercel Blob)

1. In your Vercel project: **Storage → Create Database → Blob**.
2. Copy the generated **Read/Write Token**.
3. Paste it into `.env` as `BLOB_READ_WRITE_TOKEN`.

Videos, thumbnails, profile photo, logo, and skill logos are all uploaded here — supports MP4/WebM/MOV with no duration limit, and images up to 15MB.

---

## 4. Run locally

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin dashboard: http://localhost:3000/moin

---

## 5. GitHub upload

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Or use GitHub Desktop / the "upload a ZIP" flow on github.com — just extract this project first.)

---

## 6. Vercel deployment

1. Go to https://vercel.com/new and import your GitHub repository.
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables in the Vercel project settings (same as your `.env`):
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
   - `NEXT_PUBLIC_SITE_URL` (your final `https://yourproject.vercel.app` or custom domain)
4. Deploy. Vercel will run `prisma generate` automatically via the `postinstall` script.
5. After the first deploy, run the schema push once against your production database (from your local machine, with the production `DATABASE_URL` in `.env`):
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

## 7. Opening the site

- **Public portfolio:** `https://<your-domain>/`
- **Admin dashboard:** `https://<your-domain>/moin`

Any change made in `/moin` (text, images, videos, projects, skills, social links) appears live on the public site immediately — nothing is hardcoded.

---

## Securing `/moin`

The admin dashboard currently has **no authentication**, as requested for this first version. Before sharing your domain publicly, add protection — the simplest options:

- **Vercel's built-in Password Protection / Deployment Protection** (Project Settings → Deployment Protection) scoped to the `/moin` path, or the whole project on a Pro plan.
- Or a lightweight middleware check: create `src/middleware.ts` that requires a shared secret (via `Authorization` header or a signed cookie) for any request to `/moin` and `/api/*` write methods.

---

## Project structure

```
src/
  app/
    page.tsx              # Public homepage (server component, fetches all content)
    layout.tsx             # Root layout, fonts, SEO metadata
    globals.css
    moin/                   # Admin dashboard (client components)
      page.tsx              # General settings
      videos/  projects/  skills/  social/
    api/                    # Route handlers (Prisma reads/writes, Blob uploads)
  components/
    layout/                 # Navbar, Footer, loading screen, cursor, scroll progress
    sections/                # Hero, VideoGallery, About, Skills, SoftwareDev, Projects, Contact
    ui/                      # Reusable animated primitives (cards, buttons, counters, etc.)
    admin/                   # Shared admin form building blocks
  lib/                      # prisma client, blob upload helper, utils
  types/                    # Shared TypeScript DTOs
prisma/
  schema.prisma
  seed.ts
```

## Notes

- No PHP, no Laravel, no local SQLite, no filesystem media storage — everything is Vercel-deployable out of the box.
- All animations respect `prefers-reduced-motion` and are GPU-friendly (transform/opacity based).
- Empty states ("AI video projects coming soon." / "New projects are coming soon.") appear automatically when there's no content yet.

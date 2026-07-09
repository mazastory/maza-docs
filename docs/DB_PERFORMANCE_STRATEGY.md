# Database & API Performance Strategy

## 1. Payload Optimization (The "5MB SSR Bottleneck" Incident)

### Background
In early versions, the frontend SSR application (`maza-blog`) called a single RPC (`get_public_posts`) to fetch the list of published posts for a specific domain. Because the RPC returned `SELECT *` from the posts table, the response payload included the massive `html_content` field (which often contained heavy text and embedded base64 images) for *every single post*.

### Symptoms
- This resulted in an enormous JSON payload (often exceeding 5MB for ~30 posts).
- Netlify Edge and Vercel Serverless functions experienced severe parsing and network overhead.
- SSR TTFB (Time to First Byte) degraded to **8 - 10 seconds** on cold starts (e.g., immediately after cache clearance or new deploys).

### Resolution & Golden Rules
To prevent this performance regression in the future, all Maza platforms (Studio and Blog) MUST adhere to the following data fetching rules:

1. **Rule 1: List APIs Must Be Lightweight**
   - Any API or RPC designed to fetch a *list* of items (e.g., fetching a feed of posts for the homepage) **MUST NOT** include heavy fields like `content` or `html_content`.
   - Only select absolute minimum fields needed for the card UI: `id, title, slug, thumbnail_url, created_at, publish_at, status, metadata`.

2. **Rule 2: Detail APIs Should Be Targeted**
   - The heavy `html_content` should only be fetched via a targeted, single-record query.
   - Example: In `[slug].astro`, fetch the lightweight list to resolve the URL, then execute `.select('html_content, content').eq('id', targetId).single()` to fetch the body only for that specific post.

3. **Rule 3: Avoid `SELECT *` in RPCs**
   - Postgres RPCs returning `SETOF record` or `TABLE` should explicitly define their output columns to avoid accidentally leaking heavy or sensitive columns into the frontend response.

## 2. Supabase Query Architecture
- Always prefer `.select('column1, column2')` instead of `.select('*')` on the client side, even if the backend allows it.
- Ensure that filtering relies on indexed columns (e.g., `site_id`, `status`, `domain`).

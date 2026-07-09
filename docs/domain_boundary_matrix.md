# Domain‑Boundary Matrix

This matrix defines the allowed and prohibited actions for each domain, summarising the **Content‑Publish Separation (CPS)** rules.

## CPS‑1. Domain Responsibility (CPS‑1)
| Domain | Responsibility |
|--------|-----------------|
| `Challenge` | Generate challenge content, scoring, validation. |
| `Content`   | Create and validate post content, keyword vault, image handling. |
| `Publishing`| Publish posts to platforms, schedule, handle platform‑specific APIs. |

## CPS‑2. Database Structure (CPS‑2)
- `content_jobs` – stores **what** to create (status flow: WAITING → GENERATING → READY). No publishing timestamps.
- `publish_jobs` – stores **when/where** to publish (links to `content_jobs` via `content_id`).
- **Never** add `publish_at` or scheduling fields to `content_jobs`.

## CPS‑3. Boundary Validation Checklist (CPS‑3)
- [ ] Does the code modify `publish_jobs` from a **Challenge** or **Content** module? → **No**.
- [ ] Does the code call platform writers (`Writer`, `publishWorker`) from **Content**? → **No**.
- [ ] Are Scheduler functions invoked directly from **Content**? → **No**.
- [ ] Are SEO modifications performed in **Challenge** code? → **No**.

Any violation of the above must be avoided to maintain domain isolation.

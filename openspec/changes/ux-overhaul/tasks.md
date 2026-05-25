# Tasks: UX Overhaul for El Humboldtiano

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~850 (PR1: 265, PR2: 240, PR3: 345) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 3 stacked PRs (Phase 1 → Phase 2 → Phase 3) |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Category infra + nav fix + RSS + 404 | PR 1 | base = main; clears dead nav |
| 2 | Related, prev/next, sticky nav, homepage sections | PR 2 | base = main; needs category pages |
| 3 | Breadcrumbs, search, hamburger, date polish | PR 3 | base = main; needs all prior pages |

## PR 1 — Critical (Category Infrastructure)

- [x] T-01 Create `src/utils/slugify.ts` — `CATEGORIES` constant, `slugify()`, `deslugify()` bijective functions
- [x] T-02 Write `tests/unit/slugify.test.ts` — test all 4 categories, roundtrip invariance, special chars
- [x] T-03 Update `Nav.astro` — replace `#` hrefs with `/categoria/{slug}/1`, remove Portada/Archivo links
- [x] T-04 Create `src/pages/categoria/[slug]/[page].astro` — paginated category index (9/page), `getStaticPaths`, empty-state "Próximamente"
- [x] T-05 Update `Footer.astro` — add "Archivo" text link to `/archivo/1`
- [x] T-06 Create `src/pages/404.astro` — friendly Spanish message, link to `/`
- [x] T-07 Rename `rss.xml.js` → `rss.xml.ts`, verify `@astrojs/rss` wiring
- [x] T-08 Update `astro.config.mjs` — sitemap `filter` includes `/categoria/*`, `/rss.xml`, `/404`

## PR 2 — High Impact (Engagement)

- [ ] T-09 Add sticky nav CSS — `position: sticky` on `.navegacion`, `scroll-padding-top` on `html`
- [ ] T-10 Create `RelatedArticles.astro` — same-category filter, exclude self, slice 0-3, hidden if 0
- [ ] T-11 Create `PrevNext.astro` — global `publishDate` sort, conditional prev/next, omit if alone
- [ ] T-12 Update `articulo/[slug].astro` — render `<RelatedArticles />` + `<PrevNext />` after article body
- [ ] T-13 Update `index.astro` — category-grouped sections below featured, 3 articles per category, "Próximamente" if empty

## PR 3 — Polish (Search + Mobile + Breadcrumbs)

- [ ] T-14 Create `Breadcrumbs.astro` — `nav[aria-label="Breadcrumb"]` + `BreadcrumbList` JSON-LD
- [ ] T-15 Create `src/utils/search.ts` — `buildSearchIndex()` returns `SearchDoc[]` from articles
- [ ] T-16 Write `tests/unit/search.test.ts` — test index shape, content inclusion, empty corpus
- [ ] T-17 Create `src/pages/buscar.astro` — search page, inline vanilla JS, 200ms debounce, no-results state
- [ ] T-18 Update `Nav.astro` + `global.css` — hamburger checkbox hack, breakpoint ≤768px
- [ ] T-19 Add hamburger JS — `aria-expanded`, Escape close, click-outside close, focus return
- [ ] T-20 Update `articulo/[slug].astro` — wrap date in `<time datetime="YYYY-MM-DD">`

### Test Plan

| Task | Test approach |
|------|--------------|
| T-01, T-02 | Vitest: slugify/deslugify bijection, 4 categories, special-char safety |
| T-04, T-08 | `astro build` + verify `/categoria/*/1` generates, sitemap includes routes |
| T-06 | `astro build` + curl `/404` returns 200 (Astro static fallback) |
| T-07 | `astro build` + validate `/rss.xml` |
| T-10, T-11, T-12, T-13, T-14, T-17, T-18, T-19, T-20 | `astro build` + manual visual + Lighthouse ≥95 |
| T-15, T-16 | Vitest: `buildSearchIndex()` shape, content match |

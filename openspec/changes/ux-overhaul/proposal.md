# Proposal: UX Overhaul

## Intent
The current news portal has dead navigation links, missing content discovery features, and poor article UX that strands readers. This change makes the site navigable, discoverable, and engaging across all breakpoints.

## Scope

### In Scope
- **Phase 1 (Critical)**: Category pages, fix dead nav links, RSS feed, 404 page, sitemap verification
- **Phase 2 (High Impact)**: Related articles, prev/next navigation, homepage category sections, sticky nav
- **Phase 3 (Polish)**: Breadcrumbs, client-side search, mobile hamburger menu, date display enhancement

### Out of Scope
- Backend/search index (static site — search is client-side only)
- Comments system
- Multi-language support
- Dark mode
- Analytics integration
- Social media integration (sharing or links — not available yet)

## Capabilities

### New Capabilities
- `category-pages`: Dynamic category index pages with article listings
- `search`: Client-side full-text search across articles
- `related-articles`: "Related" section at end of article pages
- `rss-feed`: `@astrojs/rss` wired to generate `/rss.xml`
- `404-page`: Custom not-found page

### Modified Capabilities
- `navigation`: Sticky nav bar, mobile hamburger, category-only links (removed Portada/Archivo)
- `article-page`: Prev/next navigation, enhanced date display, breadcrumbs
- `homepage`: Category-grouped sections with empty-state handling

## Approach

Phased incremental rollout aligned to user impact:
1. **Phase 1** — Unblock core user flow (nav + categories + RSS + 404)
2. **Phase 2** — Increase engagement (related, prev/next, sticky nav)
3. **Phase 3** — Polish (search, breadcrumbs, mobile UX, date display)

Category routes use a `slugify` helper for URL-safe paths from spaced names. Empty-state strategy for low content volume: show "Próximamente" placeholders and link to RSS.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/categoria/[slug].astro` | New | Category index pages |
| `src/pages/404.astro` | New | Custom 404 page |
| `src/pages/rss.xml.ts` | New | RSS feed route |
| `src/components/Navigation.astro` | Modified | Sticky, hamburger, category-only links |
| `src/components/ArticleCard.astro` | Modified | Used in category + related sections |
| `src/pages/index.astro` | Modified | Category-grouped sections |
| `src/layouts/ArticleLayout.astro` | Modified | Prev/next, related, breadcrumbs |
| `src/utils/slugify.ts` | New | URL-safe slug from category names |
| `src/utils/search.ts` | New | Client-side search index builder |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Client-side search performance on large corpus | Low | Search index is JSON; pagination if needed; Astro build-time generation |
| Empty category pages with 2 articles | Med | Empty-state messaging + RSS CTA |

## Rollback Plan

Each phase is independent. Revert by restoring pre-phase git state. Nav changes (Phase 1) are backward-compatible with old links. No database or external state involved.

## Dependencies

- `@astrojs/rss` (already installed, needs wiring)
- No new runtime dependencies

## Success Criteria

- [ ] All 4 nav category links resolve to real pages with articles listed
- [ ] RSS feed validates at `/rss.xml`
- [ ] 404 page renders on unknown routes
- [ ] Article pages show related articles when ≥3 articles exist
- [ ] Prev/next navigation appears on article pages
- [ ] Mobile nav uses hamburger menu (no horizontal scroll)
- [ ] Client-side search returns results from all articles
- [ ] Lighthouse accessibility score ≥ 95 on all new/modified pages
- [ ] No social media links or sharing buttons (not available yet)

# UX Overhaul — Delta Specification

## Purpose
This delta specifies behavioral changes for the `ux-overhaul` change. It covers category pages, navigation, article discovery, search, and mobile UX across three phases.

---

## Phase 1 — Critical

### REQ-P1-01: Category Pages

The system MUST generate static category index pages at `/categoria/{slug}/{page}`.

| ID | Description |
|---|---|
| P1-01a | The `slugify` utility MUST map the 4 category names to URL-safe slugs: `vida-universitaria`, `huellas`, `ciudad-y-arte`, `en-radar`. |
| P1-01b | Each category page MUST list articles in that category sorted by `publishDate` descending. |
| P1-01c | Pagination MUST show 9 articles per page and generate `page/1`, `page/2`, etc. |
| P1-01d | If a category has 0 articles, the page MUST display a "Próximamente" placeholder and a link to `/rss.xml`. |

**Rationale**: Unblocks dead nav links. Every category link must resolve to a real page.

**Scenarios**

- GIVEN a category with 5 articles, WHEN a user visits `/categoria/vida-universitaria/1`, THEN they see 5 article cards and no pagination controls.
- GIVEN a category with 12 articles, WHEN a user visits `/categoria/huellas/2`, THEN they see 3 articles and a link to page 1.
- GIVEN a category with 0 articles, WHEN a user visits `/categoria/en-radar/1`, THEN they see "Próximamente" and a CTA to subscribe via RSS.

---

### REQ-P1-02: Navigation Links

The system MUST update the nav component to link only to the 4 category pages.

| ID | Description |
|---|---|
| P1-02a | Nav MUST remove links for "Portada" and "Archivo". |
| P1-02b | The 4 category links MUST point to `/categoria/{slug}/1`. |
| P1-02c | Nav MUST remain accessible (ARIA `aria-label`, focusable links, no broken hrefs). |

**Rationale**: Fixes dead `#` links. Categories are the primary content taxonomy.

**Scenarios**

- GIVEN the homepage, WHEN a user clicks "Ciudad y Arte" in the nav, THEN they land on `/categoria/ciudad-y-arte/1`.
- GIVEN a mobile viewport, WHEN the nav renders, THEN no horizontal scroll appears (links reflow or collapse).

---

### REQ-P1-03: Footer Archive Link

The system MUST add an "Archivo" link in the footer.

| ID | Description |
|---|---|
| P1-03a | Footer MUST include a text link labeled "Archivo" pointing to `/archivo/1` or `/categoria` listing. |
| P1-03b | Social media placeholders MUST remain empty (no links). |

**Rationale**: Keeps Archive discoverable without cluttering the primary nav.

**Scenarios**

- GIVEN any page, WHEN a user scrolls to the footer, THEN they see "Archivo" as a clickable link.

---

### REQ-P1-04: RSS Feed

The system MUST generate a valid RSS feed at `/rss.xml`.

| ID | Description |
|---|---|
| P1-04a | Feed MUST include all articles with status `Listo`, ordered by `publishDate` descending. |
| P1-04b | Feed MUST include title, description, link, and `pubDate` for each item. |
| P1-04c | The route MUST be generated at build time via `@astrojs/rss`. |

**Rationale**: Enables external syndication and gives empty-state categories a CTA target.

**Scenarios**

- GIVEN 2 published articles, WHEN the build runs, THEN `/rss.xml` contains 2 `<item>` entries.
- GIVEN 0 published articles, WHEN the build runs, THEN `/rss.xml` returns an empty but valid RSS envelope.
- GIVEN a feed validator, WHEN `/rss.xml` is submitted, THEN it passes without errors.

---

### REQ-P1-05: Custom 404 Page

The system MUST render a custom 404 page on unknown routes.

| ID | Description |
|---|---|
| P1-05a | The 404 page MUST return HTTP 404 and display a friendly message in Spanish. |
| P1-05b | The 404 page MUST include a link back to `/`. |

**Rationale**: Prevents default Astro 404, improves UX on dead links.

**Scenarios**

- GIVEN a request to `/not-a-real-page`, WHEN the server responds, THEN the user sees "Página no encontrada" and a link to the homepage.

---

### REQ-P1-06: Sitemap Verification

The system MUST include all new routes in the generated sitemap.

| ID | Description |
|---|---|
| P1-06a | `astro.config.mjs` MUST include `/categoria/*`, `/rss.xml`, and `/404` in sitemap output. |
| P1-06b | Sitemap generation MUST succeed during `astro build`. |

**Rationale**: SEO completeness. New pages must be discoverable by crawlers.

**Scenarios**

- GIVEN a production build, WHEN `sitemap-0.xml` is inspected, THEN it contains URLs for all category pages and the RSS feed.

---

### REQ-P1-07: Slugify Utility

The system MUST provide a `slugify` function for category names.

| ID | Description |
|---|---|
| P1-07a | `slugify` MUST convert to lowercase, replace spaces with `-`, and remove special characters. |
| P1-07b | The mapping MUST be bijective: every category name maps to exactly one slug, and the reverse lookup is deterministic. |

**Rationale**: Guarantees consistent URLs and avoids manual slug maintenance.

**Scenarios**

- GIVEN the input `"Ciudad y Arte"`, WHEN `slugify` is called, THEN it returns `"ciudad-y-arte"`.
- GIVEN the input `"En Radar"`, WHEN `slugify` is called, THEN it returns `"en-radar"`.

---

## Phase 2 — High Impact

### REQ-P2-01: Related Articles

The system MUST show up to 3 related articles at the end of each article page.

| ID | Description |
|---|---|
| P2-01a | Related articles MUST share the same `category` as the current article. |
| P2-01b | Related articles MUST be sorted by `publishDate` descending (most recent first). |
| P2-01c | The current article MUST be excluded from the related list. |
| P2-01d | If fewer than 3 related articles exist, the system MUST display whatever is available (0–2). |
| P2-01e | If 0 related articles exist, the section MUST be hidden entirely. |

**Rationale**: Reduces reader abandonment by surfacing same-topic content.

**Scenarios**

- GIVEN an article in "Huellas" with 5 other articles in the same category, WHEN the page renders, THEN the related section shows 3 cards.
- GIVEN an article in "En Radar" with 1 other article in the same category, WHEN the page renders, THEN the related section shows 1 card.
- GIVEN the only article in "Ciudad y Arte", WHEN the page renders, THEN no related section appears.

---

### REQ-P2-02: Prev/Next Navigation

The system MUST show previous and next article links on article pages.

| ID | Description |
|---|---|
| P2-02a | Prev/Next MUST be determined by global `publishDate` order (all articles, not per category). |
| P2-02b | The previous article MUST be the next-older article; the next article MUST be the next-newer article. |
| P2-02c | If there is no previous article, the system MUST omit the prev link. |
| P2-02d | If there is no next article, the system MUST omit the next link. |

**Rationale**: Gives readers a chronological reading path through the publication.

**Scenarios**

- GIVEN 3 articles ordered A (oldest), B, C (newest), WHEN article B renders, THEN prev links to A and next links to C.
- GIVEN 1 article, WHEN the article page renders, THEN neither prev nor next appears.
- GIVEN the newest article C, WHEN the page renders, THEN prev links to B and next is absent.

---

### REQ-P2-03: Homepage Category Sections

The system MUST group non-featured articles by category on the homepage.

| ID | Description |
|---|---|
| P2-03a | Below the featured article, the homepage MUST display one section per category. |
| P2-03b | Each section MUST show up to 3 most recent articles from that category. |
| P2-03c | If a category has 0 articles, the section MUST show "Próximamente" instead of article cards. |
| P2-03d | Each section MUST link to `/categoria/{slug}/1`. |

**Rationale**: Surfaces all content areas on the homepage, handles low-volume gracefully.

**Scenarios**

- GIVEN 2 articles in "Vida Universitaria" and 0 elsewhere, WHEN the homepage renders, THEN "Vida Universitaria" shows 2 cards and the other 3 categories show "Próximamente".
- GIVEN 0 total articles, WHEN the homepage renders, THEN the featured area shows "Próximamente" and all 4 category sections show "Próximamente".

---

### REQ-P2-04: Sticky Navigation

The system MUST keep the nav bar visible on scroll.

| ID | Description |
|---|---|
| P2-04a | Nav MUST become sticky after scrolling past the header. |
| P2-04b | The sticky behavior MUST be implemented with CSS only (`position: sticky` or `position: fixed`). |
| P2-04c | `scroll-padding-top` MUST be set on `html` to prevent anchor links from hiding behind the sticky nav. |

**Rationale**: Improves navigation access on long pages without JS overhead.

**Scenarios**

- GIVEN a tall article page, WHEN the user scrolls down, THEN the nav remains visible at the top.
- GIVEN an anchor link `#section-2`, WHEN clicked, THEN the target scrolls into view below the sticky nav.

---

## Phase 3 — Polish

### REQ-P3-01: Breadcrumbs

The system MUST show breadcrumb navigation on category and article pages.

| ID | Description |
|---|---|
| P3-01a | Breadcrumbs MUST display: `Portada > {Category}` on category pages. |
| P3-01b | Breadcrumbs MUST display: `Portada > {Category} > {Article Title}` on article pages. |
| P3-01c | Each breadcrumb segment MUST be a link except the current page. |
| P3-01d | Breadcrumbs MUST use structured data (`BreadcrumbList` JSON-LD) for SEO. |

**Rationale**: Improves orientation and SEO structure.

**Scenarios**

- GIVEN `/categoria/huellas/1`, WHEN the page renders, THEN breadcrumbs show "Portada > Huellas" with "Portada" as a link.
- GIVEN `/articulo/some-slug`, WHEN the page renders, THEN breadcrumbs show "Portada > Huellas > Título del Artículo" with only "Portada" and "Huellas" as links.

---

### REQ-P3-02: Client-Side Search

The system MUST provide full-text search across all articles.

| ID | Description |
|---|---|
| P3-02a | At build time, the system MUST generate a JSON search index containing title, resumen, category, tags, author, and body text for every `Listo` article. |
| P3-02b | Search MUST be implemented with vanilla JavaScript (no external runtime dependency). |
| P3-02c | The search page MUST be reachable at `/buscar`. |
| P3-02d | Results MUST match query against title, resumen, and body (case-insensitive, partial word). |
| P3-02e | If no results match, the page MUST display "No se encontraron resultados" and suggest visiting `/rss.xml`. |
| P3-02f | Search MUST debounce input (≥200 ms) to avoid blocking the main thread. |

**Rationale**: Enables content discovery without a backend. Static JSON keeps it fast.

**Scenarios**

- GIVEN a search index with 2 articles, WHEN the user types "música", THEN results show articles where "música" appears in title, resumen, or body.
- GIVEN a search index, WHEN the user types a non-matching query, THEN "No se encontraron resultados" appears.
- GIVEN the search page on mobile, WHEN the user focuses the input, THEN the UI remains usable (no zoom trap, no layout shift).

---

### REQ-P3-03: Mobile Hamburger Menu

The system MUST provide a collapsible nav menu on mobile viewports.

| ID | Description |
|---|---|
| P3-03a | On viewports ≤768 px, the nav MUST collapse into a hamburger button. |
| P3-03b | The menu toggle MUST work with minimal JS (class toggle) or a CSS-only checkbox hack. |
| P3-03c | The button MUST have an accessible label (`aria-label`, `aria-expanded`). |
| P3-03d | The menu MUST be closable by clicking the button again or clicking outside the menu. |
| P3-03e | Focus MUST be trapped inside the open menu (or return to the button on close). |

**Rationale**: Prevents horizontal scroll and nav overflow on small screens.

**Scenarios**

- GIVEN a 375 px wide viewport, WHEN the page loads, THEN the nav shows a hamburger icon and hides category links.
- GIVEN the hamburger is open, WHEN the user clicks outside the menu, THEN the menu closes.
- GIVEN the hamburger is open, WHEN the user presses Escape, THEN the menu closes and focus returns to the button.

---

### REQ-P3-04: Enhanced Date Display

The system MUST display the article publish date more prominently.

| ID | Description |
|---|---|
| P3-04a | The date MUST be localized to `es-VE` using `toLocaleDateString`. |
| P3-04b | The date MUST appear in the article header with weekday, day, month, and year (e.g., "lunes, 24 de mayo de 2026"). |
| P3-04c | The date MUST be wrapped in a `<time>` element with a `datetime` attribute (`YYYY-MM-DD`). |
| P3-04d | The date MUST be visually distinct (larger or bolder than meta text). |

**Rationale**: Makes temporal context immediately visible to readers.

**Scenarios**

- GIVEN an article with `publishDate: 2026-05-24`, WHEN the article page renders, THEN the header shows "domingo, 24 de mayo de 2026" inside a `<time datetime="2026-05-24">` tag.

---

## Cross-Cutting Requirements

### REQ-XC-01: Accessibility

All new and modified components MUST meet WCAG 2.2 AA.

| ID | Description |
|---|---|
| XC-01a | Color contrast MUST be ≥4.5:1 for normal text and ≥3:1 for large text. |
| XC-01b | All interactive elements MUST be keyboard accessible. |
| XC-01c | Focus indicators MUST be visible. |
| XC-01d | Lighthouse accessibility score MUST be ≥95 on all new/modified pages. |

### REQ-XC-02: Performance

New client-side features MUST not degrade build or runtime performance.

| ID | Description |
|---|---|
| XC-02a | Search index JSON MUST be generated at build time; no runtime fetching of article content. |
| XC-02b | Total JS shipped for search + hamburger MUST be <10 KB uncompressed. |
| XC-02c | Category pages MUST be statically generated at build time (no SSR). |

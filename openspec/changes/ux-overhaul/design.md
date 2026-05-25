# Design: UX Overhaul for El Humboldtiano

## Technical Approach

Phased static-site generation aligned to the spec. All new routes use `getStaticPaths` at build time. Client-side search consumes a build-time JSON index. No UI framework — pure Astro components, CSS custom properties, and minimal vanilla JS.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Category slug mapping | `slugify()` + reverse `deslugify()` | Hard-coded slug map | Bijective; survives category renames; single source of truth |
| Search | Build-time JSON index + vanilla JS | Pagefind, Fuse.js, backend | Zero runtime deps; <10 KB total JS; static-only stack |
| Sticky nav | `position: sticky` + `scroll-padding-top` | `position: fixed` + JS layout calc | CSS-only; no reflow; no scroll-jacking |
| Hamburger toggle | CSS checkbox hack + minimal JS for focus/escape | Full JS state machine | Zero JS for open/close; JS only for ARIA and focus management |
| Prev/next order | Global `publishDate` sort | Per-category sort | Matches spec P2-02a; chronological reading path |
| Breadcrumb JSON-LD | Inline `<script type="application/ld+json">` in component | Layout slot injection | Co-located with markup; easy to vary per page |

## Data Flow

```
content/articles/*.md
    ↓ getArticles() → ProcessedArticle[] (readingTime injected)
    ├─→ Pages: index | articulo/[slug] | archivo/[page] | categoria/[slug]/[page] | buscar | 404
    ├─→ Components: ArticleCard, Nav, Breadcrumbs, RelatedArticles, PrevNext
    └─→ Build outputs: /rss.xml | /search-index.json
```

## Route Design

| Route | `getStaticPaths` Source | Data Needed |
|---|---|---|
| `/categoria/{slug}/{page}` | `CATEGORIES` array + `getArticles()` filtered by category | 9 articles per page; empty-state if 0 |
| `/buscar` | None (client-side) | Static search page; JS fetches `/search-index.json` |
| `/rss.xml` | `getArticles()` | All `Listo` articles, sorted by `publishDate` desc |
| `/404` | None | Static fallback page |

Category pages derive `slug` from `slugify(categoryName)` and validate against `CATEGORIES`. Invalid slugs return no paths.

## Component Architecture

**New components**
- `Breadcrumbs.astro`: Props `{items: {label, href?}[]}`. Renders `nav[aria-label="Breadcrumb"]` + `BreadcrumbList` JSON-LD.
- `RelatedArticles.astro`: Props `{current: ProcessedArticle, all: ProcessedArticle[]}`. Filters same category, excludes self, slices 0–3. Hidden if 0 matches.
- `PrevNext.astro`: Props `{current: ProcessedArticle, all: ProcessedArticle[]}`. Finds index in globally sorted array, renders prev/next links conditionally.
- `SearchClient.astro`: Inline `<script>` for fetch, debounce (200 ms), DOM injection. No external deps.

**Modified components**
- `Nav.astro`: Remove Portada/Archivo links. Add 4 category links to `/categoria/{slug}/1`. Add hamburger markup (`input[type="checkbox"]` + label). Add sticky wrapper.
- `Footer.astro`: Add text link "Archivo → /archivo/1". Keep social placeholder empty.
- `ArticleCard.astro`: No props change; reused in category, related, and homepage sections.

## Utility Design

```ts
// src/utils/slugify.ts
export const CATEGORIES: { name: string; slug: string }[];
export function slugify(name: string): string;   // "Ciudad y Arte" → "ciudad-y-arte"
export function deslugify(slug: string): string; // "ciudad-y-arte" → "Ciudad y Arte"

// src/utils/search.ts
export interface SearchDoc {
  id: string; title: string; resumen: string;
  category: string; tags: string[]; author: string;
  body: string; url: string;
}
export function buildSearchIndex(articles: ProcessedArticle[]): SearchDoc[];
```

Search scoring: case-insensitive inclusion match against `title`, `resumen`, `body`. No stemming or TF-IDF (corpus is small).

## CSS Architecture

All new styles live in `global.css` using existing tokens (`--uah-azul`, `--uah-amarillo`, `--texto-oscuro`, `--fondo-claro`, `--fuente-serif`, `--fuente-sans`).

- **Sticky nav**: `.navegacion` wrapper with `position: sticky; top: 0; z-index: 100`. `html { scroll-padding-top: 60px; }`.
- **Hamburger**: Checkbox hack (`#menu-toggle` + `:checked ~ ul`) for zero-JS toggle. JS adds `aria-expanded` and Escape handler. Breakpoint at 768px (existing pattern).
- **Breadcrumbs**: Horizontal flex with `>` separators. No new tokens.
- **Search**: Input + results list. Results styled like `.tarjeta-noticia` mini variant.

No new custom properties required.

## SEO Design

- **JSON-LD**: `Breadcrumbs.astro` injects `BreadcrumbList` schema. Article pages already have Open Graph; no change needed.
- **RSS**: `@astrojs/rss` with `title`, `description`, `link`, `pubDate` per item.
- **Sitemap**: `astro.config.mjs` updated to include `/categoria/*`, `/rss.xml`, `/404`. Exclude `/buscar` (no SEO value).
- **Canonical**: Existing `BaseLayout` logic covers all new pages.

## Performance Strategy

- **Static generation**: All category pages, RSS, and 404 generated at build time. Zero SSR.
- **Search index**: `buildSearchIndex()` runs in `buscar.astro` frontmatter; outputs to `/search-index.json` at build time. Corpus size is trivial (~2 articles now, bounded by markdown files).
- **JS budget**: Search + hamburger focus/escape < 10 KB uncompressed. No bundler needed — inline `<script type="module">` per component.
- **Lazy loading**: Article images already use `loading="lazy"`; unchanged.

## Accessibility Design

- **Hamburger**: `aria-label="Menú de navegación"`, `aria-expanded` toggled via JS. Escape closes menu and returns focus to button. Click-outside listener closes menu.
- **Search**: Input has `aria-label="Buscar artículos"`. Results region uses `aria-live="polite"`.
- **Breadcrumbs**: `nav` with `aria-label="Breadcrumb"`. Current page is `<span aria-current="page">`.
- **Focus**: All interactive elements have visible `:focus` outline (2px solid `--uah-amarillo`). Sticky nav does not trap focus.
- **Contrast**: Existing tokens `--uah-azul` on white and `--uah-amarillo` on `--uah-azul` already ≥ 4.5:1.

## Phase Dependency Graph

```
Phase 1 (Critical)
├── slugify.ts ─────┐
├── Nav.astro ──────┤→ Category pages
├── categoria/ ─────┤
├── Footer.astro ───┤
├── rss.xml.ts ─────┤
├── 404.astro ──────┤
└── sitemap config ─┘

Phase 2 (High Impact)
├── sticky nav CSS ─┐
├── index.astro ────┤→ related + prev/next
├── RelatedArticles ┤   need category pages
├── PrevNext ───────┤   to exist for nav
└── [slug].astro ───┘

Phase 3 (Polish)
├── Breadcrumbs ────┐
├── search.ts ──────┤→ all prior pages
├── buscar.astro ───┤   exist for linking
├── hamburger JS ───┤
└── date display ───┘
```

Phases are sequential only within cross-cutting deps (e.g., breadcrumbs need category routes to exist). Each phase can be built and verified independently.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | `slugify`, `deslugify`, `buildSearchIndex`, search ranking | Vitest |
| Integration | Category `getStaticPaths`, RSS XML validity, 404 response | `astro build` + HTML/XML assertions |
| E2E | Lighthouse accessibility ≥95, mobile hamburger, search debounce | Manual + CI Lighthouse |

## Migration / Rollout

No migration required. Each phase is backward-compatible. Rollback: restore pre-phase git state.

## Open Questions

- None

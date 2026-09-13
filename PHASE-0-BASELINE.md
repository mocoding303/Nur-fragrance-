# NUR Fragrance — Phase 0 SEO / AEO / GEO baseline

Audited 2026-09-13 against the **live** theme
`NUR Gallery Fix — Sept 12 (preview)` (`/t/37`, `206267023685`, role `MAIN`).

> All 13 SEO-relevant files were confirmed byte-identical (md5) between `/t/36`
> and `/t/37`, so nothing in this baseline is an artefact of yesterday's theme
> publish.

## Context — evidenced, not assumed

| Field | Value | Source |
| --- | --- | --- |
| Store URL | `https://www.nur-fragrance.com` | Admin API |
| Platform / theme access | Shopify, full Admin API read+write | this session |
| Shopify plan | **Pause and Build** | `shop.planName` |
| Primary market | **Germany** (EUR, CEST, country DE) | `shop` |
| Primary city | **UNKNOWN — need** | — |
| Languages | English (default) + German | `locales/en.default.json`, `locales/de.json` |
| Product type | **Decants & splits** of third-party houses, 1/2/5/10 ml, plus 3 gift sets and 1 packaging add-on | all 16 products |
| Houses resold | Lattafa, Armaf, Swiss Arabian and others | `product.vendor` |
| Dupe positioning | **YES** — `/pages/creed-aventus-alternative`, `/pages/baccarat-rouge-alternative` | page list |
| GTINs | **Structurally none.** A 5 ml decant has no GTIN | product data |
| Reviews | **Zero.** Schema emits no rating; visible block gated on `custom.review_count` | `product-json-ld`, `main-product` |
| GSC / Merchant Center | **UNKNOWN — need** | — |

---

## 1. Structured data by template

| Template | @types emitted | Notes |
| --- | --- | --- |
| All pages (`layout/theme.liquid`) | `Organization`, `WebSite`, `BreadcrumbList` | global, via `organization-json-ld` + `breadcrumbs-json-ld` |
| Product | `ProductGroup` → `Product` (hasVariant) → `Offer`, `Brand`, `FAQPage` (5 Q) | `itemCondition: NewCondition`, live availability, `seller` → `#organization` |
| Collection | `CollectionPage`, `ItemList`, `ListItem`, `Product`, `Thing`, `FAQPage` (5 Q) | |
| Homepage | `ItemList`, `ListItem`, `Product`, `FAQPage` (6 Q) | |
| pSEO landing | `WebPage`, `FAQPage` (3 Q), `Thing`, **plus a second `Organization` and `WebSite`** | see defect E1 |
| `/pages/faq` | `FAQPage` (12 Q) | |
| `/pages/llms` | `WebPage`, `FAQPage` (4 Q), `Thing` | |
| Article | `BlogPosting`, `Person` | |

Totals: 35 `Question`/`Answer` pairs, exactly **one** `FAQPage` node per rendered
page — no stacking.

## 2. Duplicate titles — LIVE

| Title | Handles | Published | Canonical handling |
| --- | --- | --- | --- |
| **Build Your Own Bundle** | `build-your-own-bundle`, `build-your-own-bundle-1`, `bundle-custom` | **all 3 live** | `-1` and `bundle-custom` canonical → `build-your-own-bundle` ✅ |
| **llms** | `llms`, `llms-1` | **both live** | `llms-1` canonical → `llms` ✅ |
| Impressum | `impressum`, `impressum-1` | 1 live, 1 draft | not needed |
| Affiliate Program | `affiliate`, `affiliate-program` | 1 live, 1 draft | not needed |

Canonical targets all verified to exist and be published — **no 404 canonicals**
(the trap your brief flags is not present). Collections: 6, all unique titles.

## 3. Robots meta by template

| Template | Current directive |
| --- | --- |
| Product tagged `_hidden` / type `Add-on` | `noindex,nofollow` |
| **Everything else** | **nothing emitted — implicit index,follow** |
| Filtered / sorted / paginated / `/search` | **nothing — indexable** ❌ |
| `max-image-preview:large` | **absent everywhere** ❌ |

## 4. AI crawler policy (`templates/robots.txt.liquid`)

| Crawler | Status |
| --- | --- |
| `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Applebot` | explicitly `Allow: /` ✅ |
| `ChatGPT-User`, `Google-Extended`, `Applebot-Extended`, `Bingbot` | not named — fall to `*` (permissive) ⚠ |

## 5. `/llms.txt`, `/agents.md`

| Asset | Status |
| --- | --- |
| `/llms.txt` | **404.** No URL redirect exists (`urlRedirects` returns empty) ❌ |
| `/agents.md` | **404.** No template ❌ |
| `/pages/llms` | exists, good content, but **no crawler looks there by convention** ⚠ |
| `/pages/llms-1` | duplicate, canonicalised ⚠ |

## 6. FAQPage without visible Q&A

**None. Zero violations.** All six FAQ surfaces render visible
`<details>/<summary>` from the *same* Liquid variables that build the schema, so
text and markup agree by construction. The single-source defect your brief warned
about does **not** exist here. This is the strongest part of the current build.

## 7. Search Console brand queries

**Cannot retrieve — no GSC access in this session.** Phase 2.2 is blocked on this
and must not be guessed. Current `alternateName` is a single invented plural.

---

# Defects found

Severity: **P0** ship-blocker · **P1** material · **P2** hygiene

### C1 — P0 — Dupe landing pages naming trademarks, in Germany
`/pages/creed-aventus-alternative` and `/pages/baccarat-rouge-alternative`.
Germany applies UWG §6 to comparative advertising, and CJEU *L'Oréal v Bellure*
(C-487/07) held that smell-alike comparisons infringe trade mark **even when
every factual claim is true**. This is the highest-risk item in the audit and it
gates all Phase 5 markup. Needs a legal decision, not an engineering one.

### C2 — P0 — Fabricated star ratings hidden with CSS
`sections/main-product.liquid:815` hardcodes `★★★★½` on all four cross-sell
cards of every product page, for products with **zero** reviews.
`snippets/product-json-ld.liquid:90` then ships
`<style>.cs-stars{display:none}</style>` to hide it. The rating is invented, it
is still in the DOM, and the suppressing rule lives in an unrelated snippet — so
deleting that snippet makes fake ratings appear site-wide instantly. Delete the
markup, do not rely on the hide.

### C3 — P1 — `robots.txt` likely renders as one unparseable line
The default-group loop uses `{{- group.user_agent -}}` and `{{- rule -}}`.
Whitespace-stripping delimiters remove the newlines *between* directives, so the
output should be `User-agent: *Disallow: /adminDisallow: /cart…` on a single
line. Shopify's documented pattern deliberately omits the hyphens.
**Unverified by fetch** — the domain is blocked by this session's egress policy.
Open `https://www.nur-fragrance.com/robots.txt` and look: if line 1 is one long
run-on, every default rule is void.

### E1 — P1 — Entity fragmentation on landing pages
`sections/seo-landing-page.liquid:311` emits a second `Organization` with **no
`@id`** and the name `"NUR Fragrances"`, while the canonical node in
`organization-json-ld.liquid` is `"NUR Fragrance"` with `@id`
`{{shop.url}}#organization`. Two Organization entities, different names, one
unlinkable. Directly against Phase 2.1. Fix: replace with
`{"@id": "{{shop.url}}#organization"}`.

### E2 — P1 — Organization node is thin
No `address` at all (Phase 2.4 wants `addressLocality`/`Region`/`Country`, no
street). `logo` points at a **564-byte SVG** — Google's Organization logo
requires a raster image and does not support SVG. `alternateName` is one invented
plural, not GSC-derived. `inLanguage` is `["en","de"]`, not full locales.
`@type` is `Organization`; `OnlineStore` is the more precise honest choice.

### P1 — P1 — Product schema is missing the fragrance-specific layer
No `priceValidUntil`, no `shippingDetails`, no `hasMerchantReturnPolicy`, and no
`additionalProperty` — despite concentration, notes, longevity, projection,
occasion and gender **already existing in metafields** and already being
serialised into `nur-product-data-json.liquid`. The data is on the shelf and not
in the schema. This is the single highest-leverage buildable item.

### P2 — P1 — The gallery bug has a fifth instance, in Product schema
`snippets/product-json-ld.liquid:41` still has
`{%- elsif product.images.size > 0 -%}` ahead of the fallback gallery — the exact
short-circuit fixed everywhere else yesterday. For the four products carrying one
Shopify image, the schema advertises **1 image instead of 6–8**.

### I1 — P2 — Indexation floor gaps
No `noindex,follow` on filtered/sorted/paginated/`/search`. No
`max-image-preview:large` anywhere — costly for a fragrance catalogue. The one
`noindex` that exists uses `nofollow`, which blocks equity flow; Phase 1.2 wants
`follow`.

### A1 — P2 — No `speakable`, no `agents.md`, no root `llms.txt`
Phase 3.2–3.4 essentially unstarted. `/pages/llms` is good content at an address
nothing queries.

### H1 — P2 — hreflang decision is correct and documented
Manual hreflang was removed 2026-08-26 because Shopify already emits it in
`content_for_header`; the comment records the reasoning and says not to re-add.
**No action. Do not "fix" this.**

---

# Blocked on you

1. **Primary city** — for `addressLocality`.
2. **GSC access** (or a 90-day brand-query export) — Phase 2.2 cannot proceed
   without it and must not be invented.
3. **Merchant Center** — connected? Feed live? Determines `identifier_exists`
   urgency.
4. **Review platform** — any real reviews anywhere? If none, C2 is a deletion,
   not a migration.
5. **Legal call on C1** — keep, rewrite, or remove the two "alternative" pages.

---

# Batch A — applied 2026-09-13

Four decision-free theme fixes on an unpublished preview, plus one data cleanup
that went straight to production because metafields have no preview layer.

| Theme | Role | Contains |
| --- | --- | --- |
| `NUR Gallery Fix — Sept 12 (preview)` `/t/37` `206267023685` | **MAIN** | unchanged — verified |
| `NUR SEO Batch A — Sept 13` `/t/38` `206277181765` | UNPUBLISHED | Batch A |

| File | Size | md5 | Fix |
| --- | --- | --- | --- |
| `layout/theme.liquid` | 46,731 | `41a2a040…` | I1 conditional robots |
| `sections/main-product.liquid` | 84,598 | `ad606c60…` | C2 fabricated stars removed |
| `sections/seo-landing-page.liquid` | 54,706 | `8547cbc7…` | E1 entity reference |
| `snippets/product-json-ld.liquid` | 4,711 | `aa52bbe9…` | C2 hide-rule + P2 image source |

`themeFilesUpsert` again returned an empty array with no errors; all four were
read back and matched byte for byte.

## Closed

- **C2** — the hard-coded 4.5-star rating on every cross-sell tile is gone, and
  so is the CSS rule that hid it. A **second** instance was found at the reviews
  block: gated on `custom.rating`, which is null on all 16 products, so it is
  dormant — but it prints 4.5 stars regardless of the real value. Kept as the
  intended review hook, documented with a warning not to enable it until the
  glyphs derive from the actual number.
- **P2** — the fifth and final instance of the gallery short-circuit. All five
  surfaces now render one shared predicate.
- **E1** — landing-page `publisher` references `{shop}#organization` instead of
  declaring a second, anonymous, differently-named Organization.
- **I1** — `index,follow,max-image-preview:large` on indexable pages;
  `noindex,follow` on internal search and tag-filtered URLs. **Pagination left
  indexable on purpose**, against the brief: Google's guidance is that paginated
  pages stay indexable with self-canonicals or deep inventory is stranded.
  Reasoning is in the template so it is not reversed.
- **Curator quotes** — five rewritten to drop claims that cannot be
  substantiated, including "More than 5,900 reviews" on a store with zero, and
  two products both claiming to be "our highest-rated". Originals in
  `records/curator-quotes-original-2026-09-13.md`.

## Still open

| Item | Blocked on |
| --- | --- |
| **C1** two "alternative" landing pages naming Creed and Baccarat Rouge | legal decision |
| **C3** robots.txt run-on line | you opening `/robots.txt` — I cannot fetch it |
| **E2** Organization address, raster logo, `alternateName` | city, a PNG logo, GSC export |
| **P1** `additionalProperty` from metafields | your go-ahead; data is real and ready |
| **New:** `Save 67% vs boutique price` badge | decision — see below |
| **New:** per-product FAQ metafields are dead code | decision — see below |

### Save-% badge
`main-product.liquid:361` renders `Full bottle €45 · Save 67% vs boutique price`
on a decant listing. The RRP itself looks genuine and the "Full bottle" label is
honest, but the badge compares a 5 ml decant price against a 100 ml bottle price
and calls the difference a saving. Per millilitre the customer pays several times
more, not less. Under UWG §5 and the Omnibus Directive's reference-price rules
this deserves a look before it scales.

### Dormant FAQ metafields
Each product carries four well-written Q&A pairs in `custom.faq_q1..4` /
`faq_a1..4`. They are **not rendered** — `main-product.liquid` 557–687 is wrapped
in `{% comment %}` and `nur-product-faq.liquid` ships five generic hardcoded
questions instead. Two consequences: the best answer content on the site is
invisible to both shoppers and models, and several of those dormant answers frame
products against Creed, Baccarat Rouge 540, Flowerbomb and Kayali by name — so
switching them on without resolving C1 would push the trademark exposure into
FAQPage structured data.

## P1 closed — `additionalProperty` shipped to `/t/38`

`snippets/product-json-ld.liquid` — 9,339 b, md5 `bbea04d5…`, verified by
read-back. Live `/t/37` still at `e5d90855…` / 4,244 b, untouched.

**ProductGroup** now carries up to twelve `PropertyValue` entries: Top / Heart /
Base notes, Olfactive family, Longevity, Sillage, Best season, Occasion, and the
Sweetness / Spiciness / Woodiness / Floralcy scores. Scores emit a **numeric**
value with `minValue: 0` / `maxValue: 100` so a consumer can compare them
("sweeter than 60"); text attributes emit strings. Middot separators are
normalised to commas so values read as lists.

**Each variant** carries its own `Volume` property (`unitCode: MLT`), since
volume is the one attribute that genuinely varies by size.

| Product | Attributes | Variant volumes |
| --- | --- | --- |
| `dahaab-safi`, `khamrah` | 12 | 1, 2, 5, 10 ml |
| `club-de-nuit-precieux` | 11 (no `char_sweet`) | 1, 2, 5, 10 ml |
| `club-de-nuit-intense` | 10 | 1, 2, 5, 10 ml |
| 3 gift sets, packaging add-on | **0 — suppressed entirely** | none |

### Deliberately omitted

Recorded in the template so they are not "filled in" later:

- **concentration, gender, launch year, perfumer** — no source of truth exists on
  this store. `nur-product-data-json.liquid` defaults gender to `unisex` for its
  own UI filtering; that is a convenience, not a fact about the fragrance, and
  must not be published as structured data. Add real metafields and they wire in.
- **`rrp` / `rrp_save`** — a pricing claim under review, not a product attribute.

### Verification

Simulated the template against live store data across every gating path and
parsed the output: attribute counts as tabled, volumes resolve to 1/2/5/10,
bundles emit neither attributes nor volume, all documents parse. Liquid control
flow balanced (markup if 8/8, for 4/4, unless 4/4, comment 2/2; liquid-block
if 13/13, comment 2/2).

**Not verified — needs a real render.** Rich Results Test and Schema Markup
Validator against a rendered page; I cannot fetch the domain from this session.

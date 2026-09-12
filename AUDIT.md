# NUR Fragrances — product image / media audit

Store: `www.nur-fragrance.com` (NUR Fragrances, Shopify plan "Pause and Build")
Audit date: 2026-09-12
Live theme: **NUR Programmatic SEO AEO – July 19** — `gid://shopify/OnlineStoreTheme/202894508357`,
role `MAIN`, prefix `/t/36`, last updated **2026-08-26 19:23 UTC**

---

## Headline

**The theme is not the cause.** The previous theme and the live theme differ by
12 lines, none of them image-related. The galleries broke because on
**2026-08-27** a single product image was uploaded to four products, and the
gallery code treats "has any Shopify media" as "use only Shopify media" —
which silently discarded each product's curated 6–8 image asset gallery.

Cause is a **data change**, not a theme migration. The code path that reacted
badly to it has existed unchanged since at least 2026-07-09.

---

## How product images work in this theme

There is almost no Shopify product media. Product imagery is stored as **theme
assets** (`assets/<handle>-<n>.jpg`) and mapped to products by handle through
two hand-maintained lookup snippets:

| Snippet | Role |
| --- | --- |
| `snippets/nur-product-fallback-asset.liquid` | one hero asset per product |
| `snippets/nur-product-fallback-gallery.liquid` | pipe-delimited ordered gallery list per product |

`sections/main-product.liquid` consumes both. 78 numbered product images plus
12 `-hero` variants live in `assets/`.

---

## Product media inventory (Shopify Admin API, live)

| Product | Shopify media | Variant images | Asset gallery |
| --- | --- | --- | --- |
| `dahaab-safi` | 0 | none | 6 |
| `club-de-nuit-precieux` | **1** | none | 6 |
| `khamrah` | 0 | none | 8 |
| `yulali` | **1** | none | 8 |
| `club-de-nuit-intense` | 0 | none | 7 |
| `meydan` | 0 | none | 8 |
| `rose-01` | **1** | none | 8 |
| `kismet-angel` | 0 | none | 5 |
| `asad` | 0 | none | 6 |
| `royal-bleu` | 0 | none | 7 |
| `melodie` | **1** | none | 8 |
| `turath` | 0 | none | 7 |
| `bundle-arabian-introduction` | 0 | none | n/a (single bundle asset) |
| `bundle-signature-masculine` | 0 | none | n/a (single bundle asset) |
| `bundle-oud-explorer` | 0 | none | n/a (single bundle asset) |
| `luxury-gift-packaging-handwritten-card` | 0 | none | none (logo placeholder, hidden) |

12 of 16 products hold **zero** product media. No variant anywhere has its own
image, so there is no variant-image behaviour to restore (task section D is
moot on this store).

The four products that do have media were all uploaded in one 16-minute window:

| Product | Media uploaded (UTC) |
| --- | --- |
| `club-de-nuit-precieux` | 2026-08-27 16:38:32 |
| `yulali` | 2026-08-27 16:41:40 |
| `rose-01` | 2026-08-27 16:51:16 |
| `melodie` | 2026-08-27 16:54:15 |

The live theme was last modified 2026-08-26 19:23 UTC — the day before.

---

## Root cause

`sections/main-product.liquid` selected the gallery source with an `elsif`
chain that short-circuits on the first non-empty source:

```liquid
{%- if force_bundle_image and fallback_primary_asset != blank -%}
{%- elsif product.images.size > 0 -%}          <-- 1 image is enough to win
{%- elsif fallback_gallery_names != blank -%}   <-- 6-8 images, never reached
```

One Shopify image satisfies `product.images.size > 0`, so the entire curated
asset gallery was skipped. The same chain appears in three places, all of which
degraded together: the thumbnail strip, the JS `gallery` array (arrows, swipe,
lightbox, counter all read it), and the `gallery_count` used by the `1 / N`
counter.

Each affected product went from a 6–8 image gallery to exactly one image, with
no thumbnails and dead arrow buttons.

---

## Old vs current comparison

`sections/main-product.liquid`, previous theme (`/t/35`, 2026-07-19 05:11) vs
live (`/t/36`) — **12 lines changed, zero image logic**:

1. added `nur_root_url` routing variable
2. one bundle link switched to use it
3. a `{% comment %}` block wrapped, and `nur-product-faq` render added

Gallery precedence identical in both (`product.images.size > 0` at prev line
234 / live 235; `fallback_gallery_names` at prev 240 / live 241).

`snippets/nur-product-fallback-gallery.liquid` is **byte-identical (2,556 b)**
across themes `/t/32` (Jul 12), `/t/34` (Jul 19), `/t/35` (Jul 19) and `/t/36`
(live). The curated image lists have never changed.

### Per-product status

| Product | Previous | Current (before fix) | After fix | Status |
| --- | --- | --- | --- | --- |
| `club-de-nuit-precieux` | 6 | **1** | 6 | **restored +5** |
| `yulali` | 8 | **1** | 8 | **restored +7** |
| `rose-01` | 8 | **1** | 8 | **restored +7** |
| `melodie` | 8 | **1** | 8 | **restored +7** |
| `khamrah` | 8 | 8 | 8 | unaffected |
| `dahaab-safi` | 6 | 6 | 6 | unaffected |
| `club-de-nuit-intense` | 7 | 7 | 7 | unaffected |
| `meydan` | 8 | 8 | 8 | unaffected |
| `kismet-angel` | 5 | 5 | 5 | unaffected |
| `asad` | 6 | 6 | 6 | unaffected |
| `royal-bleu` | 7 | 7 | 7 | unaffected |
| `turath` | 7 | 7 | 7 | unaffected |
| 3 bundles | 1 | 1 | 1 | unaffected (intentional single image) |
| `luxury-gift-packaging…` | 0 | 0 | 0 | unaffected (no imagery exists) |

**26 images restored across 4 products. Every other product byte-identical.**

Classified against the brief: **(A)** completely missing — 26 images, fixed.
**(B)** hidden by CSS/JS — none found. **(C)** wrong reference — none.
**(D)** variant images — not applicable, no variant has an image.
**(E)** mobile-only — none. **(F)** gallery/thumbnail exposure — two
pre-existing defects, reported below, not fixed.

---

## Fix

One file: `sections/main-product.liquid`. A single decision variable computed
once, then honoured consistently by all five consumers.

```liquid
assign use_fallback_gallery = false
if fallback_gallery_names != blank and fallback_gallery.size > product.images.size
  assign use_fallback_gallery = true
endif
```

Changes: `gallery_count` source · main `<img>` source · thumbnail strip
condition · JS `gallery` array condition · sticky-bar thumbnail source.

Only `and` is used in these conditions, so Liquid's right-to-left operator
evaluation yields the intended result without parentheses (Liquid has none).

Deliberately **not** changed: layout, CSS, animation, hover behaviour, image
dimensions, mobile layout, thumbnail styling, image order, hero selection.
No product media created, deleted, or modified. No image URL hardcoded that
was not already an existing theme asset reference.

### Behaviour: richer source wins

| Scenario | Result |
| --- | --- |
| 0 media, 8 assets | asset gallery (8) — unchanged from before |
| 1 media, 8 assets | asset gallery (8) — **the fix** |
| 8 media, 8 assets | Shopify media (8) — hands over automatically |
| 9 media, 8 assets | Shopify media (9) |
| new product, 5 media, no asset entry | Shopify media (5) |
| new product, 0 media, no asset entry | placeholder, hidden (unchanged) |

Future products need no code change: with no asset-lookup entry, Shopify media
is always used. As real media is uploaded per product it takes over the moment
it matches the curated count — the asset fallback retires itself.

**Known trade-off:** uploading 3 real images to a product that has 8 curated
assets will still show the 8 assets. Uploading a full set (or more) hands over.
This is the deliberate choice — with the store's current data, one stray upload
must not be able to collapse a gallery again.

---

## Open items — reported, NOT changed

Both predate the live theme and appear identically in every theme inspected,
so neither is a regression. Both need a content decision, not a code decision.

**1. Six orphaned assets.** Present in `assets/`, never referenced by any
gallery list in any theme — so they have never been displayed:

`dahaab-safi-2.jpg` · `dahaab-safi-3.jpg` · `dahaab-safi-5.jpg` ·
`rose-01-6.jpg` · `royal-bleu-5.jpg` · `royal-bleu-6.jpg`

They were not added, because the lists are curated and the exclusions look
deliberate — consistent across four themes over two months. Adding them would
be a new editorial change, not a restoration. Confirm whether they should
appear, and where in the order.

**2. Hero image does not match the active thumbnail** on three products. The
main `<img>` uses the hero from `nur-product-fallback-asset.liquid` while the
thumbnail strip and arrows start at `gallery[0]`:

| Product | Hero shown | `gallery[0]` / thumb marked active |
| --- | --- | --- |
| `dahaab-safi` | `dahaab-safi-7.jpg` | `dahaab-safi-4.jpg` |
| `rose-01` | `rose-01-1.jpg` | `rose-01-5.jpg` |
| `royal-bleu` | `royal-bleu-1.jpg` | `royal-bleu-4.jpg` |

Visible symptom: pressing "next" from a cold page load re-displays the image
already on screen, because `_galIdx` starts at 0 while the hero is a different
entry. Fixable either by reordering those three lists so the hero is first
(changes image order), or by initialising `_galIdx` to the hero's index
(preserves order). The second is safer but touches gallery JS, so it is left
for your decision rather than bundled into an image-restoration fix.

---

## Verification performed

Static and data-level verification. **No browser rendering was possible** —
`www.nur-fragrance.com` is blocked by this session's network egress policy, and
the store is on the "Pause and Build" plan.

Checked:

- Liquid control-flow balance before/after — markup tags (`if` 160/160,
  `for` 8/8, `unless` 2/2, `case` 1/1, `capture` 3/3, `comment` 1/1,
  `schema` 1/1) and `{% liquid %}` block bodies (`if` 20→21, `endif` 20→21,
  `else` 5→6 — exactly the intended delta, all balanced)
- Gallery source simulated for all 16 products, before vs after: 4 changed
  (+26 images), 12 identical
- Six future/edge scenarios simulated — see behaviour table
- `assets/nur-product.css` (65,054 b) searched for rules hiding gallery
  elements: none. `.thumb-strip` is `overflow-x:auto` with `flex-shrink:0`
  72px thumbs, so 8 thumbnails scroll rather than clip. The only `display:none`
  is `.zoom-hint` on mobile
- Mobile block (`@media`, lines 698–715): thumbs resize to 64px with
  `scroll-snap-align`; nothing hidden, no horizontal-overflow risk introduced
- `assets/nur.js` (90,960 b) searched for gallery interference: **zero**
  gallery references — the entire gallery engine is inline in
  `main-product.liquid`, so no external JS can conflict
- Product cards (`snippets/nur-product-card.liquid`) render a single image with
  no hover-second-image and no card gallery, so homepage / collection / search /
  recommendation cards lost no images on 2026-08-27 — only which single image
  they show changed. Nothing missing, nothing changed by this fix
- Fallback gallery snippet transcription verified byte-exact (2,556 b) against
  the size Shopify reports

**Not verified — needs a real render.** Load each of the four restored product
pages and confirm: 6/8 thumbnails present, `1 / N` counter reads the new N,
arrows and swipe cycle the full set, lightbox opens every image, no console
errors, no horizontal overflow on mobile. Best done on a duplicate unpublished
theme before publishing.

---

## Files inspected

**Live theme (`/t/36`, `202894508357`)** — full manifest (≈200 files) plus in
full: `sections/main-product.liquid` (82,539 b) ·
`snippets/nur-product-fallback-gallery.liquid` (2,556 b) ·
`snippets/nur-product-fallback-asset.liquid` (1,865 b) ·
`snippets/nur-product-image.liquid` (2,472 b) ·
`snippets/nur-product-data-json.liquid` (11,023 b) ·
`snippets/nur-product-card.liquid` (21,430 b) · `templates/product.liquid` ·
`assets/nur-product.css` (65,054 b) · `assets/nur.js` (90,960 b)

**Previous themes** — `/t/35` `202893885765`: `sections/main-product.liquid`
(82,387 b) + fallback gallery. `/t/34` `202566336837` and `/t/32`
`202431136069`: fallback gallery. Library metadata for all 11 themes.

**Shopify data** — all 16 products: media, `featuredMedia`, variant images.

**Not inspected** (no bearing on the gallery defect): `templates/collection.liquid`,
`sections/main-homepage.liquid`, `assets/nur.css`, `assets/nur-home.css`,
`layout/theme.liquid`, and themes `/t/26`–`/t/31`, `/t/33`.

## Files changed

- `current-theme/sections/main-product.liquid` — the fix (5 hunks, +13 lines net)

Reference copies committed unchanged for diffing: `previous-theme/sections/main-product.liquid`,
`{current,previous}-theme/snippets/nur-product-fallback-gallery.liquid`,
`current-theme/assets/nur-product.css`, `current-theme/assets/nur.js`.

**Nothing has been written to the Shopify store.** The fix exists only in this
repository and awaits approval before being applied to a theme.

---

## Applied to Shopify — 2026-09-12

The fix is live on an **unpublished preview theme**. The live storefront is
untouched.

| | Theme | Role | `sections/main-product.liquid` |
| --- | --- | --- | --- |
| Live | NUR Programmatic SEO AEO – July 19 (`/t/36`, `202894508357`) | `MAIN` | 82,539 b · md5 `41c4a859…` · unchanged since 2026-07-19 |
| Preview | **NUR Gallery Fix — Sept 12 (preview)** (`/t/37`, `206267023685`) | `UNPUBLISHED` | 83,170 b · md5 `bb7ec238…` · written 2026-09-12 21:55 UTC |

Applied via `themeDuplicate` then `themeFilesUpsert` using a commit-pinned raw
URL (`ace7a3a`) so Shopify fetched the exact bytes reviewed here. Note
`themeFilesUpsert` returned an empty `upsertedThemeFiles` array with no
`userErrors`; the write was therefore confirmed by reading the file back — its
size and md5 match the local file exactly, so the empty array was not a failure.

Writes to the `MAIN` theme are blocked by the tooling regardless, so duplicating
was the only available route.

`snippets/nur-product-fallback-gallery.liquid` is md5 `571e77dc…` / 2,556 b in
**both** themes, confirming the curated image lists were not touched and the six
orphaned assets remain excluded as decided. That same md5 also matches the copy
transcribed into this repository, independently confirming it is byte-exact.

### Preview these four pages (each should now show 6–8 images, not 1)

```
https://www.nur-fragrance.com/products/club-de-nuit-precieux?preview_theme_id=206267023685   (expect 6)
https://www.nur-fragrance.com/products/yulali?preview_theme_id=206267023685                  (expect 8)
https://www.nur-fragrance.com/products/rose-01?preview_theme_id=206267023685                 (expect 8)
https://www.nur-fragrance.com/products/melodie?preview_theme_id=206267023685                 (expect 8)
```

Also worth spot-checking one untouched product — e.g. `khamrah` (expect 8,
exactly as today) — to confirm nothing regressed.

If the storefront is password-protected or restricted under "Pause and Build",
preview instead from Shopify admin: Online Store → Themes → *NUR Gallery Fix —
Sept 12 (preview)* → Preview.

Publishing is deliberately not automated and is blocked by the tooling. Publish
from Shopify admin once the four pages check out.

---

## Round 2 — the same cause on product cards (2026-09-12)

Reported from the preview: several products showed a generic NUR-branded render
instead of a real product photo. That image is the **2026-08-27 Shopify upload**
(e.g. `yulali.png`, 1024×1024). The screenshot was a **product card**, not the
PDP gallery — cards read `product.featured_image` directly, a path the round-1
fix did not touch.

Same root cause, second surface, same four products.

| Product | Card before | Card after |
| --- | --- | --- |
| `club-de-nuit-precieux` | Aug 27 upload | `club-de-nuit-precieux-1.jpg` |
| `yulali` | Aug 27 upload | `yulali-1.jpg` |
| `rose-01` | Aug 27 upload | `rose-01-1.jpg` |
| `melodie` | Aug 27 upload | `melodie-1.jpg` |
| other 12 products | unchanged | unchanged |

### One rule, one definition

Round 1 left the rule inline in `main-product.liquid`. Copying it into three more
files would have recreated exactly the drift that caused this bug, so it now
lives in a single new snippet:

**`snippets/nur-product-use-assets.liquid`** — returns `'1'` while a product's
curated asset gallery is richer than its Shopify media, nothing once Shopify
media catches up or when the product has no curated entry.

Rendered by all four surfaces:

| File | Surface |
| --- | --- |
| `sections/main-product.liquid` | PDP gallery, hero, thumbs, counter, sticky bar |
| `snippets/nur-product-card.liquid` | homepage carousel + collection grid cards |
| `snippets/nur-product-image.liquid` | trio / bundle imagery via `all_products` |
| `snippets/nur-product-data-json.liquid` | `img` in the JS payload (cart drawer, quiz, wishlist) |

`main-product.liquid` was refactored to use the snippet, so the inline copy is
gone and there is exactly one definition. Verified: no other file still contains
`fallback_gallery.size > product.images.size`.

In each card file the change is one line at the branch opener — from
`force_bundle_image and fallback_asset != blank` to `use_asset_image`. The
existing "bundle asset" branch and "fallback asset" branch render **byte-identical
markup**, so the 12 unaffected products produce exactly the same HTML as before;
only which branch they enter changes.

Nothing was deleted from Shopify. The four uploaded images remain in product
media, and the theme will switch back to them automatically once each product
has a full set.

### Round 2 deployed to the preview theme — verified by checksum

`themeFilesUpsert` again returned an empty `upsertedThemeFiles` array with no
`userErrors`, so every file was read back and compared. All five match the local
copies byte for byte:

| File | Size | md5 |
| --- | --- | --- |
| `sections/main-product.liquid` | 83,271 | `77e0a277…` |
| `snippets/nur-product-card.liquid` | 21,694 | `489de1d0…` |
| `snippets/nur-product-data-json.liquid` | 11,318 | `47938a2e…` |
| `snippets/nur-product-image.liquid` | 2,787 | `5812f7fd…` |
| `snippets/nur-product-use-assets.liquid` | 1,187 | `d25c4a66…` |

Live theme `/t/36` re-confirmed untouched — `main-product.liquid` `41c4a859…`,
`nur-product-card.liquid` `7ea8c03a…`, `nur-product-data-json.liquid`
`c00e7623…`, `nur-product-image.liquid` `c68780731…`, all still dated
2026-07-19, and `nur-product-use-assets.liquid` does not exist there at all.

### Check on the preview

Product cards — homepage carousel and collection grid. The four products below
should now show the same real bottle photography as the other twelve, not the
NUR-branded render:

```
https://www.nur-fragrance.com/collections/all?preview_theme_id=206267023685
https://www.nur-fragrance.com/?preview_theme_id=206267023685
```

Then re-check the four product pages from round 1 still show 6–8 gallery images,
and that `khamrah` is unchanged.

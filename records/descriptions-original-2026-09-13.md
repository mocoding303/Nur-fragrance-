# Product descriptions — originals before the 2026-09-13 trademark edit

Two of sixteen descriptions named another house's trademark. Both fed
`Product.description` in live structured data via `product-json-ld.liquid`.
The other fourteen were clean and are untouched.

## khamrah — EDITED
Product `gid://shopify/Product/15894219489605`

Before:
```html
<p>The legendary Khamrah by Lattafa — widely considered the best affordable alternative to Baccarat Rouge 540. Top notes of Honey &amp; Saffron, heart of Oud &amp; Rose, base of Vanilla &amp; Amber. Extraordinary longevity.</p>
```

After:
```html
<p>The legendary Khamrah by Lattafa — a warm amber-gourmand that became a modern classic. Top notes of Honey &amp; Saffron, heart of Oud &amp; Rose, base of Vanilla &amp; Amber. Extraordinary longevity.</p>
```

## club-de-nuit-intense — EDITED
Product `gid://shopify/Product/15894219587909`

Before:
```html
<p>The iconic Club de Nuit Intense by Armaf — the most acclaimed alternative to Aventus by Creed. Top notes of Grapefruit &amp; Birch, heart of Jasmine &amp; Apple, base of Musk &amp; Patchouli. Exceptional projection.</p>
```

After:
```html
<p>The iconic Club de Nuit Intense by Armaf — a fruity-smoky signature built on pineapple and birch. Top notes of Grapefruit &amp; Birch, heart of Jasmine &amp; Apple, base of Musk &amp; Patchouli. Exceptional projection.</p>
```

In both cases only the comparative clause changed. Vendor attribution, the full
note list and the closing performance line are identical, so the description
keeps its length, voice and search value.

---

# Not edited — reported instead

## khamrah journal link still names the trademark
`custom.journal_link` = `/blogs/journal/khamrah-vs-baccarat`
`custom.journal_link_text` = `Read: Khamrah vs Baccarat Rouge 540 — full comparison →`

This renders as link text on the product page and there is a blog article behind
it. Left alone deliberately: editorial comparison is treated differently from
product-page marketing claims, and deleting an article is a content decision, not
a defect fix. It is still C1 surface and needs the same legal answer.

(`meydan` and `turath` both link to `/blogs/journal/meydan-vs-turath`. Both are
NUR's own products, so no third-party mark is involved. No action.)

## Bundle descriptions contradict the products' own vendor field
| Bundle text | Product's `vendor` |
| --- | --- |
| "Dahaab Safi by **Ard Al Zaafaran**" (`bundle-arabian-introduction`) | **Lattafa** |
| "Turath by **Oud Elite**" (`bundle-oud-explorer`) | **The Spirit of Dubai** |

Not corrected, because the correct attribution is unknown and picking one would
be inventing a fact. Whichever is right, the site currently asserts both, and a
model reading the catalogue gets contradictory attribution for the same product.
Tell me which is correct and both sides get aligned in one pass.

---

# Correction and full C1 surface map (2026-09-13, after the edit)

**Correction.** I previously said khamrah's `journal_link_text` renders on the
product page. It does not — it is emitted at `main-product.liquid:634`, inside
the `{% comment %}` block spanning 557–687. Dormant, like the FAQ metafields.

Verified by sweeping every description and every metafield on all 16 products.

## LIVE — reachable and indexable today

| Surface | Detail |
| --- | --- |
| `/pages/creed-aventus-alternative` | page titled "Creed Aventus Alternative" |
| `/pages/baccarat-rouge-alternative` | page titled "Baccarat Rouge Alternative" |
| `/blogs/journal/khamrah-vs-baccarat` | **"Khamrah vs Baccarat Rouge 540 — Is the €13.90 Version Worth It?"** published 2026-05-22 |
| `/blogs/journal/arabian-dupes` | **"Arabian Fragrance Dupes: Save Up to €370 on Designer Scents"** published 2026-05-22 |

The `arabian-dupes` article is the single highest-risk item found in this audit.
It combines explicit dupe positioning with a quantified savings claim in the
title, and has been published since May. `khamrah-vs-baccarat` carries a
third-party mark in its title.

Other journal comparisons are fine: `meydan-vs-turath` and
`khamrah-vs-khamrah-qahwa` compare NUR's own products, and
`best-lattafa-samples-to-try-first` is nominative use of a house NUR resells.

## DORMANT — present in data, not rendered

Inside the 557–687 comment block, so not on any page and not in schema. They
become live the moment that block is uncommented:

| Product | Marks named in `faq_q*` / `faq_a*` |
| --- | --- |
| `khamrah` | Baccarat Rouge 540, BR540, with €300+ and €60+/ml price claims |
| `club-de-nuit-intense` | Creed Aventus |
| `club-de-nuit-precieux` | Aventus, Creed |
| `dahaab-safi` | Viktor&Rolf Flowerbomb, Kayali Vanilla 28 |
| `kismet-angel` | Mugler Angel |
| `royal-bleu` | Bleu de Chanel, YSL Y |

Plus `khamrah.journal_link_text` — "Read: Khamrah vs Baccarat Rouge 540".

Two dormant answers also carry unverifiable claims of the kind removed from the
curator quotes: `meydan.faq_a2` and `kismet-angel.faq_a3` both say "one of our
most-gifted" on a store with no review or gifting data published.

## FIXED today

`khamrah` and `club-de-nuit-intense` descriptions — the only two that were
live **and** in Product structured data.

## Consequence for the AEO plan

Enabling the dormant FAQ metafields was flagged as the biggest available AEO win.
It cannot happen until C1 is answered: doing so would move six products' worth of
trademark comparisons into FAQPage structured data, and republish two "most-gifted"
claims that were just removed elsewhere for being unverifiable.

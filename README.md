# Nur Fragrance — product image / media migration audit

Working repo for auditing product images and product media between the
previous and current Shopify themes for https://www.nur-fragrance.com/

## Status

**Root cause found and fixed in code. Not yet applied to the store.**
See `AUDIT.md` for the full report.

Short version: the theme was never the problem. Product imagery on this store
lives in `assets/` and is mapped to products by handle. On 2026-08-27 a single
image was uploaded to four products; the gallery treated "has any Shopify media"
as "use only Shopify media" and discarded each product's curated 6-8 image
gallery. 26 images were lost across `club-de-nuit-precieux`, `yulali`,
`rose-01` and `melodie`. Fixed in `current-theme/sections/main-product.liquid`.

Theme sources were pulled directly from the Shopify Admin API rather than
uploaded by hand, so the folders below are already populated with the files
that mattered to this audit.

## What to upload

Drop the *unzipped* contents of each theme into the matching folder, so that
`layout/theme.liquid` sits directly inside it:

```
previous-theme/     <- the older theme (the one where images displayed correctly)
  assets/
  config/
  layout/
  locales/
  sections/
  snippets/
  templates/

current-theme/      <- the theme currently live on nur-fragrance.com
  assets/
  config/
  ...
```

Do not commit the `.zip` files themselves — the audit needs the individual
files so they can be diffed line by line.

### How to export a theme from Shopify

1. Shopify Admin -> **Online Store** -> **Themes**
2. For the live theme: `...` (next to Customize) -> **Download theme file**
3. For the previous theme: scroll to **Theme library**, find it, then
   `...` -> **Download theme file**
4. Shopify emails a download link for each `.zip` to the store owner address
5. Unzip and place the contents as shown above

> If the previous theme is no longer in the Theme library, Shopify has not
> retained it — deleted themes are unrecoverable. Check for a local `.zip`
> backup or a theme/GitHub integration before assuming it is gone.

## Also useful (optional but speeds up root-cause work)

- `config/settings_data.json` from **both** themes — gallery behaviour is
  often controlled by theme settings, not code.
- A short list of specific products showing the problem, with the image count
  you expect vs. what you see.
- Screenshots of one affected product page, desktop and mobile.

## What will be examined once the source is here

Product detail page
- `sections/main-product.liquid`, `templates/product*.liquid|json`
- product media / gallery / thumbnail snippets
- `product.media`, `product.images`, `product.featured_media`,
  `variant.featured_media` usage and any filtering applied to them
- `media_type` filters that silently drop video / 3D / external media
- variant -> image switching logic
- image metafield references and namespace changes
- hardcoded `asset_url` / `file_url` image references, and whether the
  underlying asset files exist in the current theme
- gallery JavaScript and any CSS that hides media

Product cards elsewhere
- home, collection, search, related products, recommendations, cart

Cross-cutting
- desktop vs. mobile gallery differences
- image order, and whether the correct hero image is first
- responsive sizes / lazy loading regressions

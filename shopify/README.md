# Shopify 202609 import package

- `products-202609.csv` contains 27 products, one product per design, with one `ONE SIZE` variant and placeholder inventory values from the site catalog.
- `image-manifest-202609.csv` maps each Shopify handle to its derived web image in `public/images/202609/`.
- `raw_data/` is not used here and must remain unchanged.

## Import order

1. In Shopify Admin, upload the 27 derived images from `public/images/202609/` under **Content > Files** (or upload media directly to each product).
2. Use the copied public Shopify file URLs to fill the `Image Src` column in `products-202609.csv`; Shopify CSV imports require publicly accessible HTTPS image URLs.
3. Import the CSV under **Products > Import** and review the preview before confirming.
4. Create automated collections using the collection tags: `tidal-garden`, `night-signal`, `holiday-atelier`, and `studio-gloss`.
5. Verify inventory, shipping, tax, and sales-channel visibility before publishing.

The CSV intentionally leaves image URLs blank until the files are inside Shopify. The Vercel preview URL is protected and should not be used as a Shopify import image source.

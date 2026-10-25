# RenderLine public rates and drawing samples

Owner entry: `/portal` → **Website rates & samples**, or `/portal/website` after signing in with an existing owner account.

## Editing rates

Change the numeric PKR fields and choose **Save website rates & samples**. This updates the existing site's public `site_content.pricing_config` and invalidates the public layouts. The homepage, service pages, tables and calculators all use that same rate configuration. Anonymous visitors and non-owner accounts cannot use the management endpoint.

`src/lib/pricing-defaults.json` contains the deployment fallback. Published prices are guide prices; the written quote defines scope, revisions, formats and delivery. No negotiability or unverified discount percentage is advertised.

The finalized 1-kanal rule is a PKR 30,000 booklet base plus PKR 3,500 for each marla above 20, following the owner's later instruction to finalize a balanced guide schedule. Standalone dimensioned floor plans are priced for up to **two storeys total**, not per storey. Commercial interior visualization OR working uses a separate per-storey schedule. Commercial complete packages cover up to two storeys, exclude basement and architectural drawings, and have their own package prices.

## Publishing authentic drawing samples

The public library is `/drawing-samples`. It supports architectural working, structural and submission disciplines; standard plot sizes; ground/first-floor or apartment options; readable PNG/JPEG page previews and the complete sample PDF.

No real PDF samples were supplied during this implementation. The library is intentionally empty and offers a contextual sample-request action rather than invented drawings. Never publish private client documents or personal/ownership information without permission. When the owner provides files, inspect the actual PDFs, prepare legible page previews and add approved public file URLs using the sample editor.

Sample object:

```json
{
  "id": "unique-sample-id",
  "title": "The actual sample title",
  "discipline": "working",
  "marla": 3,
  "level": "Ground + first floor",
  "description": "Describe the actual included sheets and options.",
  "pdf": "https://renderline.pk/path-to-approved-sample.pdf",
  "previews": ["https://renderline.pk/path-to-page-preview.png"]
}
```

Only HTTPS files on the existing studio Cloudinary account, Supabase project or renderline.pk are accepted. Preview links are required. These are public files; keep private project uploads in the existing portal.

## Portfolio categories

The existing website CMS has a **Categories** action for each item. Select one or more real categories and save. Categories are stored as pipe-separated keys in the existing text field, and the frontend supports them without losing old single-category items. The verified neoclassical elevation is also discoverable by its existing title. Do not classify unrelated exterior work as front elevations or call 3D layout studies dimensioned 2D drawings.

## Scope and exclusions

- Residential booklet includes 3D front elevation. Structural engineering, submission drawings and interiors are separate.
- Standalone plans include dimensions; furniture layouts and other architectural working details are excluded.
- Interior guide rate is per square foot, with the minimum applied to each individual space.
- Structural area uses actual covered square feet. No automatic marla conversion is assumed.
- Authority fees, approval guarantees and professional stamping are not included.
- Modeling, source model delivery, animation duration and complex/non-marla projects are quoted by scope.

Existing portal permissions, project data, contact number, real portfolio media and the legacy-domain 308 redirect are preserved.

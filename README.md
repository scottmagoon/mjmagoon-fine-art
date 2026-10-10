# MJ Magoon Fine Art

Mary Jane Magoon's artwork portfolio. Astro static site, published through GitHub to Netlify. The custom domain will be configured after the preview is approved.

## Preview new artwork

1. Put lowercase `.jpg` files into the four folders under `/Users/Shared/Artwork`: Landscape, Still-Life, People, Animals. Keep originals outside these category folders.
2. Open Terminal and paste:

```sh
cd ~/Documents/Projects/mjmagoon-fine-art
npm run prepare-site
npm run preview
```

3. Open the local address shown by Terminal. Press Control+C in Terminal when finished.

Preparation makes optimized, correctly oriented, metadata-stripped website copies. Shared artwork files are never changed. Existing website content is saved under `.artwork-backups/` locally before replacement. Category covers are defined near the top of `scripts/import-artwork.mjs`.

## Publish an update

After reviewing the preview, paste:

```sh
cd ~/Documents/Projects/mjmagoon-fine-art
npm run publish
```

The script prepares and checks the site, then asks you to type **PUBLISH**. Press Enter without typing that word to stop. Publication commits artwork and site settings and pushes to GitHub. Netlify must be connected to this repository's `main` branch. Confirm that its deployment succeeds; a GitHub push alone is not proof the website is live.

Do not run publishing to resolve unrelated code changes. Ask for help with any error.

## Build settings

- Build command: `npm run build`
- Publish directory: `dist`
- Node: 22
- Source repository: https://github.com/scottmagoon/mjmagoon-fine-art

Only prepared website copies are committed. Originals, backups, PDFs supplied for content planning, credentials, and local build output are excluded.

Preview URL: https://mjmagoon-fine-art.netlify.app

The Netlify configuration currently sends `X-Robots-Tag: noindex` while content is under review. Remove that header when the final domain is ready for indexing.

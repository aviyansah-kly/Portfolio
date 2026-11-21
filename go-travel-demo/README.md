# Go Travel — responsive landing page portfolio demo

**Live preview:** https://go-travel-demo.aviyansah.workers.dev/

Source design: https://www.figma.com/design/fLEKppP0HFgl0N8VLXA6zg/Landing-Page---Go-Travel?node-id=308-112

An HTML, CSS and JavaScript reconstruction of the Go Travel Figma design with section transitions, responsive layout, navigation, hero image pager, destination carousel, destination CTA demo, and testimonial switcher.

## Hosting

The demo is served by the dedicated Cloudflare Worker `go-travel-demo` on the personal `aviyansah` workers.dev subdomain. It serves only the allowlisted HTML, CSS, JS and image files from this GitHub branch (`go-travel-html-demo`). Assets are fetched from the public GitHub source with a short edge cache (about 5 minutes). The production portfolio and other Cloudflare projects are untouched.

Direct GitHub-connected Pages setup was unavailable due to a Cloudflare Pages Git installation error; this standalone Worker is the current preview publishing path.

## Deployment fix (2026-11-21)

The initial Worker forwarded the upstream `raw.githubusercontent.com` response headers, including GitHub's restrictive Content-Security-Policy (`sandbox`). This blocked stylesheet, JavaScript and image subresources when the HTML was served as a website. **Fixed** by constructing clean response headers and a site-appropriate CSP in [`deploy/worker.js`](./deploy/worker.js). Desktop browser verification confirmed 158 CSS rules applied, DM Sans font loaded, hero image visible and destination image assets loaded.

For subsequent Worker updates, keep `deploy/worker.js` in sync with the deployed Cloudflare script; do **not** pass through upstream GitHub security headers. The Worker is independent of the GitHub repository deployment automation and is updated through Cloudflare API.

## How to run

Open index.html in a browser or serve this directory on any static server. The site references fonts from Google Fonts; fallback system fonts apply offline.

## Design fidelity / remaining assets

Primary hero photos, destination cards, about image, and three gallery images were exported from actual Figma layers and stored locally. The Figma tool hit its Starter plan usage limit before Raja Ampat, Sempu Beach, and the full-size testimonial portrait could be retrieved. Their image slots are deliberately marked with a geometric placeholder or low-resolution preview, rather than silently using an unrelated photograph. Replace these after Figma access resumes.

No booking, account sign-up, social links or contact integration is connected; interactions are demonstration-only. The original copy contains placeholders, retained as reference. The website should be visually reviewed against the Figma source before presenting it as final pixel-perfect work.

(c) Avi Yansah.
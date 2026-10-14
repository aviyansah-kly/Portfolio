# Intlife Landed Smart Living — Design V2

**Date:** 14 October 2026
**Status:** V2.1 interactive refinement for client alignment. Not production or final approval.

## Design history (kept separately, no overrides)

- Original clean concept, 13 October: `/experiments/intlife-landing-original-13oct/`
  - Git commit: `660250c00521c6e7d4fae7ecc875c4cfc52dc809`
- Previous revision: `/experiments/intlife-landing-preview/`
- New feedback-aligned V2: `/experiments/intlife-landing-v2/`
- Comparison index: `/experiments/intlife-version-history/`

## Source of decisions

- Preserve the clean/modern feel of the old landing page; do not merely add more text.
- Follow the October 5 structure:
  Hero → Problem → Solution → How It Works → Key Features → Product/App Showcase → Testimonials/Results → Lead Form → FAQ → Final CTA.
- Intlife's core offer is *Smart Living built into landed properties*, not direct sales of solar hardware or BESS.
- Homeowner experiences (comfort, safety, control) are the product story; developers are the target lead audience.
- Remove all "show unit" selling language.
- Use scrolling product motion and interaction rather than long explanatory feature paragraphs.
- Show partner credibility and real residential results.
- Preserve *Valeria (IOI Properties): 50 homes, 2025* and approved developer projects as proof.

## Current V2 components

1. Hero — real landed project image and three interactive modes (Morning / Home / Away)
2. Problem — traditional vs connected-home comparison
3. Solution — comfort, safety and control; three concise benefit tiles
4. How It Works — scroll-responsive house illustration with lighting, security, optional energy flow and existing Intlife app mockup
5. Key Features — four compact essentials; energy a supporting feature only
6. Product/App Showcase — existing intlife Smart Living app mockup from v1
7. Testimonials/Results — partner proof at page top and Valeria case study
8. Lead Form — preview form, DOES NOT submit or store user information
9. FAQ — four questions
10. Final CTA — short conversion close

## Client-dependent items before approval

1. **Original design confirmation:** client to confirm whether 13-Oct archive is the preferred earlier mock.
2. **App UI source:** new client Figma file `kigiHKOO8nu865M1HshtDj` is not accessible through current Figma connector permissions. Existing official mockup is used instead. Do not claim pixel-accurate app interactions yet.
3. **Developer logos:** the client-supplied image identifies IOI Group, Matrix, IJM Land, MKH, Prima Communications and others. V2 currently uses readable **text wordmarks**; final vector/brand logo assets and permission/source must be supplied/confirmed. Do not promote "5 of Top 10" until ranking source/year is verified.
4. **Energy features:** animated flow is conceptual, not a claim of live PV/BESS integrations or specific hardware. Confirm supported app integration from Intlife technical team.
5. **Real quantitative proof:** request approved total completed homes, number of developments and credible testimonials.
6. **Integration:** HubSpot, real lead delivery, WhatsApp, analytics and Google Ads conversion tracking are not enabled in the preview. Set up and QA during development phase.
7. **QA:** Code structure and responsiveness rules are checked, but actual Cloudflare-rendered browser screenshots need validation before sharing for final approval.

## Primary audience & content

- **Audience:** landed residential property developers in Malaysia
- **Proposition:** homes people love to live in; connected lifestyle as part of the brick-and-mortar property
- **Primary CTA:** Discuss your project
- **Secondary CTA:** Explore smart living
- **Supportive topics:** compatible energy awareness, solar-ready infrastructure, optional storage, without calling them standalone products

## Quality audit — 14 October 2026

- Verified source markup, local anchor targets and unique IDs; all are consistent.
- Verified JavaScript parses and CSS braces are balanced; no page-level browser screenshot verification was available.
- Corrected prototype form validation: required name, work email and company must pass browser validity before showing the preview-only message. No data is sent or stored.
- Corrected narrow-screen (up to 460 px) energy-flow pill layout to avoid label overflow.
- Added short, published website figures to the key-partners strip: **10,000+ smart homes, 50,000+ IoT devices, 5 states** (source: `https://intlife.com.my/` as accessed 14 Oct 2026). Request explicit client sign-off before using in paid campaigns; the About Us page includes older milestone figures.
- No unsupported "5 of Malaysia's Top 10" ranking claim is reproduced in V2.

### Outstanding blockers to client-ready design approval

1. Client to confirm that the archived 13-Oct visual is the intended previous design.
2. App Figma: `https://www.figma.com/design/kigiHKOO8nu865M1HshtDj/Intlife-App?node-id=0-1` is currently inaccessible with linked Figma credentials. V2 uses the earlier approved welcome-screen mockup only, not the real functional app screens.
3. Replace text-based partner names with real logos/assets from the client's official source.
4. Review the scroll-stage illustration against the requested product-motion reference. V2 is an interactive proof of concept, not yet equivalent to an app-backed animated product demo or an exact FoxESS-style energy diagram.
5. Verify actual Cloudflare production preview at desktop/tablet/mobile with browser screenshots and click-through testing.
6. Confirm current scale metrics, preferred developer proof and scope of energy integration with the client.

## V2.1 refinement — 14 October 2026

- **Preserved V2.0 snapshot** at `/experiments/intlife-landing-v2-0/`; original design and earlier preview are unchanged.
- **How It Works: richer animation tied to actual visuals.** Replaced the schematic cartoon house with a real Intlife project photo and distinct visual states for Home (lighting and comfort), Security (connected access), Energy (conceptual Solar → Home → optional Battery flow) and App (existing official welcome-screen mockup).
- **Hero:** scene selector changes visible photo treatment and on-image status indicator, not just the copy.
- **Product/App Showcase:** added interactive Scenes / Security / Devices capability controls around the existing Intlife-branded welcome screen; explicitly **not** a fake reconstruction of the latest app Figma screens.
- **Motion/accessibility:** transform/opacity animations, keyboard-activatable native buttons, selected states using `aria-pressed`, live text updates and reduced-motion support; mobile-specific layout.
- **Partner presentation:** partner identities remain text only until original artwork is available; the numerical trust strip uses published Intlife figures, subject to client sign-off.
- **Version comparison:** `/experiments/intlife-version-history/` now links Original, Previous Draft, V2.0 and V2.1.

### Required for final client approval

1. Confirm preferred previous design with client on video call.
2. Obtain viewable App Figma screens and replace welcome-only mockup with actual current features/screens.
3. Obtain approved high-quality partner/developer logo files and confirm permission + full current partner list.
4. Confirm whether optional energy integration should be shown more technically (visual remains expressly conceptual).
5. Complete visual browser QA of Cloudflare deployment on 1440 / 1024 / 390 px and test interaction/accessibility.

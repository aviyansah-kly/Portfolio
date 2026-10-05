# Highfield Scroll Hero Experiment

Isolated prototype for testing a full-screen hero video whose timeline is controlled by page scroll.

## URL structure

When deployed with the current Cloudflare static-assets setup:

`/experiments/highfield-scroll-hero/`

## Add the source video

Place the Highfield MP4 here as:

`site/experiments/highfield-scroll-hero/video.mp4`

Optional poster:

`site/experiments/highfield-scroll-hero/poster.jpg`

Recommended video export:
- MP4 / H.264
- no audio required
- short clip (roughly 5–20 seconds works best)
- optimize for web / fast seeking
- frequent keyframes if possible

## Interaction

The section is 500vh tall on desktop. While the hero remains sticky, scroll progress from 0–100% maps to video time from the first to final frame.

The JavaScript uses requestAnimationFrame and light interpolation so trackpad scrolling feels smoother.

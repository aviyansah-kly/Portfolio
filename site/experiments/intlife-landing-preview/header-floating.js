/**
 * Floating intlife header + responsive CTA grouping.
 * Header starts clear over hero, becomes a rounded floating surface on scroll.
 * Dual CTA buttons only stack if their intrinsic width cannot fit one row.
 */
(() => {
  "use strict";
  const header = document.querySelector(".header");
  const heroButtons = document.querySelector(".hero__actions");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrollQueued = false;
  let resizeQueued = false;

  function updateHeader() {
    scrollQueued = false;
    if (!header) return;
    const scrolled = window.scrollY > 58;
    header.classList.toggle("is-scrolled", scrolled);
  }

  function updateCTA() {
    resizeQueued = false;
    if (!heroButtons) return;
    if (window.matchMedia("(max-width: 680px)").matches) {
      heroButtons.classList.add("is-stacked");
      return;
    }
    // Temporarily measure each intrinsic, unwrapped button at its natural width.
    heroButtons.classList.remove("is-stacked");
    const children = [...heroButtons.querySelectorAll(":scope > a")];
    if (children.length < 2) return;
    const style = window.getComputedStyle(heroButtons);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    const total = children.reduce((sum, el) => sum + el.getBoundingClientRect().width,0)
      + gap * (children.length - 1);
    if (total > heroButtons.clientWidth + 1) {
      heroButtons.classList.add("is-stacked");
    }
  }

  updateHeader();
  updateCTA();

  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateHeader);
  },{passive:true});

  window.addEventListener("resize", () => {
    if (resizeQueued) return;
    resizeQueued = true;
    window.requestAnimationFrame(() => {
      updateHeader();
      updateCTA();
    });
  },{passive:true});

  window.addEventListener("load", updateCTA, {once:true});
  document.fonts?.ready?.then(updateCTA);
  if (window.ResizeObserver && heroButtons) {
    const observer = new ResizeObserver(() => {
      if (resizeQueued) return;
      resizeQueued = true;
      window.requestAnimationFrame(updateCTA);
    });
    observer.observe(heroButtons);
  }

  if (reducedMotion) {
    header?.classList.add("reduce-header-motion");
  }
})();

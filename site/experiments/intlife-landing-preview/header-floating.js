/**
 * Floating intlife header + responsive CTA grouping.
 * Header starts clear over hero, becomes a rounded floating surface on scroll.
 * Dual CTA buttons only stack if their intrinsic width cannot fit one row.
 */
(() => {
  "use strict";
  const header = document.querySelector(".header");
  const actionGroups = [
    ...document.querySelectorAll(".hero__actions, .case-study__actions")
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrollQueued = false;
  let resizeQueued = false;

  function updateHeader() {
    scrollQueued = false;
    if (!header) return;
    const scrolled = window.scrollY > 58;
    header.classList.toggle("is-scrolled", scrolled);
  }

  function updateCTA(group) {
    if (!group) return;
    const children = [...group.querySelectorAll(":scope > a")];
    if (children.length < 2) return;

    if (window.matchMedia("(max-width: 680px)").matches) {
      group.classList.add("is-stacked");
      return;
    }

    // Compare intrinsic button widths against their actual column width.
    // Clear the stacked class before measurement so either CTA group can
    // return to one row naturally as its containing column grows.
    group.classList.remove("is-stacked");
    const computed = window.getComputedStyle(group);
    const gap = parseFloat(computed.columnGap || computed.gap || "0") || 0;
    const total = children.reduce((sum, element) => sum + element.getBoundingClientRect().width, 0)
      + gap * (children.length - 1);
    group.classList.toggle("is-stacked", total > group.clientWidth + 1);
  }

  function updateAllCTAs() {
    resizeQueued = false;
    actionGroups.forEach(updateCTA);
  }

  updateHeader();
  updateAllCTAs();

  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateHeader);
  }, {passive:true});

  window.addEventListener("resize", () => {
    if (resizeQueued) return;
    resizeQueued = true;
    window.requestAnimationFrame(() => {
      updateHeader();
      updateAllCTAs();
    });
  }, {passive:true});

  window.addEventListener("load", updateAllCTAs, {once:true});
  document.fonts?.ready?.then(updateAllCTAs);
  if (window.ResizeObserver && actionGroups.length) {
    const observer = new ResizeObserver(() => {
      if (resizeQueued) return;
      resizeQueued = true;
      window.requestAnimationFrame(updateAllCTAs);
    });
    actionGroups.forEach(group => observer.observe(group));
  }

  if (reducedMotion) {
    header?.classList.add("reduce-header-motion");
  }
})();

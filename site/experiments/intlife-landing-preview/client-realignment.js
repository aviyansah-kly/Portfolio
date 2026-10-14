/**
 * Intlife | client-aligned interactions
 * Project-proof image selector + genuine solution visualisation as user scrolls.
 * Works without GSAP, without external APIs, and respects reduced motion.
 */
(() => {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Project references are real intlife portfolio projects, never sample brands.
  const heroButtons = $$(".hero-projects__item");
  const heroVisual = $(".hero__visual--projects");
  const heroImage = $("#hero-project-photo");
  const projectName = $("#hero-project-name");
  const projectDetail = $("#hero-project-detail");
  const projectLink = $("#hero-project-link");
  let projectTransition = null;

  heroButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) return;
      heroButtons.forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      if (!heroImage || !projectName || !projectDetail || !projectLink) return;

      const title = button.dataset.projectTitle || "";
      const detail = button.dataset.projectDetail || "";
      const image = button.dataset.projectImage || "";
      const destination = button.dataset.projectLink || "#case-study";
      const alt = button.dataset.projectAlt || title;
      if (projectTransition) clearTimeout(projectTransition);
      if (!reducedMotion) heroVisual?.classList.add("project-changing");

      projectTransition = setTimeout(() => {
        // Text is assigned safely without injecting HTML.
        heroImage.src = image;
        heroImage.alt = alt;
        projectName.textContent = title;
        projectDetail.textContent = detail;
        projectLink.href = destination;
        projectLink.setAttribute("aria-label", "Explore " + title + " project reference");
        if (!reducedMotion) requestAnimationFrame(() => {
          heroVisual?.classList.remove("project-changing");
        });
      }, reducedMotion ? 0 : 135);
    });
  });

  // Connected systems: visually distinguish how each part contributes.
  // This is illustrative; it does not claim that all BESS hardware works
  // through the intlife application without project-specific integration.
  const integrated = $(".integrated");
  const visual = $(".integrated__visual");
  const storyButtons = $$(".integrated__step");
  const heading = $("#integrated-stage-title");
  const description = $("#integrated-stage-description");
  const label = $("#integrated-stage-eyebrow");
  const stageNumber = $("#integrated-stage-number");
  const stages = {
    solar: {
      number: "01 / 04",
      eyebrow: "ENERGY GENERATION",
      title: "Plan a solar-ready development.",
      description: "Explore rooftop solar PV and energy requirements early in the landed project."
    },
    storage: {
      number: "02 / 04",
      eyebrow: "ENERGY STORAGE",
      title: "Add flexibility with BESS.",
      description: "Discuss battery storage options around site feasibility, compatibility and usage goals."
    },
    home: {
      number: "03 / 04",
      eyebrow: "SMART HOME",
      title: "Connect everyday living.",
      description: "Lighting, air-conditioning, smart access and supported automation in one home experience."
    },
    app: {
      number: "04 / 04",
      eyebrow: "HOMEOWNER EXPERIENCE",
      title: "Make the home easier to use.",
      description: "Give homeowners simpler access to supported devices and available energy information."
    }
  };

  function setStage(id) {
    if (!visual || !stages[id] || visual.dataset.activeSystem === id) return;
    const copy = stages[id];
    visual.dataset.activeSystem = id;
    if (stageNumber) stageNumber.textContent = copy.number;
    if (label) label.textContent = copy.eyebrow;
    if (heading) heading.textContent = copy.title;
    if (description) description.textContent = copy.description;
    storyButtons.forEach(button => {
      const selected = button.dataset.systemStep === id;
      button.classList.toggle("is-current", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  storyButtons.forEach(button => {
    button.addEventListener("click", () => {
      setStage(button.dataset.systemStep);
      // Preserve a calm, accessible reading experience: no automatic
      // jump or forced scroll on a stage click.
    });
  });

  let scrollTick = false;
  function updateActiveStoryOnScroll() {
    scrollTick = false;
    if (!integrated || !visual || window.innerWidth <= 980 || reducedMotion) return;
    const section = integrated.getBoundingClientRect();
    if (section.top > window.innerHeight * .70 || section.bottom < window.innerHeight * .28) return;

    const focusY = window.innerHeight * .49;
    let closest = null;
    let distance = Infinity;
    storyButtons.forEach(button => {
      const r = button.getBoundingClientRect();
      // The centre of the visible step tracks the scroll storytelling rhythm.
      const stepCenter = r.top + r.height / 2;
      const delta = Math.abs(stepCenter - focusY);
      if (delta < distance) { closest = button; distance = delta; }
    });
    if (closest) setStage(closest.dataset.systemStep);
  }
  if (integrated && storyButtons.length) {
    window.addEventListener("scroll", () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(updateActiveStoryOnScroll);
    }, { passive:true });
    window.addEventListener("resize", updateActiveStoryOnScroll, { passive:true });
    updateActiveStoryOnScroll();
  }
})();

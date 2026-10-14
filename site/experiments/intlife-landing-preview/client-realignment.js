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

  // Photographic product storytelling: real examples of equipment types,
  // never a claim that these exact products were installed in intlife projects.
  const integrated = $(".integrated");
  const visual = $(".complete__visual");
  const storyButtons = $$(".complete__step");
  const scenes = $$(".complete__scene-layer");
  const flowNodes = $$(".complete__flow-node");
  const stageTitle = $("#integrated-stage-title");
  const stageDescription = $("#integrated-stage-description");
  const stageLabel = $("#integrated-stage-eyebrow");
  const stageNumber = $("#integrated-stage-number");
  const stageIcon = $(".complete__scene-corner");
  const stageContent = {
    solar: {
      number:"01 / 04",label:"01 / GENERATE",title:"Start with solar-ready homes.",
      description:"Explore rooftop solar PV as part of the development's energy plan.",
      icon:"sun-medium"
    },
    storage: {
      number:"02 / 04",label:"02 / STORE",title:"Consider energy storage.",
      description:"Explore BESS options, project suitability and energy requirements.",
      icon:"battery-charging"
    },
    home: {
      number:"03 / 04",label:"03 / CONNECT",title:"Create smarter everyday living.",
      description:"Bring compatible lighting, air-conditioning, access and security together.",
      icon:"house"
    },
    app: {
      number:"04 / 04",label:"04 / CONTROL",title:"Simple control for homeowners.",
      description:"Use the intlife app for supported smart-home devices and automation.",
      icon:"smartphone"
    }
  };

  let activeStage = "solar";
  function setStage(next) {
    if (!visual || !stageContent[next] || next === activeStage) return;
    activeStage = next;
    const copy = stageContent[next];
    visual.dataset.activeSystem = next;
    if (stageNumber) stageNumber.textContent = copy.number;
    if (stageLabel) stageLabel.textContent = copy.label;
    if (stageTitle) stageTitle.textContent = copy.title;
    if (stageDescription) stageDescription.textContent = copy.description;
    scenes.forEach(scene => {
      const selected = scene.dataset.scene === next;
      scene.classList.toggle("is-visible",selected);
      scene.setAttribute("aria-hidden",String(!selected));
    });
    flowNodes.forEach(node => node.classList.toggle("is-current",node.dataset.flowStep === next));
    storyButtons.forEach(button => {
      const selected = button.dataset.systemStep === next;
      button.classList.toggle("is-current",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
    if (stageIcon && window.lucide) {
      const glyph = stageIcon.querySelector("[data-lucide]");
      if (glyph) {
        // Lucide replaces placeholders with SVG. Rebuild the icon when changing scenes.
        stageIcon.innerHTML = '<i data-lucide="' + copy.icon + '" aria-hidden="true"></i>';
        window.lucide.createIcons({nodes:[stageIcon],attrs:{"stroke-width":1.8}});
      }
    }
  }

  storyButtons.forEach(button => {
    button.addEventListener("click",() => setStage(button.dataset.systemStep));
  });

  let scheduled = false;
  function updateStageFromScroll() {
    scheduled = false;
    if (!integrated || !visual || window.innerWidth <= 980 || reducedMotion) return;
    const bounds = integrated.getBoundingClientRect();
    if (bounds.top > window.innerHeight * .8 || bounds.bottom < window.innerHeight * .2) return;
    const targetY = window.innerHeight * .52;
    let winner = null;
    let shortest = Infinity;
    storyButtons.forEach(button => {
      const r = button.getBoundingClientRect();
      const distance = Math.abs((r.top+r.bottom)/2-targetY);
      if (distance < shortest) {winner=button;shortest=distance;}
    });
    if (winner) setStage(winner.dataset.systemStep);
  }
  if (integrated && storyButtons.length) {
    window.addEventListener("scroll",() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateStageFromScroll);
    },{passive:true});
    window.addEventListener("resize",updateStageFromScroll,{passive:true});
    updateStageFromScroll();
  }

  // Presentation is still intelligible without an image response.
  scenes.forEach(scene => {
    const img = scene.querySelector("img");
    img?.addEventListener("error",()=>scene.classList.add("image-unavailable"));
  });

})();

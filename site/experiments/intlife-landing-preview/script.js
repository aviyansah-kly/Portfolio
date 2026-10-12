(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }

  // Small, accessible navigation for tablet and mobile layouts.
  const nav = $("#main-navigation");
  const toggle = $(".menu-toggle");
  function closeNavigation() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  }

  toggle?.addEventListener("click", () => {
    if (!nav) return;
    const isOpen = !nav.classList.contains("open");
    nav.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("menu-open", isOpen);
  });
  $$(".nav a").forEach(link => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeNavigation();
  });
  document.addEventListener("click", event => {
    if (nav?.classList.contains("open") && !event.target.closest(".header__inner")) {
      closeNavigation();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeNavigation();
  });

  // UI demonstration only. No connected device is controlled here.
  const scenes = {
    day: ["Good morning", "A simple start to the day."],
    evening: ["Welcome home", "Your lighting and comfort, ready."],
    away: ["Away mode", "Check home access while you’re out."]
  };
  $$(".scene-control").forEach(button => {
    button.addEventListener("click", () => {
      const scene = scenes[button.dataset.scene];
      if (!scene) return;
      $$(".scene-control").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      const sceneTitle = $("#scene-title");
      const sceneSubtitle = $("#scene-subtitle");
      if (sceneTitle) sceneTitle.textContent = scene[0];
      if (sceneSubtitle) sceneSubtitle.textContent = scene[1];
    });
  });

  // Prepare non-conversion CTA events for GTM/GA4 integration.
  // Events fire only if the client's dataLayer is already configured.
  $$("[data-track]").forEach(link => {
    link.addEventListener("click", () => {
      if (!Array.isArray(window.dataLayer)) return;
      window.dataLayer.push({
        event: "intlife_cta_click",
        cta_location: link.dataset.track,
        landing_page: "landed_properties"
      });
    });
  });

  // Never collect leads in a mockup. HubSpot is deliberately disconnected
  // until access, consent and form mapping have been approved by the client.
  const form = $("#concept-form");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const feedback = $("#form-feedback");
    $$("[aria-invalid]", form).forEach(field => field.removeAttribute("aria-invalid"));

    const invalid = $$("[required]", form).find(field => !field.checkValidity());
    if (invalid) {
      invalid.setAttribute("aria-invalid", "true");
      invalid.focus();
      if (feedback) {
        feedback.textContent = invalid.type === "email" && invalid.value.trim()
          ? "Please enter a valid work email address."
          : "Please complete the required fields.";
      }
      return;
    }
    if (feedback) {
      feedback.textContent = "This is a preview. No details were submitted. The live form will be connected to HubSpot before launch.";
    }
  });

  // Simple progressive enhancement: content stays visible without animation scripts.
  if (!reducedMotion && window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    $$("[data-reveal]").forEach(element => {
      const isInHero = !!element.closest(".hero");
      window.gsap.fromTo(
        element,
        { y: isInHero ? 16 : 19 },
        {
          y: 0,
          duration: .7,
          ease: "power2.out",
          immediateRender: false,
          clearProps: "transform",
          scrollTrigger: isInHero ? undefined : { trigger: element, start: "top 93%", once: true }
        }
      );
    });
    window.addEventListener("load", () => window.ScrollTrigger.refresh(), { once: true });
  }
})();
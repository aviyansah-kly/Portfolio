(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }

  // Keep copyright current without needing a yearly content edit.
  const footerYear = $("#footer-year");
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

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
      feedback.textContent = "Online enquiries are currently unavailable. Please email sales@intlife.com.my to discuss your development.";
    }
  });

  // Runwise-inspired editorial movement: subtle, scroll-based, no scroll hijacking.
  // All content stays visible without animation scripts or with reduced motion enabled.
  if (!reducedMotion && window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    $$("[data-reveal]").forEach(element => {
      if (element.matches(".benefit-grid, .process__steps")) return;
      const isHero = Boolean(element.closest(".hero"));
      window.gsap.fromTo(element, {
        y: element.classList.contains("section-head") ? 14 : isHero ? 20 : 28,
        autoAlpha: 0
      }, {
        y: 0,
        autoAlpha: 1,
        duration: isHero ? .78 : .88,
        ease: "power2.out",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: isHero ? undefined : {
          trigger: element,
          start: "top 91%",
          once: true
        }
      });
    });

    [
      { root: ".benefit-grid", item: ".benefit" },
      { root: ".process__steps", item: ".process__steps article" }
    ].forEach(group => {
      const root = $(group.root);
      if (!root) return;
      const items = $$(group.item, root);
      if (!items.length) return;
      window.gsap.fromTo(items, { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: .72,
        stagger: .085,
        ease: "power2.out",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: root, start: "top 89%", once: true }
      });
    });

    window.addEventListener("load", () => window.ScrollTrigger.refresh(), { once: true });
  }

})();
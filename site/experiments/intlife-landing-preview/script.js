(() => {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }

  // Mobile navigation: accessible toggling and clean dismissal.
  const toggle = $(".nav__toggle");
  const links = $(".nav__links");
  const closeMenu = () => {
    links?.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open menu");
  };
  toggle?.addEventListener("click", () => {
    const opening = !links?.classList.contains("open");
    links?.classList.toggle("open", opening);
    document.body.classList.toggle("menu-open", opening);
    toggle.setAttribute("aria-expanded", String(opening));
    toggle.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
  });
  $$(".nav__links a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  document.addEventListener("click", (event) => {
    if (links?.classList.contains("open") && !event.target.closest(".nav")) closeMenu();
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 1030) closeMenu(); });

  // Lightweight concept-only demo, not an actual product-connected interface.
  const scenes = {
    day: { title: "Good morning", subtitle: "A fresh start, already in sync.", gradient: "linear-gradient(0deg, #160920ed, transparent 83%), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=75') center/cover" },
    evening: { title: "Welcome home", subtitle: "Your evening feels just right.", gradient: "linear-gradient(0deg, #160920ed, #3c0c4c31 75%), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=75') center/cover" },
    away: { title: "All secured", subtitle: "Peace of mind, wherever you are.", gradient: "linear-gradient(0deg, #17092aef, #25133188), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=75') center/cover" }
  };
  const image = $(".control-image");
  $$(".scene-control").forEach(button => {
    button.addEventListener("click", () => {
      const scene = scenes[button.dataset.scene];
      if (!scene) return;
      $$(".scene-control").forEach(item => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      $("#scene-title").textContent = scene.title;
      $("#scene-subtitle").textContent = scene.subtitle;
      if (image) image.style.background = scene.gradient;
    });
  });

  // Prepared event names for later GA4 / Google Ads setup through the client's GTM.
  // This does not enable tracking or record conversions without their configuration.
  $("[data-track]").forEach(link => link.addEventListener("click", () => {
    if (!Array.isArray(window.dataLayer)) return;
    window.dataLayer.push({
      event: "intlife_cta_click",
      cta_location: link.dataset.track || "unknown",
      landing_page: "landed_properties"
    });
  }));

  // Preview forms must never collect/store personal details or claim a successful submission.
  // Replace with the approved HubSpot form implementation once credentials are provided.
  const form = $("#concept-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = $(".form-feedback");
    $$("[aria-invalid]", form).forEach(field => field.removeAttribute("aria-invalid"));
    const invalid = $$("input[required], select[required], textarea[required]", form)
      .find(field => !field.value.trim() || (field.type === "email" && !field.validity.valid));
    if (invalid) {
      invalid.setAttribute("aria-invalid", "true");
      invalid.focus();
      if (feedback) feedback.textContent = invalid.type === "email" && invalid.value.trim()
        ? "Please enter a valid work email address."
        : "Please complete the highlighted required field.";
      return;
    }
    if (feedback) {
      feedback.textContent = "This is a design preview. Your details were not submitted. HubSpot integration will be enabled after approval.";
    }
  });

  // Progressive enhancement: all sections remain visible if animation scripts fail.
  $$("[data-reveal]").forEach(element => element.style.opacity = "1");
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  const items = $$("[data-reveal]");
  items.forEach((item, index) => {
    const hero = item.closest(".hero");
    window.gsap.fromTo(item,
      { y: hero ? 24 : 27 },
      {
        y: 0,
        duration: hero ? 1.0 : .85,
        delay: hero ? index * .12 : 0,
        ease: "power3.out",
        clearProps: "transform",
        immediateRender: false,
        scrollTrigger: hero ? undefined : { trigger: item, start: "top 91%", once: true }
      });
  });
  if (window.innerWidth > 1050) {
    window.gsap.fromTo(".hero__architecture", { y: 0 }, {
      y: -15, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });
  }
  window.addEventListener("load", () => window.ScrollTrigger.refresh(), { once: true });
})();

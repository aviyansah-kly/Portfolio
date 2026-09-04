gsap.registerPlugin(ScrollTrigger);

let lenis;
let rafId;
let cursorBound = false;

function initLenis() {
  if (lenis) lenis.destroy();
  if (rafId) cancelAnimationFrame(rafId);

  lenis = new Lenis({
    duration: 1.08,
    smoothWheel: true,
    wheelMultiplier: 0.92
  });

  const raf = (time) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
}

function runLoader() {
  const loader = document.querySelector('.loader');
  if (!loader || sessionStorage.getItem('avi-loader-seen')) {
    if (loader) loader.remove();
    return Promise.resolve();
  }

  sessionStorage.setItem('avi-loader-seen', '1');
  const count = loader.querySelector('.loader-count span');
  const line = loader.querySelector('.loader-line i');
  const counter = { value: 0 };

  return new Promise((resolve) => {
    gsap.timeline({ onComplete: resolve })
      .to(counter, {
        value: 100,
        duration: 1.05,
        ease: 'power2.inOut',
        onUpdate: () => count && (count.textContent = Math.round(counter.value))
      })
      .to(line, { scaleX: 1, duration: 1.05, ease: 'power2.inOut' }, '<')
      .to('.loader-top,.loader-count', { y: -16, opacity: 0, duration: .3 }, '>-0.05')
      .to(loader, { yPercent: -100, duration: .82, ease: 'power4.inOut' }, '>-0.02')
      .set(loader, { display: 'none' });
  });
}

function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  if (!cursorBound) {
    cursorBound = true;
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: .16,
        ease: 'power3.out',
        overwrite: true
      });
    });
  }

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = 'true';

    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-active');
      const label = cursor.querySelector('span');
      if (label) label.textContent = el.dataset.cursor || 'View';
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active');
    });
  });
}

function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic').forEach((el) => {
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = 'true';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * .16, y: y * .16, duration: .42, ease: 'power3.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.35)' });
    });
  });
}

function initWorkPreview() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const stage = document.querySelector('.work-preview-stage');
  const rows = document.querySelectorAll('.work-row[data-preview]');
  if (!stage || !rows.length) return;

  if (stage.dataset.previewBound) return;
  stage.dataset.previewBound = 'true';

  const cards = [...stage.querySelectorAll('[data-preview-card]')];
  let activeKey = null;
  let visible = false;

  const setX = gsap.quickTo(stage, 'x', { duration: .28, ease: 'power3.out' });
  const setY = gsap.quickTo(stage, 'y', { duration: .28, ease: 'power3.out' });

  function movePreview(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    const width = rect.width || 320;
    const height = rect.height || 240;
    const gap = 28;

    let x = clientX + gap;
    let y = clientY - height * .5;

    if (x + width > window.innerWidth - 18) {
      x = clientX - width - gap;
    }

    y = Math.max(18, Math.min(y, window.innerHeight - height - 18));

    setX(x);
    setY(y);
  }

  function activate(key) {
    if (activeKey === key && visible) return;
    activeKey = key;

    cards.forEach((card) => {
      const isActive = card.dataset.previewCard === key;
      card.classList.toggle('is-active', isActive);
      if (isActive) {
        gsap.fromTo(card,
          { opacity: 0, scale: 1.035 },
          { opacity: 1, scale: 1, duration: .38, ease: 'power3.out', overwrite: true }
        );
      } else {
        gsap.to(card, { opacity: 0, duration: .16, overwrite: true });
      }
    });

    if (!visible) {
      visible = true;
      gsap.set(stage, { visibility: 'visible' });
      gsap.fromTo(stage,
        { opacity: 0, scale: .92 },
        { opacity: 1, scale: 1, duration: .34, ease: 'power3.out', overwrite: true }
      );
    }
  }

  function hide() {
    visible = false;
    activeKey = null;
    gsap.to(stage, {
      opacity: 0,
      scale: .94,
      duration: .24,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        if (!visible) gsap.set(stage, { visibility: 'hidden' });
      }
    });
  }

  rows.forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      movePreview(e.clientX, e.clientY);
      activate(row.dataset.preview);
    });

    row.addEventListener('mousemove', (e) => {
      movePreview(e.clientX, e.clientY);
      if (activeKey !== row.dataset.preview) activate(row.dataset.preview);
    });

    row.addEventListener('mouseleave', hide);
  });

  window.addEventListener('blur', hide);
  document.addEventListener('mouseleave', hide);
  window.addEventListener('resize', hide);
}

function initHomeIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.site-header', { y: -22, opacity: 0, duration: .65 })
    .from('.hero-location', { x: -50, opacity: 0, duration: .7 }, '-=.35')
    .from('.hero-role', { y: 20, opacity: 0, duration: .7 }, '-=.45')
    .from('.hero-portrait', { yPercent: 8, opacity: 0, duration: 1.05 }, '-=.5')
    .from('.hero-name', { xPercent: -7, opacity: 0, duration: 1.05 }, '-=.8')
    .from('.hero-scroll', { scale: .7, opacity: 0, duration: .5 }, '-=.4');
}

function initCaseIntro() {
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.case-hero .eyebrow', { y: 18, opacity: 0, duration: .6 })
    .from('.case-hero h1', { yPercent: 20, opacity: 0, duration: .95 }, '-=.25')
    .from('.case-meta > *', { y: 18, opacity: 0, stagger: .08, duration: .6 }, '-=.4');
}

function initScrollMotion() {
  ScrollTrigger.getAll().forEach((t) => t.kill());

  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 42,
      opacity: 0,
      duration: .95,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  document.querySelectorAll('.work-row').forEach((row, i) => {
    gsap.from(row, {
      y: 28,
      opacity: 0,
      duration: .75,
      delay: i * .03,
      ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 92%', once: true }
    });
  });

  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    gsap.to(heroName, {
      xPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.dennis-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  const portrait = document.querySelector('.hero-portrait');
  if (portrait) {
    gsap.to(portrait, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: {
        trigger: '.dennis-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
}

function initAll({ intro = false } = {}) {
  initLenis();
  initCursor();
  initMagnetic();
  initWorkPreview();
  initScrollMotion();

  if (intro) {
    const ns = document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace;
    if (ns === 'home') initHomeIntro();
    if (ns === 'case') initCaseIntro();
  }

  ScrollTrigger.refresh();
}

function transitionIn(title = 'AVI YANSAH®') {
  const layer = document.querySelector('.transition-layer');
  const titleEl = document.querySelector('.transition-title');
  const progress = document.querySelector('.transition-progress');

  if (titleEl) titleEl.textContent = title;
  if (progress) gsap.set(progress, { scaleX: 0 });

  return gsap.timeline()
    .set(layer, { pointerEvents: 'all' })
    .fromTo(layer, { yPercent: 100 }, { yPercent: 0, duration: .72, ease: 'power4.inOut' })
    .fromTo(titleEl, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .38, ease: 'power3.out' }, '-=.25')
    .to(progress, { scaleX: 1, duration: .34, ease: 'power2.inOut' }, '-=.12');
}

function transitionOut() {
  const layer = document.querySelector('.transition-layer');
  const titleEl = document.querySelector('.transition-title');
  const progress = document.querySelector('.transition-progress');

  window.scrollTo(0, 0);

  return gsap.timeline()
    .to(titleEl, { y: -22, opacity: 0, duration: .25 })
    .to(progress, { opacity: 0, duration: .18 }, '<')
    .to(layer, { yPercent: -100, duration: .72, ease: 'power4.inOut' }, '-=.04')
    .set(layer, { yPercent: 100, pointerEvents: 'none' })
    .set(progress, { opacity: 1, scaleX: 0 });
}

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'dennis-like',
    async leave(data) {
      if (lenis) lenis.stop();
      const title = data.trigger?.dataset?.projectTitle || 'AVI YANSAH®';
      await transitionIn(title);
    },
    async enter() {
      await transitionOut();
      initAll({ intro: true });
      if (lenis) lenis.start();
    }
  }]
});

(async function boot() {
  await runLoader();
  initAll({ intro: true });
})();
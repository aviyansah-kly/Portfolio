gsap.registerPlugin(ScrollTrigger);

let lenis;

function initLenis() {
  if (lenis) lenis.destroy();
  lenis = new Lenis({ duration: 1.05, smoothWheel: true });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
}

function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    gsap.to(cursor, { x, y, duration: .22, ease: 'power3.out' });
  });

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-active');
      cursor.querySelector('span').textContent = el.dataset.cursor || 'View';
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
}

function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * .18, y: dy * .18, duration: .35, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1,.45)' });
    });
  });
}

function initHomeMotion() {
  gsap.from('.hero-kicker', { y: 20, opacity: 0, duration: .65, ease: 'power3.out' });
  gsap.from('.hero-line span', { yPercent: 110, duration: 1.1, stagger: .08, ease: 'power4.out', delay: .08 });
  gsap.from('.hero-meta > *', { y: 18, opacity: 0, duration: .75, stagger: .08, ease: 'power3.out', delay: .62 });
}

function initReveals() {
  ScrollTrigger.getAll().forEach(t => t.kill());

  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 42,
      opacity: 0,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  document.querySelectorAll('.project-card').forEach((card) => {
    const media = card.querySelector('.project-media');
    if (!media) return;
    gsap.fromTo(media, { scale: 1.045 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });
}

function initAll() {
  initLenis();
  initCursor();
  initMagnetic();
  initReveals();

  const ns = document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace;
  if (ns === 'home') initHomeMotion();
}

function pageOut() {
  return gsap.timeline()
    .set('.transition-layer', { pointerEvents: 'all' })
    .fromTo('.transition-layer', { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'power4.inOut' })
    .fromTo('.transition-label', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .35 }, '-=.2');
}

function pageIn() {
  window.scrollTo(0,0);
  return gsap.timeline()
    .to('.transition-label', { y: -18, opacity: 0, duration: .25 })
    .to('.transition-layer', { yPercent: -100, duration: .72, ease: 'power4.inOut' })
    .set('.transition-layer', { yPercent: 100, pointerEvents: 'none' });
}

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'default-transition',
    async leave() {
      await pageOut();
    },
    async enter() {
      await pageIn();
    },
    after() {
      initAll();
    }
  }]
});

barba.hooks.beforeLeave(() => {
  if (lenis) lenis.stop();
});

barba.hooks.afterEnter(() => {
  if (lenis) lenis.start();
});

initAll();
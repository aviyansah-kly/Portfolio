gsap.registerPlugin(ScrollTrigger);

let lenis;
let rafId;
let cursorBound = false;
let magneticBound = false;

function initLenis() {
  if (lenis) lenis.destroy();
  if (rafId) cancelAnimationFrame(rafId);

  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    wheelMultiplier: 0.92,
    touchMultiplier: 1
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
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: resolve
    });

    tl.to(counter, {
      value: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (count) count.textContent = Math.round(counter.value);
      }
    })
    .to(line, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, '<')
    .to('.loader-top', { y: -16, opacity: 0, duration: .35 }, '>-0.05')
    .to('.loader-count', { y: -24, opacity: 0, duration: .35 }, '<')
    .to(loader, { yPercent: -100, duration: .9, ease: 'power4.inOut' }, '>-0.02')
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
        duration: .18,
        ease: 'power3.out',
        overwrite: true
      });
    });
  }

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = 'true';

    el.addEventListener('mouseenter', () => {
      const label = cursor.querySelector('span');
      if (label) label.textContent = el.dataset.cursor || 'View';
      cursor.classList.add('is-active');
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

      gsap.to(el, {
        x: x * .18,
        y: y * .18,
        duration: .45,
        ease: 'power3.out',
        overwrite: true
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: .8,
        ease: 'elastic.out(1,.35)'
      });
    });
  });
}

function initProjectHover() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    if (card.dataset.hoverBound) return;
    card.dataset.hoverBound = 'true';

    const frame = card.querySelector('.browser-frame');
    const media = card.querySelector('.project-media');
    if (!frame || !media) return;

    card.addEventListener('mousemove', (e) => {
      const rect = media.getBoundingClientRect();
      const rx = (e.clientX - rect.left) / rect.width - .5;
      const ry = (e.clientY - rect.top) / rect.height - .5;

      gsap.to(frame, {
        x: rx * 18,
        y: ry * 18,
        rotationX: -ry * 2.5,
        rotationY: rx * 3,
        transformPerspective: 900,
        duration: .6,
        ease: 'power3.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(frame, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: .9,
        ease: 'elastic.out(1,.4)'
      });
    });
  });
}

function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  gsap.to(track, {
    xPercent: -50,
    duration: 18,
    ease: 'none',
    repeat: -1
  });
}

function initHomeIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.site-header', { y: -24, opacity: 0, duration: .8 })
    .from('.hero-top > *', { y: 18, opacity: 0, stagger: .08, duration: .7 }, '-=.45')
    .from('.hero-line span', { yPercent: 115, duration: 1.15, stagger: .085 }, '-=.35')
    .from('.hero-meta > *', { y: 18, opacity: 0, stagger: .08, duration: .75 }, '-=.48');
}

function initCaseIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.case-hero .eyebrow', { y: 18, opacity: 0, duration: .6 })
    .from('.case-hero h1', { yPercent: 24, opacity: 0, duration: 1 }, '-=.25')
    .from('.case-meta > *', { y: 20, opacity: 0, stagger: .08, duration: .65 }, '-=.4');
}

function initScrollMotion() {
  ScrollTrigger.getAll().forEach((t) => t.kill());

  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 54,
      opacity: 0,
      duration: 1.05,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  document.querySelectorAll('.line-reveal').forEach((el) => {
    gsap.from(el, {
      '--line-scale': 0,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  document.querySelectorAll('.project-card').forEach((card) => {
    const media = card.querySelector('.project-media');
    const frame = card.querySelector('.browser-frame');

    if (media) {
      gsap.fromTo(media,
        { clipPath: 'inset(8% 0 8% 0 round 18px)' },
        {
          clipPath: 'inset(0% 0 0% 0 round 0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            end: 'top 55%',
            scrub: 1
          }
        }
      );
    }

    if (frame) {
      gsap.fromTo(frame,
        { scale: 1.08, y: 44 },
        {
          scale: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    }
  });

  const statement = document.querySelector('.statement h2');
  if (statement) {
    gsap.from(statement, {
      yPercent: 18,
      opacity: 0,
      duration: 1.15,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: statement,
        start: 'top 82%',
        once: true
      }
    });
  }
}

function initAll({ intro = false } = {}) {
  initLenis();
  initCursor();
  initMagnetic();
  initProjectHover();
  initMarquee();
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
    .fromTo(layer, { yPercent: 100 }, { yPercent: 0, duration: .78, ease: 'power4.inOut' })
    .fromTo(titleEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }, '-=.28')
    .to(progress, { scaleX: 1, transformOrigin: 'left center', duration: .38, ease: 'power2.inOut' }, '-=.16');
}

function transitionOut() {
  const layer = document.querySelector('.transition-layer');
  const titleEl = document.querySelector('.transition-title');
  const progress = document.querySelector('.transition-progress');

  window.scrollTo(0, 0);

  return gsap.timeline()
    .to(titleEl, { y: -24, opacity: 0, duration: .3, ease: 'power2.in' })
    .to(progress, { opacity: 0, duration: .2 }, '<')
    .to(layer, { yPercent: -100, duration: .8, ease: 'power4.inOut' }, '-=.05')
    .set(layer, { yPercent: 100, pointerEvents: 'none' })
    .set(progress, { opacity: 1, scaleX: 0 });
}

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'cinematic',
    async leave(data) {
      if (lenis) lenis.stop();
      const trigger = data.trigger;
      const title = trigger?.dataset?.projectTitle || 'AVI YANSAH®';
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
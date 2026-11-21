(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation: keyboard accessible and closed after navigation.
  const nav = document.getElementById('primary-menu');
  const menu = document.querySelector('.menu-toggle');
  function closeMenu() {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  }
  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  // Animate visible sections; never hide content when motion is reduced.
  const revealed = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -25px 0px' });
    revealed.forEach(element => observer.observe(element));
  } else {
    revealed.forEach(element => element.classList.add('in-view'));
  }

  // Hero slides: keep image and counter synchronized even with rapid clicks.
  const hero = document.getElementById('heroPhoto');
  const heroCount = document.getElementById('heroCount');
  const heroSlides = 4;
  let currentHero = 0;
  let heroTimer;
  function moveHero(step) {
    currentHero = (currentHero + step + heroSlides) % heroSlides;
    clearTimeout(heroTimer);
    if (!reducedMotion) hero.classList.add('switching');
    heroTimer = window.setTimeout(() => {
      hero.className = 'hero-photo hero-photo-' + currentHero;
      heroCount.textContent = (currentHero + 1) + '/' + heroSlides;
    }, reducedMotion ? 0 : 220);
  }
  document.getElementById('heroPrev').addEventListener('click', () => moveHero(-1));
  document.getElementById('heroNext').addEventListener('click', () => moveHero(1));

  // Native scrolling ensures touch, mouse and keyboard all work.
  const track = document.getElementById('destinationTrack');
  const prevDestination = document.getElementById('destinationPrev');
  const nextDestination = document.getElementById('destinationNext');
  function updateDestinationControls() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prevDestination.disabled = track.scrollLeft <= 2;
    nextDestination.disabled = track.scrollLeft >= maxScroll - 2;
  }
  function moveDestination(direction) {
    const card = track.querySelector('.destination-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reducedMotion ? 'instant' : 'smooth'
    });
  }
  prevDestination.addEventListener('click', () => moveDestination(-1));
  nextDestination.addEventListener('click', () => moveDestination(1));
  track.addEventListener('scroll', updateDestinationControls, { passive: true });
  window.addEventListener('resize', updateDestinationControls);
  updateDestinationControls();

  // Make intentionally non-functional booking CTAs transparent to viewers.
  const toast = document.getElementById('toast');
  let toastTimer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
  }
  document.querySelectorAll('.destination-action').forEach(button => {
    button.addEventListener('click', () => notify('Portfolio demonstration only — no booking will be created.'));
  });

  // Testimonial switcher.
  const quote = document.getElementById('reviewQuote');
  const quotes = [
    quote.textContent,
    '“Every journey feels more memorable when you share it with people who love to explore.”',
    '“The destination was wonderful, and the experience was easy to enjoy from the first day.”'
  ];
  const avatars = [...document.querySelectorAll('.avatar')];
  avatars.forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => {
      const selected = Number(button.dataset.review);
      if (!Number.isInteger(selected) || !quotes[selected]) return;
      quote.textContent = quotes[selected];
      avatars.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });
})();

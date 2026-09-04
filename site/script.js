gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ duration: 1.15, smoothWheel: true });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.from('.hero-kicker', { y: 20, opacity: 0, duration: .7, ease: 'power3.out' });
gsap.from('.hero-line span', { yPercent: 110, duration: 1.05, stagger: .08, ease: 'power4.out', delay: .1 });
gsap.from('.hero-meta > *', { y: 18, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', delay: .6 });

document.querySelectorAll('.reveal').forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: .9,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 86%' }
  });
});

document.querySelectorAll('.project-card').forEach((card) => {
  const media = card.querySelector('.project-media');
  gsap.fromTo(media, { scale: 1.05 }, {
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
});

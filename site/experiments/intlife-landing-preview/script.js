(() => {
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(window.lucide?.createIcons) window.lucide.createIcons({attrs:{'stroke-width':1.8}});
  $('#concept-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    const msg=$('.form-feedback');
    if(msg)msg.textContent='This is a design concept. HubSpot will be connected after project approval.';
  });

  // Safest rendering: preserve real text nodes instead of splitting or clipping glyphs.
  // Native scrolling avoids the transformed-scroll container conflicting with sticky header.
  document.documentElement.classList.remove('has-scroll-smooth');
  $$('.reveal').forEach(el=>el.classList.add('show'));
  if(reduceMotion || !window.gsap || !window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({scroller:window});
  const titles=$$('.hero h1,.intro-main h2,.platform-title h2,.journey-copy h2,.cta-copy h2');
  titles.forEach((title,i)=>{
    gsap.fromTo(title,{y:i===0?22:30},{y:0,duration:i===0?1.15:.9,ease:'power3.out',
      clearProps:'transform',immediateRender:false,
      scrollTrigger:i===0?undefined:{trigger:title,start:'top 90%',once:true}});
  });
  $$('.image-card,.feature,.journey-step,.cta-panel').forEach(el=>{
    gsap.fromTo(el,{y:28},{y:0,duration:.75,ease:'power2.out',clearProps:'transform',
      immediateRender:false,scrollTrigger:{trigger:el,start:'top 93%',once:true}});
  });
  // Keep parallax subtle and never animate opacity or transform of content wrappers.
  if(window.innerWidth>=900){
    gsap.fromTo('.hero-photo',{yPercent:0},{yPercent:7,ease:'none',
      scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  }
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
})();

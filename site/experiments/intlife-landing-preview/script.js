(() => {
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const container = $('[data-scroll-container]');
  if (window.lucide?.createIcons) lucide.createIcons({attrs:{'stroke-width':1.8}});
  const form = $('#concept-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    $('.form-feedback').textContent = 'This is a design concept. The live form will be connected to HubSpot after project approval.';
  });
  if (!window.gsap || reduced) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('has-motion');
  let loco = null;
  let scroller = window;
  if (!mobile && window.LocomotiveScroll && container) {
    try {
      loco = new LocomotiveScroll({el:container,smooth:true,lerp:0.085,multiplier:0.9,getDirection:true,tablet:{smooth:false},smartphone:{smooth:false}});
      scroller = container;
      loco.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(container,{
        scrollTop(value){return arguments.length ? loco.scrollTo(value,{duration:0,disableLerp:true}) : loco.scroll.instance.scroll.y;},
        getBoundingClientRect(){return {top:0,left:0,width:window.innerWidth,height:window.innerHeight};},
        pinType:container.style.transform ? 'transform' : 'fixed'
      });
      ScrollTrigger.defaults({scroller:container});
      ScrollTrigger.addEventListener('refresh',()=>loco?.update());
    } catch(error) { loco?.destroy(); loco=null; scroller=window; }
  }
  // Word-level motion preserving inline emphasis spans.
  const titles = $$('.hero h1,.intro-main h2,.platform-title h2,.journey-copy h2,.cta-copy h2');
  function splitWords(root) {
    const walk = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walk.nextNode())nodes.push(walk.currentNode);
    nodes.forEach(node=>{
      const fragment=document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part=>{
        if(!part)return;
        if(/^\s+$/.test(part)){fragment.appendChild(document.createTextNode(part));return;}
        const outer=document.createElement('span');outer.className='motion-clip';
        const inner=document.createElement('span');inner.className='motion-word-inner';
        inner.textContent=part;outer.appendChild(inner);fragment.appendChild(outer);
      });
      node.parentNode.replaceChild(fragment,node);
    });
    return $$('.motion-word-inner',root);
  }
  titles.forEach((title,index)=>{
    const words=splitWords(title);
    gsap.from(words,{
      yPercent:110,opacity:0,duration:index===0?1.05:.9,stagger:.035,ease:'power3.out',
      delay:index===0?.2:0,
      scrollTrigger:index===0?undefined:{trigger:title,start:'top 88%',once:true}
    });
  });
  $$('.section-top,.intro-aside,.image-card,.feature,.journey-step,.cta-panel,.cta-copy>p,.platform-title>p,.strip-inner').forEach(el=>{
    gsap.from(el,{y:50,opacity:0,duration:.9,ease:'power3.out',clearProps:'transform,opacity',
      scrollTrigger:{trigger:el,start:'top 88%',once:true}});
  });
  $$('.section').forEach(section=>{
    gsap.fromTo(section.querySelector('.overline,.eyebrow,.section-top')||section,
      {opacity:.35},{opacity:1,duration:.8,ease:'power2.out',
      scrollTrigger:{trigger:section,start:'top 80%',once:true}});
  });
  if(!mobile) {
    gsap.to('.hero-photo',{yPercent:14,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.fromTo('.hero-product',{y:65,opacity:0},{y:0,opacity:1,duration:1.2,ease:'power3.out',delay:.25});
    gsap.to('.hero-product .phone',{y:-35,rotation:2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  }
  $$('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    const hash=link.getAttribute('href');if(hash==='#')return;
    const target=$(hash);if(!target)return;
    event.preventDefault();
    if(loco)loco.scrollTo(target,{offset:-75,duration:850});
    else target.scrollIntoView({behavior:'smooth'});
  }));
  window.addEventListener('load',()=>{loco?.update();ScrollTrigger.refresh();});
  ScrollTrigger.refresh();
})();
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const projects = [
  ['01','Pins+','Product Strategy · UI/UX · 2026','lime'],
  ['02','Liputan6 Quran','Product Design · UX · 2026','sand'],
  ['03','Panorama Advisory','Web Design · Development · 2026','blue'],
  ['04','Tailored Closet','Website Design · 2026','rose']
];

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let id = 0;
    const raf = (t:number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.from('.hero-line span',{yPercent:110,duration:1.05,stagger:.08,ease:'power4.out'});
      gsap.from('.hero-meta > *',{y:18,opacity:0,duration:.8,stagger:.08,delay:.55,ease:'power3.out'});
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.from(el,{
        y:42, opacity:0, duration:.9, ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 86%'}
      }));
    });

    return () => { cancelAnimationFrame(id); lenis.destroy(); ctx.revert(); };
  },[]);

  return <>
    <header>
      <a className="brand" href="#">AVI YANSAH®</a>
      <nav><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
    </header>

    <main>
      <section className="hero">
        <p className="kicker">Independent designer & web creator</p>
        <h1>
          <span className="hero-line"><span>PRODUCT</span></span>
          <span className="hero-line"><span>DESIGNER &</span></span>
          <span className="hero-line"><span>WEB CREATOR</span></span>
        </h1>
        <div className="hero-meta">
          <p>Based in Indonesia<br/>Working worldwide</p>
          <p>Designing digital products<br/>and websites that perform.</p>
          <a className="circle" href="#work">↓</a>
        </div>
      </section>

      <section id="work" className="work">
        <div className="section-head reveal"><span>Selected work</span><span>2024—2026</span></div>
        {projects.map(([no,title,meta,tone]) => (
          <article className="project reveal" key={title}>
            <div className={'project-media '+tone}>
              <div className="frame">
                <div className="framebar"><i/><i/><i/></div>
                <div className="mock"><span>{no}</span><strong>{title}</strong><div><b/><b/><b/></div></div>
              </div>
            </div>
            <div className="project-info"><h2>{title}</h2><p>{meta}</p></div>
          </article>
        ))}
      </section>

      <section id="about" className="statement">
        <p className="kicker reveal">A little about me</p>
        <h2 className="reveal">I DON'T JUST MAKE IT LOOK GOOD. I DESIGN HOW IT WORKS.</h2>
        <div className="statement-grid reveal">
          <p>Product designer by profession, independent creator by choice. I help brands turn ideas into clear, useful and memorable digital experiences.</p>
          <div className="stats">
            <div><strong>10+</strong><span>Years experience</span></div>
            <div><strong>360°</strong><span>Design to build</span></div>
            <div><strong>Remote</strong><span>Worldwide projects</span></div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="section-head reveal"><span>What I do</span><span>Capabilities</span></div>
        {['Product Strategy','UI / UX Design','Website Design','Interactive Prototype','WordPress Development'].map((s,i)=>(
          <div className="service-row reveal" key={s}><span>0{i+1}</span><h3>{s}</h3><span>↗</span></div>
        ))}
      </section>

      <section className="quote reveal">
        <p className="kicker">Client feedback</p>
        <blockquote>“YOU'VE DONE IN MINUTES WHAT WOULD TAKE ME 4–6 HOURS TO BUILD.”</blockquote>
        <p>— Freelance client, 2026</p>
      </section>

      <section id="contact" className="contact">
        <p className="kicker reveal">Available for selected projects</p>
        <h2 className="reveal">HAVE SOMETHING<br/>INTERESTING IN MIND?</h2>
        <a className="contact-link reveal" href="mailto:hello@example.com">LET'S WORK TOGETHER ↗</a>
      </section>
    </main>

    <footer><span>© 2026 Avi Yansah</span><span>Indonesia · Worldwide</span></footer>
  </>;
}

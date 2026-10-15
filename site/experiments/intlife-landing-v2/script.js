(() => {
  "use strict";
  // Keep all content visible even when scroll observers, external scripts or animations fail.
  const $ = (q,root=document)=>root.querySelector(q);
  const $$ = (q,root=document)=>Array.from(root.querySelectorAll(q));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const header=$("#site-header");
  const mobileButton=$(".menu-toggle");
  const mobileNav=$("#mobile-nav");
  let pending=false;

  function updateHeader(){
    pending=false;
    if(header) header.classList.toggle("is-scrolled",scrollY>52);
  }
  updateHeader();
  addEventListener("scroll",()=>{
    if(!pending){pending=true;requestAnimationFrame(updateHeader);}
  },{passive:true});

  function setMenu(open){
    if(!mobileButton||!mobileNav)return;
    mobileButton.setAttribute("aria-expanded",String(open));
    mobileNav.hidden=!open;
    mobileButton.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  }
  mobileButton?.addEventListener("click",()=>setMenu(mobileButton.getAttribute("aria-expanded")!=="true"));
  $$("#mobile-nav a").forEach(link=>link.addEventListener("click",()=>setMenu(false)));
  addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});
  addEventListener("resize",()=>{if(innerWidth>980)setMenu(false)},{passive:true});

  const hero=$(".hero-visual");
  const sceneButtons=$$(".scene-tab");
  const scenes={
    morning:{kick:"A BRIGHTER START",title:"A good day starts at home.",body:"Ease into the morning, your way.",status:"Morning routine"},
    home:{kick:"WELCOME HOME",title:"Everything feels just right.",body:"Lights and comfort, ready for you.",status:"Lighting scene ready"},
    away:{kick:"PEACE OF MIND",title:"A home that stays connected.",body:"Leave knowing supported security is close at hand.",status:"Security scene preview"}
  };
  function setScene(key){
    if(!hero||!scenes[key])return;
    hero.dataset.mode=key;
    $("#scene-kicker").textContent=scenes[key].kick;
    $("#scene-name").textContent=scenes[key].title;
    $("#scene-description").textContent=scenes[key].body;
    const sceneStatus=$("#hero-scene-status-text");
    if(sceneStatus)sceneStatus.textContent=scenes[key].status;
    sceneButtons.forEach(btn=>{
      const active=btn.dataset.scene===key;
      btn.classList.toggle("is-active",active);
      btn.setAttribute("aria-pressed",String(active));
    });
  }
  sceneButtons.forEach(btn=>btn.addEventListener("click",()=>setScene(btn.dataset.scene)));
  setScene("home");

  // Intlife-backed capabilities are demonstrated as interaction concepts.
  // They are NOT a reproduction of the client's inaccessible Figma screens.
  const appVisual=$(".app-visual");
  const appModeButtons=$$(".app-demo__tabs button");
  const appModePanels=$$(".app-demo__panel");
  const appScenes={
    home:{label:"Welcome home",subtitle:"Lighting and comfort, together.",lights:true,locked:true},
    away:{label:"Away mode",subtitle:"Security stays close at hand.",lights:false,locked:true},
    sleep:{label:"Good night",subtitle:"Wind down with a calmer home.",lights:false,locked:true}
  };
  const appState={mode:"scenes",scene:"home",lights:true,locked:true,temp:24};

  function reflectAppDemo(){
    if(!appVisual)return;
    appVisual.dataset.appMode=appState.mode;
    appVisual.dataset.demoScene=appState.scene;
    appVisual.dataset.demoLight=appState.lights?"on":"off";
    appVisual.dataset.demoLock=appState.locked?"locked":"unlocked";
    const currentScene=appScenes[appState.scene];
    const sceneTitle=$("#app-scene-label");
    const sceneSubtitle=$("#app-scene-subtitle");
    if(sceneTitle)sceneTitle.textContent=currentScene.label;
    if(sceneSubtitle)sceneSubtitle.textContent=currentScene.subtitle;
    const lockStatus=$("#app-lock-status");
    const lockButton=$('[data-demo-toggle="lock"]');
    if(lockStatus)lockStatus.textContent=appState.locked?"Locked":"Unlocked";
    if(lockButton){
      lockButton.setAttribute("aria-pressed",String(appState.locked));
      $("#app-lock-action").textContent=appState.locked?"Unlock demo door":"Lock demo door";
    }
    const lightStatus=$("#app-light-status");
    const lightButton=$('[data-demo-toggle="light"]');
    if(lightStatus)lightStatus.textContent=appState.lights?"On":"Off";
    if(lightButton){
      lightButton.classList.toggle("is-active",appState.lights);
      lightButton.setAttribute("aria-pressed",String(appState.lights));
      lightButton.setAttribute("aria-label",appState.lights?"Turn living room lights off":"Turn living room lights on");
    }
    const temp=$("#app-temp-value");
    if(temp)temp.textContent=String(appState.temp);
    $$("[data-demo-scene]").forEach(button=>{
      if(button.tagName!=="BUTTON")return;
      const active=button.dataset.demoScene===appState.scene;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",String(active));
    });
  }
  function setAppMode(mode){
    if(!appVisual||!["scenes","access","devices"].includes(mode))return;
    appState.mode=mode;
    appModeButtons.forEach(button=>{
      const selected=button.dataset.appMode===mode;
      button.classList.toggle("is-active",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
    appModePanels.forEach(panel=>{panel.hidden=panel.dataset.demoPanel!==mode;});
    reflectAppDemo();
  }
  appModeButtons.forEach(button=>button.addEventListener("click",()=>setAppMode(button.dataset.appMode)));
  $$("button[data-demo-scene]").forEach(button=>button.addEventListener("click",()=>{
    appState.scene=button.dataset.demoScene;
    const scene=appScenes[appState.scene];
    if(scene){appState.lights=scene.lights;appState.locked=scene.locked;}
    reflectAppDemo();
  }));
  $$("button[data-demo-toggle]").forEach(button=>button.addEventListener("click",()=>{
    if(button.dataset.demoToggle==="light")appState.lights=!appState.lights;
    if(button.dataset.demoToggle==="lock")appState.locked=!appState.locked;
    reflectAppDemo();
  }));
  $$("button[data-demo-temp]").forEach(button=>button.addEventListener("click",()=>{
    appState.temp=Math.max(18,Math.min(28,appState.temp+Number(button.dataset.demoTemp)));
    reflectAppDemo();
  }));
  setAppMode("scenes");

  // If a third-party logo is unavailable, retain a visible partner name.
  $$(".partner-artwork__item img").forEach(img=>{
    img.addEventListener("error",()=>img.closest(".partner-artwork__item")?.classList.add("is-fallback"));
    if(img.complete && img.naturalWidth===0)img.closest(".partner-artwork__item")?.classList.add("is-fallback");
  });

  const visual=$(".story-stage");
  const stageButtons=$$(".story-step");
  const progress=$$(".stage-progress span");
  const stories={
    welcome:{number:"01 / 04",title:"Comfort, ready when you are.",body:"A home that responds to your routine.",feature:"Welcome home scene"},
    secure:{number:"02 / 04",title:"Stay connected to what matters.",body:"Supported access and security within reach.",feature:"Connected security"},
    energy:{number:"03 / 04",title:"Connected to a more energy-aware future.",body:"Solar readiness and storage can complement the home.",feature:"Energy-ready home"},
    control:{number:"04 / 04",title:"Bring it all together.",body:"Supported home devices, scenes and routines in one app.",feature:"intlife Smart Living App"}
  };
  function activateStory(key){
    if(!visual||!stories[key]||visual.dataset.active===key)return;
    const info=stories[key];
    visual.dataset.active=key;
    $("#story-number").textContent=info.number;
    $("#story-stage-title").textContent=info.title;
    $("#story-stage-copy").textContent=info.body;
    $("#story-visual-label").textContent=info.feature;
    stageButtons.forEach((btn,i)=>{
      const active=btn.dataset.story===key;
      btn.classList.toggle("is-current",active);
      btn.setAttribute("aria-pressed",String(active));
      progress[i]?.classList.toggle("active",active);
    });
  }
  stageButtons.forEach(btn=>btn.addEventListener("click",()=>{
    activateStory(btn.dataset.story);
    if(innerWidth<=980){
      visual?.scrollIntoView({behavior:reduce.matches?"auto":"smooth",block:"center"});
    }
  }));
  let storyScheduled=false;
  function updateStoryFromScroll(){
    storyScheduled=false;
    if(!visual||reduce.matches||innerWidth<=980)return;
    const host=$("#how-it-works").getBoundingClientRect();
    if(host.top>innerHeight*.8||host.bottom<innerHeight*.17)return;
    const target=innerHeight*.49;
    let best=null,dist=Infinity;
    stageButtons.forEach(btn=>{
      const b=btn.getBoundingClientRect();
      const difference=Math.abs(b.top+b.height/2-target);
      if(difference<dist){dist=difference;best=btn;}
    });
    if(best)activateStory(best.dataset.story);
  }
  addEventListener("scroll",()=>{
    if(storyScheduled)return;
    storyScheduled=true;requestAnimationFrame(updateStoryFromScroll);
  },{passive:true});
  addEventListener("resize",updateStoryFromScroll,{passive:true});
  updateStoryFromScroll();

  // Short, intentional entry transitions; content remains legible with JS off.
  // Reveal animation must never gate content visibility.
  $(".reveal").forEach(el=>el.classList.add("is-visible"));

  // Preview form: native validity checks; no collection or storage of personal information.
  $("#lead-form")?.addEventListener("submit",e=>{
    e.preventDefault();
    const form=e.currentTarget;
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    const feedback=$(".form-feedback");
    if(feedback){feedback.hidden=false;feedback.scrollIntoView({behavior:reduce.matches?"auto":"smooth",block:"nearest"});}
  });
  const year=$("#copyright-year");if(year)year.textContent=String(new Date().getFullYear());
  // Icons are embedded as inline SVGs; no CDN scripts required.
})();
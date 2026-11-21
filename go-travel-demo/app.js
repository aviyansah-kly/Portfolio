(()=>{
const nav=document.getElementById('primary-menu'), menu=document.querySelector('.menu-toggle');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{threshold:.09,rootMargin:'0px 0px -25px 0px'});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));}
else document.querySelectorAll('.reveal').forEach(x=>x.classList.add('in-view'));
let currentHero=0;const hero=document.getElementById('heroPhoto'),heroCount=document.getElementById('heroCount');
function moveHero(n){currentHero=(currentHero+n+4)%4;hero.classList.add('switching');setTimeout(()=>{hero.className='hero-photo hero-photo-'+currentHero;heroCount.textContent=(currentHero+1)+'/4';},reduced?0:240)}
document.getElementById('heroPrev').addEventListener('click',()=>moveHero(-1));document.getElementById('heroNext').addEventListener('click',()=>moveHero(1));
const track=document.getElementById('destinationTrack');function moveDest(n){const card=track.querySelector('.destination-card');if(card)track.scrollBy({left:n*(card.getBoundingClientRect().width+35),behavior:reduced?'instant':'smooth'})}
document.getElementById('destinationPrev').addEventListener('click',()=>moveDest(-1));document.getElementById('destinationNext').addEventListener('click',()=>moveDest(1));
const toast=document.getElementById('toast');let toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3600)}
document.querySelectorAll('.destination-action').forEach(b=>b.addEventListener('click',()=>notify('This is a portfolio demo. No booking will be created.')));
const original=document.getElementById('reviewQuote').textContent; const quotes=[original,'“Every journey feels more memorable when you share it with people who love to explore.”','“The destination was wonderful, and the experience was easy to enjoy from the first day.”'];
document.querySelectorAll('.avatar').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.review);document.getElementById('reviewQuote').textContent=quotes[n];document.querySelectorAll('.avatar').forEach(b=>b.classList.toggle('active',b===btn))}));
})();
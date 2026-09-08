(() => {
 const root=document.documentElement, motion=matchMedia('(prefers-reduced-motion: reduce)');
 root.classList.add('js');
 let visited=false;try{visited=sessionStorage.getItem('orca-visited');sessionStorage.setItem('orca-visited','1')}catch{}
 if(!visited&&!motion.matches){root.classList.add('loading');setTimeout(()=>root.classList.remove('loading'),900)}
 const nav=document.querySelector('.glass-nav'),toggle=document.querySelector('.menu-toggle'),mobile=document.querySelector('#mobile-nav');
 const closeMenu=()=>{mobile.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation')};
 toggle.addEventListener('click',()=>{const open=mobile.hidden;mobile.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
 mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobile.hidden){closeMenu();toggle.focus()}});
 document.addEventListener('click',e=>{if(!nav.contains(e.target))closeMenu()});
 nav.addEventListener('pointermove',e=>{if(!motion.matches){const r=nav.getBoundingClientRect();nav.style.setProperty('--pointer',`${(e.clientX-r.left)/r.width*100}%`)}});
 const reveals=[...document.querySelectorAll('.reveal')];
 if('IntersectionObserver' in window&&!motion.matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});reveals.forEach(el=>observer.observe(el))}else reveals.forEach(el=>el.classList.add('visible'));
 const hero=document.querySelector('.hero'),signal=document.querySelector('.signal-scene');let queued=false;
 const update=()=>{queued=false;nav.classList.toggle('scrolled',scrollY>40);if(motion.matches)return;hero.style.setProperty('--hero-scroll',Math.min(1,scrollY/innerHeight));const r=signal.getBoundingClientRect();signal.style.setProperty('--loss',Math.max(0,Math.min(1,(innerHeight*.65-r.top)/(innerHeight*.8))))};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',()=>{update();if(innerWidth>600)closeMenu()},{passive:true});update();
 const tabs=[...document.querySelectorAll('[data-stage]')],panel=document.querySelector('#decision-panel');
 const copy=['Extract visual features and object cues from onboard sensing. Build a useful picture of the immediate environment.','Track features across successive frames to estimate movement and heading. Establish a local reference without relying on GPS.','The next step: combine local state and perception to inform onboard responses. Adaptive and mission-level decisions are part of our roadmap.'];
 const select=i=>{tabs.forEach((tab,n)=>{tab.setAttribute('aria-selected',String(n===i));tab.tabIndex=n===i?0:-1});panel.setAttribute('aria-labelledby',tabs[i].id);panel.querySelector('p').textContent=copy[i]};
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%3;else if(e.key==='ArrowLeft')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;else return;e.preventDefault();select(n);tabs[n].focus()})});
 motion.addEventListener('change',()=>{if(motion.matches){root.classList.remove('loading');reveals.forEach(el=>el.classList.add('visible'));signal.style.setProperty('--loss',1)}});
})();

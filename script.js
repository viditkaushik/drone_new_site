(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('#header');
  const progress = document.querySelector('.progress span');
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('#mobile-nav');

  const updateScroll = () => {
    header.classList.toggle('scrolled', scrollY > 30);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.height = `${max ? (scrollY / max) * 100 : 0}%`;
  };
  updateScroll();
  addEventListener('scroll', updateScroll, { passive: true });

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    mobileNav.hidden = open;
    menuButton.querySelector('span').textContent = open ? 'Menu' : 'Close';
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('span').textContent = 'Menu';
    mobileNav.hidden = true;
  }));

  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .14 });
    reveals.forEach(el => observer.observe(el));
  }

  const chapters = document.querySelectorAll('.chapter');
  if (reduced || !('IntersectionObserver' in window)) chapters.forEach(chapter => chapter.classList.add('in-view'));
  else {
    const chapterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); chapterObserver.unobserve(entry.target); }
    }), { threshold: .28 });
    chapters.forEach(chapter => chapterObserver.observe(chapter));
  }

  const setupCanvas = canvas => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    return { ctx, w: rect.width, h: rect.height };
  };
  const perception = document.querySelector('#perception-canvas');
  const flow = document.querySelector('#flow-canvas');
  let phase = 0;
  const seeded = seed => () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
  const drawPerception = () => {
    if (!perception) return;
    const { ctx, w, h } = setupCanvas(perception); const rand = seeded(41);
    ctx.clearRect(0, 0, w, h); ctx.strokeStyle = 'rgba(255,74,28,.38)'; ctx.fillStyle = 'rgba(255,74,28,.7)'; ctx.lineWidth = 1;
    for (let i = 0; i < 34; i++) {
      const x = w * (.48 + rand() * .49), y = h * (.3 + rand() * .55), len = 3 + rand() * 18;
      ctx.beginPath(); ctx.arc(x, y, rand() > .82 ? 2 : 1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len, y + len * .25); ctx.stroke();
    }
  };
  const drawFlow = () => {
    if (!flow) return;
    const { ctx, w, h } = setupCanvas(flow); const rand = seeded(17);
    ctx.clearRect(0, 0, w, h); ctx.strokeStyle = 'rgba(255,74,28,.38)'; ctx.fillStyle = 'rgba(242,241,236,.65)';
    for (let i = 0; i < 80; i++) {
      const x = w * (.35 + rand() * .62), y = rand() * h, len = 8 + rand() * 25;
      ctx.fillRect(x, y, 1.5, 1.5); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(phase + i) * len, y + Math.sin(phase + i) * len); ctx.stroke();
    }
  };
  drawPerception(); drawFlow();
  addEventListener('resize', () => { drawPerception(); drawFlow(); }, { passive: true });
  if (!reduced) setInterval(() => { phase += .05; drawFlow(); }, 900);

  const stages = [
    { label:'STAGE 01 / ACQUIRE', title:'Sensor Input', description:'Capture synchronized onboard observations at the edge.' },
    { label:'STAGE 02 / INTERPRET', title:'Onboard Perception', description:'Extract motion, features, objects, and terrain cues using compute carried inside the vehicle.' },
    { label:'STAGE 03 / ESTIMATE', title:'Local State', description:'Maintain a bounded estimate of motion, surroundings, and uncertainty without depending on a global map.' },
    { label:'STAGE 04 / RESPOND', title:'Flight Decision', description:'Translate local state into a constrained navigation response that the flight controller can execute.' }
  ];
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const shell = document.querySelector('.architecture-shell');
  const selectStage = index => {
    const stage = stages[index]; shell.dataset.active = index;
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    document.querySelector('#stage-title').textContent = stage.title;
    document.querySelector('#stage-description').textContent = stage.description;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectStage(index));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault(); let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0; if (event.key === 'End') next = tabs.length - 1;
      selectStage(next); tabs[next].focus();
    });
  });
  selectStage(0);

  const roadmap = document.querySelector('.roadmap-list');
  const roadmapMarker = document.querySelector('.roadmap-marker');
  const roadmapLabel = document.querySelector('.roadmap-label');
  const roadmapStatus = document.querySelector('#roadmap-status');
  const roadmapItems = [...document.querySelectorAll('.roadmap-list li')];
  const roadmapNames = ['GPS-denied navigation', 'AI-assisted navigation', 'Adaptive multisensor autonomy', 'Mission-level decision-making'];
  let activeRoadmap = 0;
  const textBlockCenter = item => {
    const heading = item.querySelector('h3');
    const copy = item.querySelector('p');
    const headingRect = heading.getBoundingClientRect();
    const copyRect = copy.getBoundingClientRect();
    return (Math.min(headingRect.top, copyRect.top) + Math.max(headingRect.bottom, copyRect.bottom)) / 2;
  };
  const updateRoadmap = () => {
    if (!roadmap || !roadmapMarker) return;
    const center = innerHeight * .46;
    let closest = 0;
    roadmapItems.forEach((item, index) => {
      if (Math.abs(textBlockCenter(item) - center) < Math.abs(textBlockCenter(roadmapItems[closest]) - center)) closest = index;
    });
    if (closest !== activeRoadmap) {
      activeRoadmap = closest;
      roadmapItems.forEach((item, index) => item.classList.toggle('current', index === activeRoadmap));
      if (roadmapStatus) roadmapStatus.textContent = `Current roadmap stage: ${roadmapNames[activeRoadmap]}`;
      if (roadmapLabel) roadmapLabel.textContent = activeRoadmap === 0 ? 'CURRENT' : `PHASE ${activeRoadmap + 1}`;
    }
    roadmapMarker.style.transform = `translateY(${textBlockCenter(roadmapItems[activeRoadmap]) - roadmap.getBoundingClientRect().top}px)`;
  };
  updateRoadmap();
  addEventListener('scroll', updateRoadmap, { passive: true });
  addEventListener('resize', updateRoadmap, { passive: true });

  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = new FormData(contactForm).get('email');
    if (formStatus) formStatus.textContent = `Thanks — we’ll reach out at ${email}.`;
    contactForm.reset();
  });
})();

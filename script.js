/* THALASSA — interactions */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // fallback in case load event already fired / is slow
  setTimeout(() => loader.classList.add('hidden'), 2200);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time)=>{ lenis.raf(time*1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- Scroll progress "wake" bar + nav state + cursor glow ---------- */
  const wake = document.getElementById('wake-progress');
  const nav = document.getElementById('nav');
  const cursorGlow = document.getElementById('cursor-glow');

  function onScroll(){
    const h = document.documentElement;
    const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    wake.style.width = pct + '%';
    nav.classList.toggle('scrolled', (h.scrollTop || document.body.scrollTop) > 40);
  }
  document.addEventListener('scroll', onScroll);
  onScroll();

  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  /* ---------- GSAP scroll reveals ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        delay: (i % 3) * 0.08
      });
    });

  } else {
    document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------- Real scroll parallax engine ----------
     Every element with a data-speed attribute drifts vertically at its own
     rate relative to normal scroll, giving genuine depth (background blobs
     move slowest, hero video/canvas mid, foreground images fastest). */
  const parallaxEls = [...document.querySelectorAll('[data-speed]')].map(el => ({
    el, speed: parseFloat(el.dataset.speed) || 0.1
  }));

  let ticking = false;
  function updateParallax(){
    const vh = window.innerHeight;
    const sy = window.scrollY || window.pageYOffset;
    parallaxEls.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + sy + rect.height / 2;
      const dist = (sy + vh / 2) - elCenter; // how far viewport center is from element center
      const offset = dist * speed * 0.12;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  }
  function onParallaxScroll(){
    if (!ticking){ requestAnimationFrame(updateParallax); ticking = true; }
  }
  document.addEventListener('scroll', onParallaxScroll, { passive: true });
  window.addEventListener('resize', onParallaxScroll);
  updateParallax();

  /* ---------- Mouse parallax on hero content ---------- */
  const heroContent = document.querySelector('.hero-content');
  document.getElementById('hero')?.addEventListener('mousemove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5) * 14;
    const y = (e.clientY / h - 0.5) * 10;
    if (heroContent) heroContent.style.transform = `translate(${x}px, ${y}px)`;
  });

  /* ---------- Animated ocean canvas ---------- */
  const canvas = document.getElementById('ocean-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const PCOUNT = window.innerWidth < 700 ? 40 : 90;

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PCOUNT; i++){
      particles.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.8 + 0.4,
        s: Math.random() * 0.00025 + 0.00006,
        drift: Math.random() * 0.0003 - 0.00015,
        o: Math.random() * 0.5 + 0.15
      });
    }

    let t = 0;
    function drawWave(yBase, amp, freq, color, lineWidth, phase){
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8){
        const y = yBase + Math.sin(x * freq + t + phase) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    function render(){
      t += 0.006;
      ctx.clearRect(0, 0, w, h);

      // deep gradient backdrop
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#0b1d2c');
      g.addColorStop(0.55, '#0f2a3a');
      g.addColorStop(1, '#060c14');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // soft brass horizon glow
      const glow = ctx.createRadialGradient(w*0.5, h*0.34, 0, w*0.5, h*0.34, w*0.5);
      glow.addColorStop(0, 'rgba(201,162,75,0.10)');
      glow.addColorStop(1, 'rgba(201,162,75,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // layered wave lines (wake-like)
      drawWave(h*0.62, 14*devicePixelRatio, 0.004, 'rgba(244,247,248,0.06)', 1.4, 0);
      drawWave(h*0.70, 20*devicePixelRatio, 0.003, 'rgba(201,162,75,0.14)', 1.2, 1.4);
      drawWave(h*0.80, 26*devicePixelRatio, 0.0022, 'rgba(244,247,248,0.045)', 1, 2.7);
      drawWave(h*0.90, 30*devicePixelRatio, 0.0018, 'rgba(201,162,75,0.08)', 1, 4.1);

      // drifting light particles
      ctx.save();
      particles.forEach(p => {
        p.y -= p.s;
        p.x += p.drift;
        if (p.y < -0.02) p.y = 1.02;
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        ctx.beginPath();
        ctx.arc(p.x*w, p.y*h, p.r*devicePixelRatio, 0, Math.PI*2);
        ctx.fillStyle = `rgba(244,247,248,${p.o})`;
        ctx.fill();
      });
      ctx.restore();

      requestAnimationFrame(render);
    }
    render();
  }

  /* ---------- Fleet filter tabs ---------- */
  const tabs = document.querySelectorAll('.fleet-tab');
  const cards = document.querySelectorAll('.boat-card');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      cards.forEach(c => {
        const show = cat === 'all' || c.dataset.cat === cat;
        c.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Boat modal ---------- */
  const modal = document.getElementById('boat-modal');
  const modalImg = modal?.querySelector('.modal-img');
  const modalTag = modal?.querySelector('.bc-tag');
  const modalTitle = modal?.querySelector('h3');
  const modalDesc = modal?.querySelector('.modal-desc');
  const modalSpecs = modal?.querySelector('.modal-specs');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const d = card.dataset;
      modalImg.style.backgroundImage = `url(${d.img})`;
      modalTag.textContent = d.cat;
      modalTitle.textContent = d.name;
      modalDesc.textContent = d.desc;
      modalSpecs.innerHTML = `
        <div><div class="k">Length</div><div class="v">${d.length}</div></div>
        <div><div class="k">Top Speed</div><div class="v">${d.speed}</div></div>
        <div><div class="k">Guests</div><div class="v">${d.guests}</div></div>
        <div><div class="k">Starting At</div><div class="v">${d.price}</div></div>
      `;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') { modal?.classList.remove('open'); document.body.style.overflow = ''; }
  });

  /* ---------- Configurator ---------- */
  const configState = { length: 62, engine: 'Twin Diesel 900HP', interior: 'Alpine Oak', color: 'Abyss Navy', deck: 'Teak', price: 1250000 };
  const priceAdders = {
    length: { 48: 0, 62: 480000, 78: 1150000, 95: 2400000 },
    engine: { 'Twin Diesel 900HP': 0, 'Hybrid Electric 1200HP': 260000, 'Triple Turbine 2400HP': 610000 },
    interior: { 'Alpine Oak': 0, 'Ebony Suede': 90000, 'Ivory Marble': 140000 },
    deck: { 'Teak': 0, 'Carbon Composite': 65000, 'Bamboo Weave': 40000 }
  };
  const basePrice = 1250000;

  function updateSummary(){
    document.getElementById('sum-length').textContent = configState.length + ' ft';
    document.getElementById('sum-engine').textContent = configState.engine;
    document.getElementById('sum-interior').textContent = configState.interior;
    document.getElementById('sum-color').textContent = configState.color;
    document.getElementById('sum-deck').textContent = configState.deck;
    const total = basePrice
      + priceAdders.length[configState.length]
      + priceAdders.engine[configState.engine]
      + priceAdders.interior[configState.interior]
      + priceAdders.deck[configState.deck];
    const el = document.getElementById('sum-total');
    gsapCountTo(el, total);
  }

  function gsapCountTo(el, target){
    const start = parseInt(el.dataset.val || '0', 10);
    const dur = 500, t0 = performance.now();
    function step(now){
      const p = Math.min(1, (now - t0) / dur);
      const val = Math.round(start + (target - start) * (1 - Math.pow(1-p, 3)));
      el.textContent = '$' + val.toLocaleString();
      el.dataset.val = val;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll('.config-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const group = opt.closest('.config-group');
      group.querySelectorAll('.config-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const key = group.dataset.key;
      let val = opt.dataset.value;
      if (key === 'length') val = parseInt(val, 10);
      configState[key] = val;
      updateSummary();
    });
  });
  updateSummary();

  /* ---------- Animated stat counters ---------- */
  document.querySelectorAll('.stat .num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    let done = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !done){
          done = true;
          const dur = 1600, t0 = performance.now();
          function step(now){
            const p = Math.min(1, (now - t0)/dur);
            const val = Math.round(target * (1 - Math.pow(1-p, 3)));
            el.textContent = val.toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('t-track');
  const dotsWrap = document.getElementById('t-dots');
  if (track) {
    const slides = track.children.length;
    let idx = 0;
    for (let i = 0; i < slides; i++){
      const d = document.createElement('div');
      d.className = 't-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
    function goTo(i){
      idx = (i + slides) % slides;
      track.style.transform = `translateX(-${idx * 100}%)`;
      [...dotsWrap.children].forEach((d, di) => d.classList.toggle('active', di === idx));
    }
    document.getElementById('t-prev')?.addEventListener('click', () => goTo(idx - 1));
    document.getElementById('t-next')?.addEventListener('click', () => goTo(idx + 1));
    track.style.transition = 'transform .7s cubic-bezier(.16,.8,.24,1)';
    setInterval(() => goTo(idx + 1), 6500);
  }

  /* ---------- 3D tilt on boat cards ---------- */
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Contact form (demo only, no backend) ---------- */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    setTimeout(() => { btn.textContent = original; form.reset(); }, 2600);
  });

  /* ---------- Newsletter (demo only) ---------- */
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Subscribed';
    setTimeout(() => btn.textContent = 'Subscribe', 2200);
  });

  /* ---------- Smooth anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -80 });
      else target.scrollIntoView({ behavior: 'smooth' });
      navLinks?.classList.remove('open');
    });
  });

});

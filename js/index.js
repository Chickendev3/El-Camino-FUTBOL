
  /* --- Cursor personalizado --- */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let cx = 0, cy = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    rx += (cx - rx) * 0.12;
    ry += (cy - ry) * 0.12;
    cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .feature-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform += ' scale(1.8)';
      cursor.style.background = 'var(--dorado)';
      cursorRing.style.width = '55px';
      cursorRing.style.height = '55px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.background = 'var(--verde)';
      cursorRing.style.width = '38px';
      cursorRing.style.height = '38px';
    });
  });

  /* --- Navbar scroll --- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* --- Mobile nav --- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  function toggleMobile() {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }
  function closeMobile() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* --- Intersection Observer para reveal --- */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  /* --- Contador animado --- */
  function animateCount(el, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(start);
    }, 16);
  }

  // Dispara cuando el hero stats es visible
  const heroStats = document.querySelector('.hero-stats');
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCount(document.getElementById('cnt1'), 47);
      animateCount(document.getElementById('cnt2'), 23);
      animateCount(document.getElementById('cnt3'), 12);
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  if (heroStats) statsObserver.observe(heroStats);

  /* --- Día actual --- */
  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const today = new Date().getDay();
  const planDays = document.querySelectorAll('.plan-day');
  planDays.forEach((d, i) => {
    // i: 0=Lun,1=Mar,...,6=Dom → day: 1=Lun,...,0=Dom
    const jsDay = i === 6 ? 0 : i + 1;
    if (jsDay === today) {
      d.classList.add('today');
    }
  });

  /* --- Parallax hero bg sutil --- */
  window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.08}px)`;
    }
  });

  console.log('⚽ El Camino - Mi portfolio futbolístico · Con Dios todo es posible · Filipenses 4:13');

'use strict';

/* ============================================================
   Navbar – scroll effect
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ============================================================
   Mobile menu
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   Scroll-reveal (IntersectionObserver)
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document
  .querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale')
  .forEach(el => revealObserver.observe(el));

/* ============================================================
   Hero parallax (subtle)
   ============================================================ */
const heroBg = document.getElementById('heroBg');

if (heroBg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });
}

/* ============================================================
   Animated counters (hero stats)
   ============================================================ */
function animateCounter(el) {
  const raw    = el.textContent.trim();
  const num    = parseFloat(raw);
  const suffix = raw.replace(/[\d.]/g, '');
  const dur    = 1800;
  const start  = performance.now();

  const tick = (now) => {
    const p    = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(num * ease) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ============================================================
   Contact form – feedback on submit
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const origHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span>Message envoyé !</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>`;
    submitBtn.style.background = '#2d5a1b';
    submitBtn.style.boxShadow  = '0 12px 32px rgba(45,90,27,0.35)';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML  = origHTML;
      submitBtn.style.background  = '';
      submitBtn.style.boxShadow   = '';
      submitBtn.disabled  = false;
      contactForm.reset();
    }, 3500);
  });
}

/* ============================================================
   Smooth active nav link highlight on scroll
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const target = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (target) target.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

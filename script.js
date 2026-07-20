/* ═══════════════════════════════════════════
   INFINITE VYBEFLIX PORTFOLIO — SCRIPT
   Clean, Professional, Interview-Ready
   ═══════════════════════════════════════════ */

/* PRELOADER — FAST */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 600);
});

/* CUSTOM CURSOR */
const cursor = document.getElementById('cursor');
let cx = 0, cy = 0, tx = 0, ty = 0;

if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });
  function updateCursor() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  const hoverTargets = 'a, button, .nav-toggle, .service-card, .project-card, .skill-pill, .link-btn, .project-expand, .social-link, .footer-social-link, .modal-close, .lightbox-close';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    setTimeout(() => cursor.classList.remove('click'), 120);
  });
}

/* SCROLL PROGRESS */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
});

/* NAV SCROLL EFFECT */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* MOBILE NAV TOGGLE */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* PARTICLE NETWORK CANVAS */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let mouseX = 0, mouseY = 0;
let w, h;

function resizeCanvas() {
  if (!canvas) return;
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
if (canvas) {
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212,175,55,${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      const mdx = particles[i].x - mouseX;
      const mdy = particles[i].y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 200) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - mdist / 200)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
}

/* HERO TYPEWRITER */
const subtitle = document.getElementById('hero-subtitle');
const phrases = [
  'Founder & Lead AI Architect',
  'Builder of Nuvuja, Maureonix & Gateway',
  '100+ Projects. 1M+ Requests/Min.',
  'Nothing is impossible.'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false, typeDelay = 80;

function typeWriter() {
  if (!subtitle) return;
  const current = phrases[phraseIndex];
  if (isDeleting) {
    subtitle.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typeDelay = 35;
  } else {
    subtitle.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typeDelay = 80;
  }
  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    typeDelay = 2200;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeDelay = 500;
  }
  setTimeout(typeWriter, typeDelay);
}
if (subtitle) setTimeout(typeWriter, 1000);

/* HERO STATS COUNTER */
let statsAnimated = false;
function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  document.querySelectorAll('.hero-stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1200;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = current + (target === 1 ? '' : '+');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* SCROLL REVEAL */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.closest('.hero-stats')) animateStats();
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

/* SERVICE CARD SPOTLIGHT */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* LIGHTBOX */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = caption || '';
  if (lightboxCaption) lightboxCaption.textContent = caption || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

/* API MODAL */
const apiModal = document.getElementById('api-modal');
const apiUseCase = document.getElementById('api-usecase');

function openApiModal() {
  if (apiModal) apiModal.classList.add('active');
  if (apiUseCase) apiUseCase.value = '';
}
function closeApiModal() {
  if (apiModal) apiModal.classList.remove('active');
}
function requestApiKey() {
  const useCase = apiUseCase ? apiUseCase.value.trim() : '';
  const msg = `Hello Aevibron, I would like to request API access for the Aevibron Gateway.${useCase ? ' Use case: ' + useCase : ''}`;
  window.open('https://wa.me/254116903500?text=' + encodeURIComponent(msg), '_blank');
  closeApiModal();
  showToast('Request opened in WhatsApp');
}
if (apiModal) {
  apiModal.addEventListener('click', (e) => { if (e.target === apiModal) closeApiModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeApiModal(); });
}

/* CONTACT FORM → WHATSAPP */
function sendMessage() {
  const name = document.getElementById('form-name')?.value.trim() || '';
  const email = document.getElementById('form-email')?.value.trim() || '';
  const message = document.getElementById('form-message')?.value.trim() || '';
  let text = 'Hello Aevibron,';
  if (name) text += ` My name is ${name}.`;
  if (email) text += ` Email: ${email}.`;
  if (message) text += ` ${message}`;
  if (!name && !email && !message) text += ' I would like to discuss a project with you.';
  window.open('https://wa.me/254116903500?text=' + encodeURIComponent(text), '_blank');
  showToast('Message opened in WhatsApp');
}

/* TOAST */
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimeout;
function showToast(msg) {
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) {
    const rect = heroStatsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight) animateStats();
  }
  document.querySelectorAll('.hero .reveal-up, .hero-stat').forEach(el => el.classList.add('visible'));
});

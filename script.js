/* ═══════════════════════════════════════════
   INFINITE VYBEFLIX PORTFOLIO — UPGRADED SCRIPT
   3D Effects, Lottie, GSAP, Magnetic Buttons
   ═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   CUSTOM CURSOR + TRAIL
   ═══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let cx = 0, cy = 0, tx = 0, ty = 0;
let trailX = 0, trailY = 0;

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

    if (cursorTrail) {
      trailX += (tx - trailX) * 0.08;
      trailY += (ty - trailY) * 0.08;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  const hoverTargets = 'a, button, .nav-toggle, .service-card, .project-card, .skill-pill, .link-btn, .project-expand, .social-link, .footer-social-link, .modal-close, .lightbox-close, .marquee-pill';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    setTimeout(() => cursor.classList.remove('click'), 120);
  });
}

/* ═══════════════════════════════════════════
   SCROLL PROGRESS
   ═══════════════════════════════════════════ */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
});

/* ═══════════════════════════════════════════
   NAV SCROLL EFFECT
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   PARTICLE NETWORK CANVAS
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   HERO TYPEWRITER
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   HERO STATS COUNTER
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   SCROLL REVEAL — 3D VARIANTS
   ═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.closest('.hero-stats')) animateStats();
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-3d-up, .reveal-3d-left, .reveal-3d-right, .reveal-3d-scale, .reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

/* ═══════════════════════════════════════════
   3D TILT CARDS
   ═══════════════════════════════════════════ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

    const shine = card.querySelector('.holographic-shine');
    if (shine) {
      shine.style.backgroundPosition = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
});

/* ═══════════════════════════════════════════
   SERVICE CARD SPOTLIGHT
   ═══════════════════════════════════════════ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ═══════════════════════════════════════════
   MAGNETIC BUTTONS
   ═══════════════════════════════════════════ */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

/* ═══════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   API MODAL
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   CONTACT FORM → WHATSAPP
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   LOTTIE ANIMATION — CODING.JSON
   ═══════════════════════════════════════════ */
function initLottie() {
  const lottieContainer = document.getElementById('lottie-coding');
  if (!lottieContainer) return;

  // Try lottie-web first, then fallback to simple SVG animation
  if (typeof lottie !== 'undefined') {
    lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'Coding.json'
    });
  } else {
    // Fallback: create a simple animated code icon
    lottieContainer.innerHTML = `
      <div style="width:200px;height:200px;margin:0 auto;position:relative;">
        <div style="position:absolute;inset:0;border:2px solid rgba(212,175,55,0.3);border-radius:16px;display:flex;align-items:center;justify-content:center;animation: codePulse 2s ease-in-out infinite;">
          <i class="fas fa-code" style="font-size:64px;color:var(--gold);text-shadow:0 0 30px rgba(212,175,55,0.5);"></i>
        </div>
        <div style="position:absolute;inset:-4px;border:1px solid rgba(0,212,255,0.2);border-radius:18px;animation: codePulse 2s ease-in-out infinite 0.5s;"></div>
      </div>
    `;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes codePulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ═══════════════════════════════════════════
   GSAP SCROLL TRIGGER ANIMATIONS
   ═══════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero parallax
  gsap.utils.toArray('.hero-orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: (i + 1) * 80,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Contact cards stagger
  gsap.from('.contact-card', {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-info',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // Marquee glow intensity on scroll
  gsap.utils.toArray('.marquee-container').forEach(marquee => {
    gsap.to(marquee, {
      scrollTrigger: {
        trigger: marquee,
        start: 'top 90%',
        end: 'bottom 10%',
        onEnter: () => marquee.classList.add('marquee-active'),
        onLeave: () => marquee.classList.remove('marquee-active'),
        onEnterBack: () => marquee.classList.add('marquee-active'),
        onLeaveBack: () => marquee.classList.remove('marquee-active')
      }
    });
  });
}

/* ═══════════════════════════════════════════
   TEXT SCRAMBLE EFFECT
   ═══════════════════════════════════════════ */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color:var(--cyan);opacity:0.7;">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Stats animation on load
  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) {
    const rect = heroStatsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight) animateStats();
  }

  // Make hero elements visible immediately
  document.querySelectorAll('.hero .reveal-up, .hero-stat').forEach(el => el.classList.add('visible'));

  // Scramble text effect
  document.querySelectorAll('.scramble-text').forEach(el => {
    const fx = new TextScramble(el);
    const original = el.dataset.text || el.innerText;
    setTimeout(() => fx.setText(original), 800);
  });

  // Init Lottie
  initLottie();

  // Init GSAP
  initGSAP();

  // Parallax on hero stats
  document.querySelectorAll('.hero-stat').forEach(stat => {
    const speed = parseFloat(stat.dataset.parallax) || 0.3;
    window.addEventListener('scroll', () => {
      const y = window.scrollY * speed;
      stat.style.transform = `translateY(${y}px)`;
    });
  });
});

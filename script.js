const book = document.getElementById('book');
const sheets = document.querySelectorAll('.sheet');
let currentSheet = 0;
const totalSheets = 8;
let isFlipping = false;

/* ═══════ AUDIO — Page Flip Sound ═══════ */
let audioCtx = null;
function playFlipSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);
  } catch(e) {}
}

/* ═══════ GENERATE STARS ═══════ */
const starsLayer = document.getElementById('stars-layer');

for (let i = 0; i < 180; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  const size = 1 + Math.random() * 2.5;
  star.style.width = size + 'px';
  star.style.height = size + 'px';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.setProperty('--min-op', (0.2 + Math.random() * 0.3).toFixed(2));
  star.style.setProperty('--max-op', (0.6 + Math.random() * 0.4).toFixed(2));
  star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
  star.style.animationDelay = Math.random() * 4 + 's';
  starsLayer.appendChild(star);
}

for (let i = 0; i < 6; i++) {
  const shoot = document.createElement('div');
  shoot.className = 'shooting-star';
  shoot.style.left = (Math.random() * 60) + '%';
  shoot.style.top = (Math.random() * 40) + '%';
  shoot.style.setProperty('--shoot-dur', (5 + Math.random() * 7) + 's');
  shoot.style.setProperty('--shoot-delay', (Math.random() * 12) + 's');
  starsLayer.appendChild(shoot);
}

/* ═══════ RESPONSIVE SCALING ═══════ */
function updateScale() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const bookW = 840;
  const bookH = 960;
  const padX = 50;
  const padY = 140;
  const scale = Math.min(1, (vw - padX) / bookW, (vh - padY) / bookH);
  document.documentElement.style.setProperty('--scale', scale);
}

window.addEventListener('resize', updateScale);
updateScale();

/* ═══════ Z-INDEX MANAGEMENT ═══════ */
function updateZ() {
  sheets.forEach((sheet, i) => {
    const isFlipped = sheet.classList.contains('flipped');
    if (isFlipped) {
      sheet.style.zIndex = i + 1;
    } else {
      sheet.style.zIndex = (totalSheets - i) * 10;
    }
  });
}

/* ═══════ FLIP FUNCTIONS ═══════ */
function flipNext() {
  if (currentSheet >= totalSheets || isFlipping) return;
  isFlipping = true;
  playFlipSound();

  const sheet = sheets[currentSheet];
  sheet.style.zIndex = 999;
  sheet.classList.add('flipped');

  currentSheet++;
  if (currentSheet > 0) book.classList.add('open');

  setTimeout(() => {
    updateZ();
    updateDots();
    animateSkills();
    isFlipping = false;
  }, 1000);
}

function flipPrev() {
  if (currentSheet <= 0 || isFlipping) return;
  isFlipping = true;
  playFlipSound();

  currentSheet--;
  const sheet = sheets[currentSheet];
  sheet.style.zIndex = 999;
  sheet.classList.remove('flipped');

  if (currentSheet === 0) book.classList.remove('open');

  setTimeout(() => {
    updateZ();
    updateDots();
    animateSkills();
    isFlipping = false;
  }, 1000);
}

function jumpToSheet(index) {
  if (index === currentSheet || isFlipping) return;

  if (index > currentSheet) {
    let remaining = index - currentSheet;
    function step() {
      if (remaining > 0 && !isFlipping) {
        flipNext();
        remaining--;
        if (remaining > 0) setTimeout(step, 400);
      }
    }
    step();
  } else {
    let remaining = currentSheet - index;
    function step() {
      if (remaining > 0 && !isFlipping) {
        flipPrev();
        remaining--;
        if (remaining > 0) setTimeout(step, 400);
      }
    }
    step();
  }
}

function updateDots() {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSheet);
  });
}

// Initialize
updateZ();

/* ═══════ KEYBOARD ═══════ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); flipNext(); }
  else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); flipPrev(); }
});

/* ═══════ SWIPE ═══════ */
let tsX = 0;
document.addEventListener('touchstart', (e) => { tsX = e.changedTouches[0].screenX; }, { passive: true });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].screenX - tsX;
  if (Math.abs(dx) > 50) dx < 0 ? flipNext() : flipPrev();
}, { passive: true });

/* ═══════ CLICK TO FLIP ═══════ */
const bookScaler = document.getElementById('book-scaler');
bookScaler.addEventListener('click', (e) => {
  if (e.target.closest('.corner') || e.target.closest('a') || e.target.closest('button') || e.target.closest('.screenshot-wrap') || e.target.closest('.project-card') || e.target.closest('.service-card') || e.target.closest('.nav-dot')) return;
  const rect = bookScaler.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x > rect.width * 0.55) flipNext();
  else if (x < rect.width * 0.45) flipPrev();
});

/* ═══════ CUSTOM CURSOR ═══════ */
const cursor = document.getElementById('cursor');
const spotlight = document.getElementById('cursor-spotlight');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

if (cursor && spotlight) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spotlight.style.left = mouseX + 'px';
    spotlight.style.top = mouseY + 'px';
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .corner, .nav-dot, .screenshot-wrap, .project-card, .service-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    setTimeout(() => cursor.classList.remove('click'), 150);
  });
}

/* ═══════ CLICK RIPPLES ═══════ */
document.addEventListener('click', (e) => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = (e.clientX - 100) + 'px';
  ripple.style.top = (e.clientY - 100) + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

/* ═══════ 3D TILT ON MOUSE MOVE ═══════ */
let tiltRAF = null;
bookScaler.addEventListener('mousemove', (e) => {
  if (tiltRAF) cancelAnimationFrame(tiltRAF);
  tiltRAF = requestAnimationFrame(() => {
    const currentScale = getComputedStyle(document.documentElement)
      .getPropertyValue('--scale').trim() || 1;
    const rect = bookScaler.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    bookScaler.style.transform = `scale(${currentScale}) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
});

bookScaler.addEventListener('mouseleave', () => {
  const currentScale = getComputedStyle(document.documentElement)
    .getPropertyValue('--scale').trim() || 1;
  bookScaler.style.transform = `scale(${currentScale}) rotateY(0deg) rotateX(0deg)`;
});

/* ═══════ SKILL TAG ANIMATION ═══════ */
function animateSkills() {
  document.querySelectorAll('.skill-tag').forEach((tag, i) => {
    tag.classList.remove('show');
    setTimeout(() => tag.classList.add('show'), i * 60);
  });
}
// Initial animate
setTimeout(animateSkills, 500);

/* ═══════ LIGHTBOX ═══════ */
const lightbox = document.getElementById('lightbox');
const lbimg = document.getElementById('lbimg');

function openLightbox(src) {
  lbimg.src = src;
  lightbox.classList.add('active');
}

function closeLightbox() {
  lightbox.classList.remove('active');
}

lightbox.addEventListener('click', closeLightbox);

/* ═══════ API KEY MODAL ═══════ */
const apiModal = document.getElementById('api-modal');
const apiUseCase = document.getElementById('api-usecase');

function openApiModal() {
  apiModal.classList.add('active');
  if (apiUseCase) apiUseCase.value = '';
}

function closeApiModal() {
  apiModal.classList.remove('active');
}

function requestApiKey() {
  const useCase = apiUseCase ? apiUseCase.value.trim() : '';
  const msg = `Hello Aevibron, I would like to request API access for the Aevibron Gateway.${useCase ? ' Use case: ' + useCase : ''}`;
  window.open('https://wa.me/254116903500?text=' + encodeURIComponent(msg), '_blank');
  closeApiModal();
}

/* ═══════ WELCOME POPUP ═══════ */
const welcomePopup = document.getElementById('welcome-popup');
const welcomeType = document.getElementById('welcome-type');

function typeWriter(text, el, speed = 55) {
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function dismissWelcome() {
  welcomePopup.classList.remove('active');
  localStorage.setItem('aevibron-welcome-seen', '1');
}

if (welcomePopup && welcomeType) {
  if (!localStorage.getItem('aevibron-welcome-seen')) {
    setTimeout(() => {
      welcomePopup.classList.add('active');
      typeWriter('Nothing is impossible. Welcome to my world.', welcomeType, 55);
    }, 600);
  }
}

/* ═══════ HOLOGRAPHIC CARD BORDERS ═══════ */
function addHoloShine() {
  document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212,175,55,.08), rgba(255,255,255,.03))`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = 'rgba(255,255,255,.03)';
    });
  });
}
addHoloShine();

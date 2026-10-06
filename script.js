/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 1800);
});

/* ---------- ENVELOPE ---------- */
const envelopeOverlay = document.getElementById('envelopeOverlay');
let envelopeUsed = false;

function dismissEnvelope() {
  if (envelopeOverlay.classList.contains('done') || envelopeOverlay.classList.contains('opening')) return;
  envelopeOverlay.classList.add('opening');
  setTimeout(() => {
    envelopeOverlay.classList.add('done');
    document.getElementById('formalInvite').scrollIntoView({ behavior: 'smooth' });
  }, 1200);
}

// "Open Invitation" — first time opens envelope, after that always scrolls
document.getElementById('openInvite').addEventListener('click', () => {
  if (!envelopeUsed) {
    envelopeUsed = true;
    envelopeOverlay.classList.add('active');
    setTimeout(() => {
      dismissEnvelope();
    }, 2800);
  } else {
    document.getElementById('formalInvite').scrollIntoView({ behavior: 'smooth' });
  }
});

// Tap or touch anywhere on overlay to dismiss
envelopeOverlay.addEventListener('click', dismissEnvelope);
envelopeOverlay.addEventListener('touchend', (e) => {
  e.preventDefault();
  dismissEnvelope();
});

/* ---------- MUSIC ---------- */
let isPlaying = false;
const bgMusic = new Audio('assets/music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.25;

document.getElementById('musicToggle').addEventListener('click', () => {
  const btn = document.getElementById('musicToggle');
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    btn.classList.remove('playing');
  } else {
    bgMusic.play().then(() => {
      isPlaying = true;
      btn.classList.add('playing');
    }).catch(() => {});
  }
});

let autoPlayed = false;
function tryAutoPlay() {
  if (!autoPlayed && !isPlaying) {
    autoPlayed = true;
    bgMusic.play().then(() => {
      isPlaying = true;
      document.getElementById('musicToggle').classList.add('playing');
    }).catch(() => {});
  }
}
document.addEventListener('click', tryAutoPlay, { once: true });
document.addEventListener('touchstart', tryAutoPlay, { once: true });

/* ---------- SCROLL REVEAL ---------- */
const sections = document.querySelectorAll('.section');
const storyLines = document.querySelectorAll('.story-line');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

sections.forEach(s => sectionObserver.observe(s));

const storyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

storyLines.forEach(l => storyObserver.observe(l));

/* ---------- COUNTDOWN ---------- */
const weddingDate = new Date('2026-09-09T20:00:00').getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = weddingDate - now;

  const el = document.getElementById('cd-days');
  if (!el) return;

  if (diff <= 0) {
    el.textContent = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-mins').textContent = '0';
    document.getElementById('cd-secs').textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  el.textContent = days;
  document.getElementById('cd-hours').textContent = hours;
  document.getElementById('cd-mins').textContent = mins;
  document.getElementById('cd-secs').textContent = secs;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- AUTO CONFETTI ON SCROLL TO DATE SECTION ---------- */
const dateSection = document.getElementById('dateReveal');
let confettiLaunched = false;

// Trigger when the date section enters the viewport
const dateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !confettiLaunched) {
      confettiLaunched = true;
      launchConfetti();
    }
  });
}, { threshold: 0.1 });

dateObserver.observe(dateSection);

// Scroll fallback in case the observer does not fire
document.getElementById('mainScroll').addEventListener('scroll', () => {
  if (confettiLaunched) return;
  const rect = dateSection.getBoundingClientRect();
  const viewH = window.innerHeight;
  if (rect.top < viewH * 0.8 && rect.bottom > 0) {
    confettiLaunched = true;
    launchConfetti();
  }
});

function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;
  const colors = ['#B8975A', '#D4A5A5', '#F4C2C2', '#BC8F8F', '#D4E4D2', '#FFD700', '#FF69B4', '#E8D5CC'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 350 + 100;
    const x = Math.cos(angle) * distance;
    const y = -Math.abs(Math.sin(angle) * distance) - 50;
    const size = Math.random() * 12 + 5;
    const shapes = ['50%', '2px', '0'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    Object.assign(piece.style, {
      width: size + 'px',
      height: size * (Math.random() * 0.5 + 0.5) + 'px',
      background: color,
      borderRadius: shape,
      left: '50%',
      top: '110%',
      '--tx': x + 'px',
      '--ty': y + 'px',
      animationDelay: (Math.random() * 0.8) + 's',
      animationDuration: (Math.random() * 1.5 + 1.5) + 's'
    });
    container.appendChild(piece);
  }

  setTimeout(() => { container.innerHTML = ''; }, 5000);
}

/* ---------- RSVP FORM ---------- */
document.getElementById('rsvpForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const form = e.target;
  const confirmation = document.getElementById('rsvpConfirmation');

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(() => {
    const icon = confirmation.querySelector('.confirmation-icon');
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-burst';
      const angle = (i / 8) * Math.PI * 2;
      sparkle.style.setProperty('--sx', Math.cos(angle) * 40 + 'px');
      sparkle.style.setProperty('--sy', Math.sin(angle) * 40 + 'px');
      icon.appendChild(sparkle);
    }
    form.style.display = 'none';
    confirmation.style.display = 'block';
    setTimeout(() => {
      confirmation.querySelectorAll('.sparkle-burst').forEach(s => s.remove());
    }, 800);
  }).catch(() => {
    alert('Something went wrong. Please try again.');
  });
});

/* ---------- CALENDAR (ICS Download) ---------- */
document.getElementById('addToCalendar').addEventListener('click', () => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SuruKiNikku//EN',
    'BEGIN:VEVENT',
    'DTSTART:20260909T200000',
    'DTEND:20260909T235959',
    'SUMMARY:Manali & Suraj - The Grand Affair',
    'LOCATION:Grand Imperia\\, VIP Road\\, Vishal Nagar\\, Raipur\\, Chhattisgarh 492006',
    'DESCRIPTION:Join us to celebrate the wedding of Dr. Manali Panjwani & Adv. Suraj Wagwani',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SuruKiNikku.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

/* ---------- FLOATING PETALS ---------- */
function createPetal() {
  const landing = document.getElementById('landing');
  if (!landing) return;
  const petal = document.createElement('div');
  petal.className = 'floating-petal';
  const size = Math.random() * 14 + 8;
  const left = Math.random() * 100;
  const duration = Math.random() * 10 + 12;
  Object.assign(petal.style, {
    width: size + 'px', height: size + 'px',
    left: left + '%', animationDuration: duration + 's'
  });
  landing.appendChild(petal);
  setTimeout(() => petal.remove(), duration * 1000);
}

setInterval(createPetal, 3000);

/* ---------- SMOOTH SCROLL FOR ARROWS ---------- */
document.querySelectorAll('.scroll-arrow').forEach(arrow => {
  arrow.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(arrow.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════
   TesterChip — Flood Detector
   script.js
════════════════════════════════════════ */

/* ── MOBILE MENU ── */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.addEventListener('click', e => {
  if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

/* ── GAUGE / LIVE PREVIEW ── */
function setLevel(pct, isAlert) {
  const water  = document.getElementById('gaugeWater');
  const pctEl  = document.getElementById('gaugePct');
  const dot    = document.getElementById('statusDot');
  const stText = document.getElementById('statusText');

  water.style.height = pct + '%';
  pctEl.textContent  = pct + '%';

  if (isAlert) {
    water.classList.add('alert-water');
    dot.classList.add('alert');
    stText.textContent  = 'Status: ⚠ FLOOD ALERT';
    stText.style.color  = 'var(--a3)';
  } else {
    water.classList.remove('alert-water');
    dot.classList.remove('alert');
    stText.textContent  = 'Status: Normal';
    stText.style.color  = 'var(--a2)';
  }
}

document.getElementById('randomBtn').addEventListener('click', () => {
  const pct = Math.floor(Math.random() * 80) + 10;
  setLevel(pct, pct >= 75);
});

document.getElementById('alertBtn').addEventListener('click', () => {
  setLevel(92, true);
});

/* ── COPY CODE BUTTON ── */
document.getElementById('copyBtn').addEventListener('click', () => {
  const raw = document.getElementById('codeBlock').innerText;

  navigator.clipboard.writeText(raw).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.innerHTML      = '<i class="fa-solid fa-check"></i> &nbsp;Copied!';
    btn.style.color    = 'var(--a2)';
    btn.style.borderColor = 'var(--a2)';

    setTimeout(() => {
      btn.innerHTML         = '<i class="fa-regular fa-copy"></i> &nbsp;Copy';
      btn.style.color       = '';
      btn.style.borderColor = '';
    }, 2000);
  });
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = [...document.querySelectorAll('.reveal')];
revealItems.forEach((item) => {
  const siblings = [...item.parentElement.children].filter((el) => el.classList.contains('reveal'));
  item.style.setProperty('--r', siblings.indexOf(item));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    entry.target.querySelectorAll('[data-count]').forEach(countUp);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => revealObserver.observe(item));

function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = 'true';
  const raw = el.dataset.count;
  const target = parseFloat(raw);
  const decimals = (raw.split('.')[1] || '').length;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const format = (value) => prefix + (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString()) + suffix;

  if (reduceMotion) {
    el.textContent = format(target);
    return;
  }

  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = format(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const chipLinks = [...document.querySelectorAll('.chip-nav a')];
const chipTargets = chipLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if (chipTargets.length) {
  const chipObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      chipLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  chipTargets.forEach((section) => chipObserver.observe(section));
}

document.querySelectorAll('.box').forEach((box) => {
  box.querySelectorAll('.chips li').forEach((chip, i) => chip.style.setProperty('--c', i));

  box.addEventListener('pointermove', (event) => {
    const rect = box.getBoundingClientRect();
    box.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    box.style.setProperty('--my', `${event.clientY - rect.top}px`);
  });
});

const solutionBurger = document.querySelector('.nav__burger');
const solutionLinks = document.querySelector('.nav__links');
if (solutionBurger && solutionBurger.dataset.bound !== 'true') {
  solutionBurger.addEventListener('click', () => {
    const open = solutionBurger.getAttribute('aria-expanded') === 'true';
    solutionBurger.setAttribute('aria-expanded', String(!open));
    solutionLinks.classList.toggle('is-open', !open);
  });
}

const heroVideo = document.querySelector('.bg__video');
const solutionsSection = document.querySelector('.solutions');

// Hero footage keeps scaling as the page scrolls, so the cards arrive close to the cube.
if (heroVideo && solutionsSection && !reduceMotion) {
  let queued = false;

  const applyZoom = () => {
    queued = false;
    const end = solutionsSection.offsetTop + solutionsSection.offsetHeight - window.innerHeight;
    const progress = Math.min(Math.max(window.scrollY / (end || 1), 0), 1);
    heroVideo.style.transform = `scale(${(1.02 + progress * 1.55).toFixed(3)})`;
  };

  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(applyZoom);
  }, { passive: true });

  addEventListener('resize', applyZoom);
  applyZoom();
}

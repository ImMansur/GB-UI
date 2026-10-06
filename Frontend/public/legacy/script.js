const modal = document.getElementById('modal');
const modalVideo = document.getElementById('modalVideo');
const openBtn = document.getElementById('watchVideo');
const closeBtn = modal.querySelector('.modal__close');

function openModal() {
  modal.hidden = false;
  modalVideo.currentTime = 0;
  modalVideo.play();
}

function closeModal() {
  modalVideo.pause();
  modal.hidden = true;
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

// Some browsers block autoplay until the document is interacted with.
const bgVideo = document.querySelector('.bg__video');
document.addEventListener(
  'pointerdown',
  () => bgVideo.paused && bgVideo.play().catch(() => {}),
  { once: true }
);

const burger = document.querySelector('.nav__burger');
const links = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const navSolutionsSection = document.querySelector('.solutions');

function updateNavState() {
  const inSolutions = navSolutionsSection
    && window.scrollY >= navSolutionsSection.offsetTop - window.innerHeight * 0.35;
  nav.classList.toggle('is-scrolled', window.scrollY > 24);
  nav.classList.toggle('is-solutions', inSolutions);
  document.body.classList.toggle('at-solutions', inSolutions);
}

updateNavState();
window.addEventListener('scroll', updateNavState, { passive: true });

if (navSolutionsSection) {
  const solutionsObserver = new IntersectionObserver(([entry]) => {
    nav.classList.toggle('is-solutions', entry.isIntersecting);
  }, { rootMargin: '-12% 0px 0px 0px' });
  solutionsObserver.observe(navSolutionsSection);
}

burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  links.classList.toggle('is-open', !open);
});
burger.dataset.bound = 'true';

const cards = [...document.querySelectorAll('.card')];
const railItems = [...document.querySelectorAll('.rail--index span')];

document.querySelectorAll('a[href="solution.html"], a[href="pricing.html"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.page-wipe').classList.add('page-wipe--in');
    setTimeout(() => { window.location.href = link.href; }, 450);
  });
});

cards.forEach((card, i) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  card.addEventListener('click', () => {
    const selected = card.getAttribute('aria-pressed') === 'true';
    cards.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    card.setAttribute('aria-pressed', String(!selected));
    railItems.forEach((item, j) => item.classList.toggle('is-active', !selected && j === i));
  });

  card.addEventListener('keydown', (e) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    cards[(i + step + cards.length) % cards.length].focus();
  });
});

document.querySelectorAll('.btn, .tier__cta, .text-link').forEach((action) => {
  action.addEventListener('pointermove', (event) => {
    const bounds = action.getBoundingClientRect();
    action.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    action.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });

  action.addEventListener('pointerdown', () => {
    action.classList.remove('is-pressed');
    void action.offsetWidth;
    action.classList.add('is-pressed');
  });

  action.addEventListener('animationend', () => action.classList.remove('is-pressed'));
});

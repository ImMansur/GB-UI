const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => observer.observe(item));

const solutionNavLinks = [...document.querySelectorAll('.capability-index a')];
const solutionSections = solutionNavLinks.map((link) => document.querySelector(link.getAttribute('href')));
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    solutionNavLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -55% 0px' });
solutionSections.forEach((section) => sectionObserver.observe(section));

const solutionBurger = document.querySelector('.nav__burger');
const solutionLinks = document.querySelector('.nav__links');
if (solutionBurger && solutionBurger.dataset.bound !== 'true') {
  solutionBurger.addEventListener('click', () => {
    const open = solutionBurger.getAttribute('aria-expanded') === 'true';
    solutionBurger.setAttribute('aria-expanded', String(!open));
    solutionLinks.classList.toggle('is-open', !open);
  });
}

document.querySelectorAll('a[href="index.html"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.page-wipe').classList.add('page-wipe--in');
    setTimeout(() => { window.location.href = link.href; }, 450);
  });
});

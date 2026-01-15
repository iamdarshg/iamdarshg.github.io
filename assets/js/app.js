function initTheme() {
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-color-scheme', savedTheme);
}

function toggleTheme() {
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', function() {
  initTheme();
  setupSmoothScroll();
  document.getElementById('year').textContent = new Date().getFullYear();
});

import './pages/components/planet-card.js';
import './pages/components/planet-filter.js';
import './pages/components/profile-summary.js';
import './pages/components/planet-stats.js';
import './pages/home-page.js';
import './pages/kepler-page.js';
import './pages/proxima-page.js';
import './pages/trappist-page.js';
import './pages/gliese-page.js';
import './app-router.js';
import './app-root.js';
import planets from './data/planets.json' assert { type: 'json' };

function renderPlanets(planetsList) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  planetsList.forEach(planet => {
    const article = document.createElement('article');
    article.setAttribute('data-name', planet.name);
    article.innerHTML = `
      <img src="${planet.image}" alt="${planet.name}" />
      <h3>${planet.name}</h3>
      <p>${planet.description}</p>
    `;
    app.appendChild(article);
  });
}

function applySearchFilter(query) {
  const lowerQuery = query.toLowerCase();
  const filtered = planets.filter(planet =>
    planet.name.toLowerCase().includes(lowerQuery)
  );
  renderPlanets(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  renderPlanets(planets);

  const themeToggle = document.getElementById("themeToggle");
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "dark";
  htmlEl.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "light" ? "🌙" : "🌞";

  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlEl.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    htmlEl.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "light" ? "🌙" : "🌞";
  });

  const searchForm = document.querySelector(".search-form form");
  const searchInput = searchForm.querySelector("input");

  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return renderPlanets(planets);
    applySearchFilter(query);
  });
});

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}

function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupThemeToggle();

  const appRoot = document.createElement('app-root');
  document.getElementById('app').appendChild(appRoot);
});

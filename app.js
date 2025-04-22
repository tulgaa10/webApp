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

// Setup theme on initial load
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Mount the app root component
  const appRoot = document.createElement('app-root');
  document.getElementById('app').appendChild(appRoot);
});
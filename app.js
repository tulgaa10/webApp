import './pages/components/planet-card.js';
 import './pages/components/planet-filter.js';
 import './pages/components/profile-summary.js';
 import './pages/components/planet-stats.js'; 
 import './pages/components/planet-stats.js';
 import './pages/home-page.js';
 import './pages/kepler-page.js';
 import './pages/proxima-page.js';
 import './pages/gliese-page.js';
 import './app-router.js';
 import './app-root.js';
 
 // Setup theme on initial load
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
 
 // Initialize the application
 document.addEventListener('DOMContentLoaded', () => {
   initTheme();
   
   // Mount the app root component
   setupThemeToggle();
 
   const appRoot = document.createElement('app-root');
   document.getElementById('app').appendChild(appRoot);
 });
 });

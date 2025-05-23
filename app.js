import './pages/components/planet-card.js';
import './pages/components/planet-filter.js';
import './pages/components/profile-summary.js';
import './pages/components/planet-stats.js'; 
import './pages/home-page.js';
import './pages/kepler-page.js';
import './pages/proxima-page.js';
import './pages/gliese-page.js';
import './app-router.js';
import './app-root.js';

// Function to update logo based on theme
function updateLogo(theme) {
  const logo = document.getElementById('logo');
  if (logo) {
    const logoSrc = theme === 'dark' ? 
      logo.getAttribute('data-dark-src') : 
      logo.getAttribute('data-light-src');
    
    if (logoSrc) {
      logo.src = logoSrc;
    }
  }
}
function updateThemeToggleIcon(theme) {
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.textContent = theme === 'dark' ? '🌙' : '🌞';
  }
}

 
// Setup theme on initial load
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', theme);
  updateLogo(theme);
  updateThemeToggleIcon(theme);

  const event = new CustomEvent('theme-changed', {
    bubbles: true,
    composed: true,
    detail: { theme }
  });
  document.dispatchEvent(event);
  window.dispatchEvent(event);
}


function setupThemeToggle() {
  // Changed from theme-toggle to themeToggle to match the ID in index.html
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      
      // Update document attribute
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
      
      // Update logo based on theme
      updateLogo(newTheme);
      updateThemeToggleIcon(newTheme);
      
      // Create the event once
      const event = new CustomEvent('theme-changed', {
        bubbles: true,
        composed: true,
        detail: { theme: newTheme }
      });
      
      // Dispatch to both document and window to ensure it propagates everywhere
      document.dispatchEvent(event);
      window.dispatchEvent(event);
      
      console.log('Theme toggled to:', newTheme);
    });
  }
}

// Force theme application on all components
function applyThemeToAllComponents() {
  const theme = document.documentElement.getAttribute('data-theme');
  
  // Update logo based on theme
  updateLogo(theme);
  
  // Create theme event
  const event = new CustomEvent('theme-changed', {
    bubbles: true,
    composed: true,
    detail: { theme }
  });
  
  // Alternative approach: find all custom elements and dispatch events to them directly
  document.querySelectorAll('*').forEach(element => {
    if (element.tagName.includes('-')) {
      // This is likely a custom element, dispatch directly to it
      element.dispatchEvent(event);
    }
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Mount the app root component
  setupThemeToggle();
 
  const appRoot = document.createElement('app-root');
  document.getElementById('app').appendChild(appRoot);
  
  // After a short delay, ensure theme is applied to all components
  setTimeout(applyThemeToAllComponents, 1000);
  
  // Listen for theme changes at the document level
  document.addEventListener('theme-changed', (event) => {
    updateLogo(event.detail.theme);
  });
});

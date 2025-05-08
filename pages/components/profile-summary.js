class ProfileSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.likedPlanets = [];
    this.totalLikes = 0;
    this.lastLikedPlanet = null;
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Bind the handler so we can remove it later
    this.handlePlanetLiked = this.handlePlanetLiked.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
  }
  
  connectedCallback() {
    // Initial load of liked planets from localStorage
    this.loadLikedPlanets();
    
    // Listen for planet-liked events from planet-card components
    document.addEventListener('planet-liked', this.handlePlanetLiked);
    
    // Listen for theme-changed events from the app
    document.addEventListener('theme-changed', this.handleThemeChange);
    window.addEventListener('theme-changed', this.handleThemeChange);
    
    // Get initial theme state
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    this.render();
  }
  
  disconnectedCallback() {
    // Clean up event listeners when component is removed
    document.removeEventListener('planet-liked', this.handlePlanetLiked);
    document.removeEventListener('theme-changed', this.handleThemeChange);
    window.removeEventListener('theme-changed', this.handleThemeChange);
  }
  
  handleThemeChange(event) {
    // Update theme from event if available
    if (event && event.detail && event.detail.theme) {
      this.currentTheme = event.detail.theme;
    } else {
      // Fallback to checking document attribute
      this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    }
    
    // Re-render component when theme changes
    this.render();
  }
  
  loadLikedPlanets() {
    // Check localStorage for all keys that start with "like-"
    this.likedPlanets = [];
    this.totalLikes = 0;
    
    // Find all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Check if this is a planet like
      if (key.startsWith('like-')) {
        const isLiked = JSON.parse(localStorage.getItem(key));
        
        if (isLiked) {
          const planetId = key.replace('like-', '');
          this.likedPlanets.push(planetId);
          this.totalLikes++;
        }
      }
    }
    
    // Save aggregated profile data to localStorage
    localStorage.setItem('profile-likes-total', this.totalLikes.toString());
    localStorage.setItem('profile-likes-planets', JSON.stringify(this.likedPlanets));
  }
  
  handlePlanetLiked(event) {
    // Update last liked planet
    this.lastLikedPlanet = event.detail;
    
    // Reload all liked planets to ensure we have the latest data
    this.loadLikedPlanets();
    this.render();
    
    // Dispatch a summary update event
    this.dispatchEvent(new CustomEvent('profile-updated', {
      bubbles: true,
      composed: true,
      detail: {
        totalLikes: this.totalLikes,
        likedPlanets: this.likedPlanets,
        lastAction: event.detail.liked ? 'added' : 'removed',
        lastPlanet: event.detail.name
      }
    }));
  }
  
  render() {
    // Different messages based on like count
    let message = '';
    let notificationMessage = '';
    
    if (this.totalLikes === 0) {
      message = 'Та одоогоор ямар ч гаригт таалагдсан дараагүй байна.';
    } else if (this.totalLikes === 1) {
      message = 'Та 1 гаригт таалагдсан дарсан байна.';
    } else {
      message = `Та ${this.totalLikes} гаригт таалагдсан дарсан байна.`;
    }
    
    if (this.lastLikedPlanet) {
      notificationMessage = this.lastLikedPlanet.liked 
        ? `Та саяхан "${this.lastLikedPlanet.name}" гаригийг таалагдсан дарлаа!`
        : `Та саяхан "${this.lastLikedPlanet.name}" гаригийг таалагдсанаас хассан!`;
    }
    
    const isDarkMode = this.currentTheme === 'dark';
    
    // Create summary element with cosmic space theme and dark/light mode compatibility
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1.5rem;
        }
        
        .profile-summary {
          background: var(--summary-background, ${isDarkMode ? 
            'linear-gradient(135deg, rgba(25, 30, 60, 0.9), rgba(45, 20, 80, 0.85))' : 
            'linear-gradient(135deg, rgba(100, 150, 255, 0.8), rgba(180, 140, 255, 0.6))'
          });
          border-radius: var(--border-radius-lg, 12px);
          padding: 1.5rem;
          color: var(--text-color, ${isDarkMode ? '#e1e7ff' : '#fff'});
          text-align: center;
          box-shadow: var(--shadow-lg, ${
            isDarkMode ? 
            '0 5px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(80, 0, 255, 0.1) inset' : 
            '0 5px 15px rgba(0, 0, 0, 0.2), 0 0 30px rgba(100, 150, 255, 0.1) inset'
          });
          animation: fadeIn 0.5s ease-in-out;
          position: relative;
          overflow: hidden;
        }
        
        /* Space theme elements */
        .profile-summary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            radial-gradient(circle at 30% 65%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            radial-gradient(circle at 90% 70%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 150px 150px;
          opacity: 0.6;
          z-index: 0;
        }
        
        .content {
          position: relative;
          z-index: 1;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .summary-icon {
          font-size: 1.8rem;
          margin-right: 0.7rem;
          display: inline-block;
          animation: pulse 4s infinite ease-in-out;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .summary-text {
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .notification {
          margin-top: 0;
          font-size: 0.95rem;
          opacity: 0;
          height: 0;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          background: ${isDarkMode ? 
            'rgba(20, 15, 40, 0.5)' : 
            'rgba(255, 255, 255, 0.2)'
          };
          border-radius: 8px;
          padding: 0 1rem;
          max-width: 90%;
          margin: 0 auto;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }
        
        .notification.show {
          opacity: 1;
          height: auto;
          margin-top: 1rem;
          padding: 0.7rem 1rem;
        }
        
        /* Planet icon animation for notification */
        .planet-icon {
          display: inline-block;
          margin-right: 0.4rem;
          animation: orbit 8s infinite linear;
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(3px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(3px) rotate(-360deg); }
        }
      </style>
      
      <div class="profile-summary">
        <div class="content">
          <div class="summary-container">
            <span class="summary-icon">🪐</span>
            <span class="summary-text">${message}</span>
          </div>
          
          <div class="notification ${this.lastLikedPlanet ? 'show' : ''}">
            <span class="planet-icon">✨</span>
            ${notificationMessage}
          </div>
        </div>
      </div>
    `;
    
    // Auto-hide the notification after 5 seconds
    if (this.lastLikedPlanet) {
      setTimeout(() => {
        const notification = this.shadowRoot.querySelector('.notification');
        if (notification) {
          notification.classList.remove('show');
        }
      }, 5000);
    }
  }
}

customElements.define('profile-summary', ProfileSummary);

export default ProfileSummary;

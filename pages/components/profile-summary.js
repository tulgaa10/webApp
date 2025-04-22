class ProfileSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.likedPlanets = [];
    this.totalLikes = 0;
    this.lastLikedPlanet = null;
    
    // Bind the handler so we can remove it later
    this.handlePlanetLiked = this.handlePlanetLiked.bind(this);
  }
  
  connectedCallback() {
    // Initial load of liked planets from localStorage
    this.loadLikedPlanets();
    
    // Listen for planet-liked events from planet-card components
    document.addEventListener('planet-liked', this.handlePlanetLiked);
    
    this.render();
  }
  
  disconnectedCallback() {
    // Clean up event listener when component is removed
    document.removeEventListener('planet-liked', this.handlePlanetLiked);
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
    
    // Create summary element with animation
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1rem;
        }
        
        .profile-summary {
          background: var(--gradient-primary, linear-gradient(135deg, rgba(65, 105, 225, 0.8), rgba(147, 112, 219, 0.6)));
          border-radius: var(--border-radius-md, 10px);
          padding: 1rem;
          color: white;
          text-align: center;
          box-shadow: var(--shadow-md, 0 5px 15px rgba(0, 0, 0, 0.3));
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .summary-icon {
          font-size: 1.5rem;
          margin-right: 0.5rem;
        }
        
        .summary-text {
          font-size: 1rem;
          font-weight: bold;
        }
        
        .notification {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          opacity: 0;
          height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .notification.show {
          opacity: 1;
          height: auto;
          margin-top: 0.5rem;
        }
      </style>
      
      <div class="profile-summary">
        <div>
          <span class="summary-icon">❤️</span>
          <span class="summary-text">${message}</span>
        </div>
        
        <div class="notification ${this.lastLikedPlanet ? 'show' : ''}">
          ${notificationMessage}
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
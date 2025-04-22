class PlanetStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._stats = {
      totalPlanets: 0,
      likedPlanets: 0,
      habitablePlanets: 0,
      closePlanets: 0,
      superEarthPlanets: 0,
      mostLikedType: null
    };
    this._planets = [];
    
    // Bind handlers
    this.handlePlanetLiked = this.handlePlanetLiked.bind(this);
    this.handlePlanetsLoaded = this.handlePlanetsLoaded.bind(this);
  }
  
  // Getter for stats property
  get stats() {
    return this._stats;
  }
  
  // Setter for stats property
  set stats(value) {
    this._stats = value;
    this.saveStats();
    this.render();
  }
  
  // Getter for planets property
  get planets() {
    return this._planets;
  }
  
  // Setter for planets property
  set planets(value) {
    this._planets = value;
    this.calculateStats();
    this.render();
  }
  
  connectedCallback() {
    // Load stats from localStorage if available
    this.loadStats();
    
    // Load planets data from localStorage if available
    this.loadPlanets();
    
    // Listen for planet-liked events from planet-card components
    document.addEventListener('planet-liked', this.handlePlanetLiked);
    
    // Listen for planets-loaded event from home-page
    document.addEventListener('planets-loaded', this.handlePlanetsLoaded);
    
    this.render();
  }
  
  disconnectedCallback() {
    // Clean up event listeners when component is removed
    document.removeEventListener('planet-liked', this.handlePlanetLiked);
    document.removeEventListener('planets-loaded', this.handlePlanetsLoaded);
  }
  
  loadStats() {
    try {
      const savedStats = localStorage.getItem('planet-stats');
      if (savedStats) {
        this._stats = JSON.parse(savedStats);
      }
    } catch (e) {
      console.error('Error loading planet stats:', e);
    }
  }
  
  loadPlanets() {
    try {
      const savedPlanets = localStorage.getItem('planets-data');
      if (savedPlanets) {
        this._planets = JSON.parse(savedPlanets);
      }
    } catch (e) {
      console.error('Error loading planets data:', e);
    }
  }
  
  savePlanets() {
    try {
      localStorage.setItem('planets-data', JSON.stringify(this._planets));
    } catch (e) {
      console.error('Error saving planets data:', e);
    }
  }
  
  saveStats() {
    try {
      localStorage.setItem('planet-stats', JSON.stringify(this._stats));
    } catch (e) {
      console.error('Error saving planet stats:', e);
    }
  }
  
  handlePlanetLiked(event) {
    const { id, liked } = event.detail;
    
    // Update planet liked status in our local data
    const planetIndex = this._planets.findIndex(p => p.id === id);
    if (planetIndex !== -1) {
      this._planets[planetIndex].liked = liked;
      // Save updated planets data
      this.savePlanets();
    } else {
      // If the planet doesn't exist in our array yet (first load scenario)
      // Check if we can find it in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === `like-${id}` && JSON.parse(localStorage.getItem(key))) {
          // We found this planet is liked in localStorage
          if (!this._planets.some(p => p.id === id)) {
            // Add minimal planet info if we don't have it yet
            this._planets.push({
              id: id,
              liked: true,
              type: event.detail.type || 'unknown'
            });
          }
        }
      }
    }
    
    // Recalculate stats
    this.calculateStats();
    this.render();
    
    // Dispatch stats-updated event
    this.dispatchEvent(new CustomEvent('stats-updated', {
      bubbles: true,
      composed: true,
      detail: {
        stats: this._stats
      }
    }));
  }
  
  handlePlanetsLoaded(event) {
    this._planets = event.detail.planets.map(planet => {
      // Check if planet is liked from localStorage
      const isLiked = JSON.parse(localStorage.getItem(`like-${planet.id}`)) || false;
      return {
        ...planet,
        liked: isLiked
      };
    });
    
    // Save planets to localStorage
    this.savePlanets();
    
    this.calculateStats();
    this.render();
  }
  
  calculateStats() {
    // Count total planets
    this._stats.totalPlanets = this._planets.length;
    
    // Count liked planets
    this._stats.likedPlanets = 0;
    
    // First let's check localStorage for all liked planets
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('like-')) {
        const isLiked = JSON.parse(localStorage.getItem(key));
        if (isLiked) {
          this._stats.likedPlanets++;
          
          // Make sure we have this planet in our array with liked status
          const planetId = key.replace('like-', '');
          const existingPlanet = this._planets.find(p => p.id === planetId);
          
          if (existingPlanet) {
            existingPlanet.liked = true;
          }
        }
      }
    }
    
    // Count by planet type
    this._stats.habitablePlanets = this._planets.filter(planet => planet.type === 'habitable').length;
    this._stats.closePlanets = this._planets.filter(planet => planet.type === 'close').length;
    this._stats.superEarthPlanets = this._planets.filter(planet => planet.type === 'super-earth').length;
    
    // Calculate most liked type
    const likedTypes = this._planets
      .filter(planet => planet.liked)
      .map(planet => planet.type);
    
    if (likedTypes.length > 0) {
      const typeCounts = likedTypes.reduce((counts, type) => {
        counts[type] = (counts[type] || 0) + 1;
        return counts;
      }, {});
      
      this._stats.mostLikedType = Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
    } else {
      this._stats.mostLikedType = null;
    }
    
    // Save stats to localStorage
    this.saveStats();
  }
  
  getTypeLabel(type) {
    const labels = {
      'habitable': 'Амьдрах боломжтой',
      'close': 'Хамгийн ойрхон',
      'super-earth': 'Супер дэлхий',
      'default': 'Бусад'
    };
    
    return labels[type] || labels.default;
  }
  
  render() {
    const { totalPlanets, likedPlanets, habitablePlanets, closePlanets, superEarthPlanets, mostLikedType } = this._stats;
    
    const likePercentage = totalPlanets > 0 
      ? Math.round(likedPlanets / totalPlanets * 100) 
      : 0;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 1rem 0;
        }
        
        .stats-container {
          background: var(--color-card, rgba(30, 30, 70, 0.7));
          border-radius: var(--border-radius-md, 10px);
          padding: 1rem;
          box-shadow: var(--shadow-md, 0 5px 15px rgba(0, 0, 0, 0.3));
          color: var(--color-text, #ffffff);
        }
        
        h3 {
          color: var(--color-heading, rgb(132, 195, 250, 0.9));
          margin-top: 0;
          text-align: center;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .stat-card {
          background: var(--color-primary, #021a61);
          padding: 0.8rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--color-accent, #00ffff);
          margin: 0.5rem 0;
        }
        
        .stat-label {
          font-size: 0.9rem;
          text-align: center;
        }
        
        .stat-progress {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: var(--color-secondary, rgb(255, 153, 0));
          width: ${likePercentage}%;
          transition: width 0.3s ease;
        }
        
        .favorite-type {
          margin-top: 1rem;
          text-align: center;
          font-style: italic;
        }
      </style>
      
      <div class="stats-container">
        <h3>Гаригуудын статистик</h3>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Нийт гариг</div>
            <div class="stat-value">${totalPlanets}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Таалагдсан</div>
            <div class="stat-value">${likedPlanets}</div>
            <div class="stat-progress">
              <div class="progress-bar"></div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Амьдрах боломжтой</div>
            <div class="stat-value">${habitablePlanets}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Хамгийн ойрхон</div>
            <div class="stat-value">${closePlanets}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Супер дэлхий</div>
            <div class="stat-value">${superEarthPlanets}</div>
          </div>
        </div>
        
        ${mostLikedType ? `
          <div class="favorite-type">
            Хамгийн ихээр таалагдсан төрөл: <strong>${this.getTypeLabel(mostLikedType)}</strong>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('planet-stats', PlanetStats);

export default PlanetStats;
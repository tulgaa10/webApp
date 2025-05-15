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
    this._activeFilter = localStorage.getItem('planet-filter') || 'all';
    this._currentTheme = localStorage.getItem('theme') || 'light';
    
    this.handlePlanetLiked = this.handlePlanetLiked.bind(this);
    this.handlePlanetsLoaded = this.handlePlanetsLoaded.bind(this);
    this.handleStatCardClick = this.handleStatCardClick.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
  }
  
  get stats() {
    return this._stats;
  }
  
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
    
    // Listen for filter-changed events
    document.addEventListener('filter-changed', (event) => {
      this._activeFilter = event.detail.selected;
      this.render();
    });
    
    // Listen for theme-changed events
    document.addEventListener('theme-changed', this.handleThemeChange);

    // Check for current theme
    this._currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    this.render();
  }
  
  disconnectedCallback() {
    // Clean up event listeners when component is removed
    document.removeEventListener('planet-liked', this.handlePlanetLiked);
    document.removeEventListener('planets-loaded', this.handlePlanetsLoaded);
    document.removeEventListener('filter-changed', this.handleFilterChanged);
    document.removeEventListener('theme-changed', this.handleThemeChange);
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
      this.savePlanets();
    } else {

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === `like-${id}` && JSON.parse(localStorage.getItem(key))) {
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
  
  handleStatCardClick(event) {
    const card = event.currentTarget;
    const filterType = card.dataset.filter;
    
    if (filterType) {
      // Toggle filter - if already active, reset to 'all'
      const newFilter = (this._activeFilter === filterType) ? 'all' : filterType;
      this._activeFilter = newFilter;
      
      // Save filter to localStorage
      localStorage.setItem('planet-filter', newFilter);
      
      // Dispatch filter-changed event to notify other components
      // For liked filter, we need to include additional info to help other components filter properly
      const eventDetail = {
        selected: newFilter
      };
      
      // For the 'liked' filter, we need to add the list of liked planet IDs
      if (newFilter === 'liked') {
        // Get all liked planet IDs from localStorage
        const likedPlanetIds = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('like-')) {
            const isLiked = JSON.parse(localStorage.getItem(key));
            if (isLiked) {
              likedPlanetIds.push(key.replace('like-', ''));
            }
          }
        }
        eventDetail.likedPlanetIds = likedPlanetIds;
      }
      
      this.dispatchEvent(new CustomEvent('filter-changed', {
        bubbles: true,
        composed: true,
        detail: eventDetail
      }));
      
      this.render();
    }
  }
  
  handleThemeChange(event) {
    // Update the component's theme tracking
    this._currentTheme = event.detail.theme;
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
      'liked': 'Таалагдсан',
      'all': 'Бүгд',
      'default': 'Бусад'
    };
    
    return labels[type] || labels.default;
  }
  
  getFilterTypeFromLabel(label) {
    if (label === 'Хамгийн ойрхон') return 'close';
    if (label === 'Амьдрах боломжтой') return 'habitable';
    if (label === 'Супер дэлхий') return 'super-earth';
    if (label === 'Таалагдсан') return 'liked';
    if (label === 'Бүгд') return 'all';
    return '';
  }
  
  // Generate planet texture SVG for background
  getPlanetTexture(type) {
    const textures = {
      'all': `
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="planetGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
              <stop offset="0%" stop-color="#3498db" stop-opacity="1" />
              <stop offset="80%" stop-color="#2980b9" stop-opacity="1" />
              <stop offset="100%" stop-color="#1a5276" stop-opacity="1" />
            </radialGradient>
            <filter id="planetNoise" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="1" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#planetGradient)" filter="url(#planetNoise)" />
          <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" transform="rotate(-25,50,50)" />
          <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" transform="rotate(15,50,50)" />
        </svg>
      `,
      'liked': `
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="likedPlanetGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
              <stop offset="0%" stop-color="#ff5e5e" stop-opacity="1" />
              <stop offset="80%" stop-color="#e74c3c" stop-opacity="1" />
              <stop offset="100%" stop-color="#c0392b" stop-opacity="1" />
            </radialGradient>
            <filter id="likedNoise" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="2" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#likedPlanetGradient)" filter="url(#likedNoise)" />
          <path d="M50,25 C55,35 65,40 75,40 C65,50 65,65 50,75 C35,65 35,50 25,40 C35,40 45,35 50,25" fill="#ff8a8a" transform="scale(0.6) translate(33, 30)" />
        </svg>
      `,
      'habitable': `
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="habitablePlanetGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stop-color="#2ecc71" stop-opacity="1" />
              <stop offset="70%" stop-color="#27ae60" stop-opacity="1" />
              <stop offset="100%" stop-color="#1e8449" stop-opacity="1" />
            </radialGradient>
            <filter id="habitableNoise" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale="6" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#habitablePlanetGradient)" filter="url(#habitableNoise)" />
          <path d="M30,40 Q50,20 70,40 T70,60 Q50,75 30,60 T30,40" fill="#3498db" fill-opacity="0.5" />
          <path d="M25,50 Q40,35 45,55 T65,65 Q60,70 35,65 T25,50" fill="#3498db" fill-opacity="0.4" />
        </svg>
      `,
      'close': `
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="closePlanetGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
              <stop offset="0%" stop-color="#f39c12" stop-opacity="1" />
              <stop offset="70%" stop-color="#e67e22" stop-opacity="1" />
              <stop offset="100%" stop-color="#d35400" stop-opacity="1" />
            </radialGradient>
            <filter id="closeNoise" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="4" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#closePlanetGradient)" filter="url(#closeNoise)" />
          <circle cx="65" cy="35" r="10" fill="#f5b041" fill-opacity="0.5" />
          <circle cx="35" cy="60" r="8" fill="#f5b041" fill-opacity="0.3" />
          <ellipse cx="50" cy="50" rx="45" ry="8" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1" transform="rotate(30,50,50)" />
        </svg>
      `,
      'super-earth': `
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="superEarthGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
              <stop offset="0%" stop-color="#9b59b6" stop-opacity="1" />
              <stop offset="70%" stop-color="#8e44ad" stop-opacity="1" />
              <stop offset="100%" stop-color="#6c3483" stop-opacity="1" />
            </radialGradient>
            <filter id="superEarthNoise" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="5" seed="5" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#superEarthGradient)" filter="url(#superEarthNoise)" />
          <ellipse cx="50" cy="50" rx="48" ry="5" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
          <ellipse cx="50" cy="50" rx="42" ry="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" transform="rotate(60,50,50)" />
        </svg>
      `
    };
    
    return textures[type] || textures['all'];
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
          margin: 1.5rem 0;
        }
        
        /* CSS Variables for Light/Dark Mode */
        :host {
          /* Light Mode Default */
          --stats-bg-light: rgba(255, 255, 255, 0.6);
          --stats-bg-dark: rgba(15, 23, 42, 0.6);
          --card-bg-light: rgba(224, 231, 255, 0.4);
          --card-bg-dark: rgba(30, 41, 59, 0.4);
          --text-light: #1e293b;
          --text-dark: #e2e8f0;
          --heading-light: #2563eb;
          --heading-dark: #60a5fa;
          --accent-light: #3b82f6;
          --accent-dark: #38bdf8;
          --secondary-light: #8b5cf6;
          --secondary-dark: #a78bfa;
          --progress-bg-light: rgba(203, 213, 225, 0.3);
          --progress-bg-dark: rgba(71, 85, 105, 0.3);
          --active-card-border-light: rgba(59, 130, 246, 0.8);
          --active-card-border-dark: rgba(56, 189, 248, 0.8);
          --active-card-shadow-light: 0 0 15px rgba(59, 130, 246, 0.4);
          --active-card-shadow-dark: 0 0 15px rgba(56, 189, 248, 0.4);
          
          /* Planet colors */
          --planet-all-color: #3498db;
          --planet-liked-color: #e74c3c;
          --planet-habitable-color: #2ecc71;
          --planet-close-color: #e67e22;
          --planet-super-earth-color: #9b59b6;
          
          /* Default to Light Mode */
          --stats-bg: var(--stats-bg-light);
          --card-bg: var(--card-bg-light);
          --text-color: var(--text-light);
          --heading-color: var(--heading-light);
          --accent-color: var(--accent-light);
          --secondary-color: var(--secondary-light);
          --progress-bg: var(--progress-bg-light);
          --active-card-border: var(--active-card-border-light);
          --active-card-shadow: var(--active-card-shadow-light);
        }
      </style>
      
      <style>
        /* Apply theme based on the current theme state */
        ${this._currentTheme === 'dark' ? `
          :host {
            --stats-bg: var(--stats-bg-dark);
            --card-bg: var(--card-bg-dark);
            --text-color: var(--text-dark);
            --heading-color: var(--heading-dark);
            --accent-color: var(--accent-dark);
            --secondary-color: var(--secondary-dark);
            --progress-bg: var(--progress-bg-dark);
            --active-card-border: var(--active-card-border-dark);
            --active-card-shadow: var(--active-card-shadow-dark);
          }
        ` : `
          :host {
            --stats-bg: var(--stats-bg-light);
            --card-bg: var(--card-bg-light);
            --text-color: var(--text-light);
            --heading-color: var(--heading-light);
            --accent-color: var(--accent-light);
            --secondary-color: var(--secondary-light);
            --progress-bg: var(--progress-bg-light);
            --active-card-border: var(--active-card-border-light);
            --active-card-shadow: var(--active-card-shadow-light);
          }
        `}

        .stats-container {
          background: var(--stats-bg);
          backdrop-filter: blur(5px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1);
          color: var(--text-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        /* Space Background Effect */
        .stats-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse at center, rgba(16, 16, 49, 0.3) 0%, transparent 70%),
                      radial-gradient(ellipse at 80% 30%, rgba(120, 0, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(ellipse at 20% 70%, rgba(0, 120, 255, 0.1) 0%, transparent 50%);
          z-index: -1;
          pointer-events: none;
          animation: cosmic-pulse 15s infinite alternate;
        }
        
        @keyframes cosmic-pulse {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        /* Star effect */
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.6;
          z-index: -1;
          box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.4);
          animation: twinkle var(--duration, 4s) infinite ease-in-out;
        }
        
        .shooting-star {
          position: absolute;
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
          z-index: -1; 
          transform: rotate(var(--rotation, 45deg));
          animation: shoot var(--duration, 6s) infinite ease-out var(--delay, 0s);
          opacity: 0;
        }
        
        @keyframes shoot {
          0% { transform: translateX(-100px) translateY(-100px) rotate(var(--rotation)); opacity: 1; }
          20% { transform: translateX(300px) translateY(300px) rotate(var(--rotation)); opacity: 0; }
          100% { transform: translateX(300px) translateY(300px) rotate(var(--rotation)); opacity: 0; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        h3 {
          color: var(--heading-color);
          margin-top: 0;
          text-align: center;
          font-size: 1.5rem;
          letter-spacing: 0.5px;
          position: relative;
          text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
          margin-bottom: 1.5rem;
        }
        
        h3::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
        }
        
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        .stat-card {
          background: var(--card-bg);
          padding: 0.6rem 0.6rem;
          border-radius: 50%; /* Make it completely round */
          aspect-ratio: 1/1; /* Force a 1:1 aspect ratio (perfect circle) */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
          user-select: none;
          text-align: center;
          backdrop-filter: blur(3px);
        }
        
        /* Planet background */
        .planet-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0.85;
          transition: transform 0.5s ease;
        }
        
        /* Card Rings */
        .ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: rotate var(--duration, 20s) linear infinite;
        }
        
        .stat-card[data-filter="all"] .ring { border-color: rgba(52, 152, 219, 0.3); }
        .stat-card[data-filter="liked"] .ring { border-color: rgba(231, 76, 60, 0.3); }
        .stat-card[data-filter="habitable"] .ring { border-color: rgba(46, 204, 113, 0.3); }
        .stat-card[data-filter="close"] .ring { border-color: rgba(230, 126, 34, 0.3); }
        .stat-card[data-filter="super-earth"] .ring { border-color: rgba(155, 89, 182, 0.3); }
        
        @keyframes rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .stat-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .stat-card:hover .planet-bg {
          transform: scale(1.1) rotate(10deg);
        }
        
        .stat-card.active {
          border: 2px solid var(--active-card-border);
          box-shadow: var(--active-card-shadow);
          z-index: 1;
        }
        
        /* Active indicator */
        .stat-card.active::before {
          content: '✓';
          position: absolute;
          top: 10px;
          right: 10px;
          background: var(--accent-color);
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
        
        /* Planet orbit animation on hover */
        .stat-card::after {
          content: '';
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px dotted var(--accent-color);
          opacity: 0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.5);
          transition: all 0.5s ease;
          pointer-events: none;
        }
        
        .stat-card:hover::after {
          opacity: 0.3;
          transform: translate(-50%, -50%) scale(1.5);
          animation: orbit 8s linear infinite;
        }
        
        @keyframes orbit {
          0% { transform: translate(-50%, -50%) scale(1.5) rotate(0deg); }
          100% { transform: translate(-50%, -50%) scale(1.5) rotate(360deg); }
        }
        
        .stat-value {
          font-size: 2.2rem;
          font-weight: bold;
          color: var(--accent-color);
          margin: 0.5rem 0;
          text-shadow: 0 0 5px rgba(56, 189, 248, 0.3);
        }
        
        .stat-label {
          font-size: 1rem;
          text-align: center;
          font-weight: 500;
          margin-bottom: 0.3rem;
          max-width: 90%;
        }
        
        .stat-progress {
          width: 80%;
          height: 8px;
          background: var(--progress-bg);
          border-radius: 10px;
          margin-top: 0.5rem;
          overflow: hidden;
          position: relative;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
          width: ${likePercentage}%;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }
        
        /* Shimmer effect on progress bar */
        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .favorite-type {
          margin-top: 1.5rem;
          text-align: center;
          font-style: italic;
          padding: 0.8rem;
          background: var(--card-bg);
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .favorite-type strong {
          color: var(--accent-color);
          font-weight: bold;
        }
        
        .filter-status {
          text-align: center;
          margin-top: 1rem;
          padding: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-color);
          opacity: 0.85;
        }
        
        .filter-status strong {
          color: var(--accent-color);
        }
        
        .reset-filter {
          background: transparent;
          border: none;
          color: var(--accent-color);
          text-decoration: underline;
          cursor: pointer;
          font-size: 0.9rem;
          margin-left: 5px;
          padding: 0;
        }
        
        .reset-filter:hover {
          color: var(--secondary-color);
        }
        
        .filter-hint {
          text-align: center;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          color: var(--text-color);
          opacity: 0.75;
        }
      </style>
      
      <div class="stats-container">
        <!-- Random stars background effect -->
        ${Array.from({length: 15}, (_, i) => {
          const size = Math.random() * 3 + 1;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const duration = Math.random() * 4 + 3;
          return `<div class="star" style="width: ${size}px; height: ${size}px; top: ${top}%; left: ${left}%; --duration: ${duration}s"></div>`;
        }).join('')}
        
        <h3>Гаригуудын статистик</h3>
        
        <div class="stats-grid">
          <div class="stat-card ${this._activeFilter === 'all' ? 'active' : ''}" data-filter="all">
            <div class="stat-label">Нийт гариг</div>
            <div class="stat-value">${totalPlanets}</div>
          </div>
          
          <div class="stat-card ${this._activeFilter === 'liked' ? 'active' : ''}" data-filter="liked">
            <div class="stat-label">Таалагдсан</div>
            <div class="stat-value">${likedPlanets}</div>
            <div class="stat-progress">
              <div class="progress-bar"></div>
            </div>
          </div>
          
          <div class="stat-card ${this._activeFilter === 'habitable' ? 'active' : ''}" data-filter="habitable">
            <div class="stat-label">Амьдрах боломжтой</div>
            <div class="stat-value">${habitablePlanets}</div>
          </div>
          
          <div class="stat-card ${this._activeFilter === 'super-earth' ? 'active' : ''}" data-filter="super-earth">
            <div class="stat-label">Супер дэлхий</div>
            <div class="stat-value">${superEarthPlanets}</div>
          </div>
          <div class="stat-card ${this._activeFilter === 'close' ? 'active' : ''}" data-filter="close">
            <div class="stat-label">Хамгийн ойрхон</div>
          </div>
        </div>
        
        ${this._activeFilter !== 'all' ? `
          <div class="filter-status">
            Шүүлт идэвхтэй: <strong>${this.getTypeLabel(this._activeFilter)}</strong>
          </div>
        ` : ''}
        
        <div class="filter-hint">Гаригуудыг шүүхийн тулд статистикийн тойрог дээр дарна уу</div>
        
        ${mostLikedType ? `
          <div class="favorite-type">
            Хамгийн ихээр таалагдсан төрөл: <strong>${this.getTypeLabel(mostLikedType)}</strong>
          </div>
        ` : ''}
      </div>
    `;
    
    // Add event listeners to stat cards
    const statCards = this.shadowRoot.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      card.addEventListener('click', this.handleStatCardClick);
    });
  }
}

customElements.define('planet-stats', PlanetStats);

export default PlanetStats;

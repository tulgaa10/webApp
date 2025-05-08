class PlanetCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
    this._liked = false;
    this._theme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Bind the theme change handler to this instance
    this._handleThemeChange = this._handleThemeChange.bind(this);
  }
  
  // Property to get/set the planet data
  get data() {
    return this._data;
  }
  
  set data(value) {
    this._data = value;
    this._liked = JSON.parse(localStorage.getItem(`like-${this._data.id}`)) || false;
    this.render();
  }
  
  connectedCallback() {
    try {
      if (this.getAttribute('data')) {
        this._data = JSON.parse(this.getAttribute('data'));
        this._liked = JSON.parse(localStorage.getItem(`like-${this._data.id}`)) || false;
      }
      
      // Listen for theme change events
      window.addEventListener('theme-changed', this._handleThemeChange);
      document.addEventListener('theme-changed', this._handleThemeChange);
      
      this.render();
    } catch (e) {
      console.error('Error parsing planet data:', e);
    }
  }
  
  disconnectedCallback() {
    // Clean up event listeners when component is removed
    window.removeEventListener('theme-changed', this._handleThemeChange);
    document.removeEventListener('theme-changed', this._handleThemeChange);
  }
  
  _handleThemeChange(event) {
    if (event.detail && event.detail.theme) {
      this._theme = event.detail.theme;
      this.render();
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) {
      try {
        this._data = JSON.parse(newValue);
        this._liked = JSON.parse(localStorage.getItem(`like-${this._data.id}`)) || false;
        this.render();
      } catch (e) {
        console.error('Error parsing planet data:', e);
      }
    }
  }
  
  static get observedAttributes() {
    return ['data'];
  }
  
  toggleLike() {
    if (!this._data) return;
    
    this._liked = !this._liked;
    localStorage.setItem(`like-${this._data.id}`, JSON.stringify(this._liked));
    
    // Dispatch custom event when like status changes
    this.dispatchEvent(new CustomEvent('planet-liked', {
      detail: { 
        id: this._data.id,
        name: this._data.name,
        type: this._data.type, 
        liked: this._liked 
      },
      bubbles: true,
      composed: true 
    }));
    
    this.render();
  }
  
  navigateToPlanetPage(e) {
    // Only navigate if the click wasn't on the like button
    if (!e.target.closest('.like-btn')) {
      window.location.hash = this._data.id;
    }
  }
  
  render() {
    if (!this._data) return;
    
    // Define CSS variables based on current theme
    const themeStyles = this._theme === 'dark' ? `
      --card-bg: rgba(13, 20, 45, 0.85);
      --card-border: rgba(65, 132, 244, 0.3);
      --card-shadow: 0 10px 25px rgba(0, 50, 255, 0.2);
      --card-hover-shadow: 0 15px 35px rgba(0, 60, 255, 0.4);
      --heading-color: rgb(132, 195, 250);
      --text-color: rgb(200, 210, 255);
      --accent-color: rgb(0, 195, 255);
      --accent-hover: rgb(50, 210, 255);
      --secondary-color: rgb(255, 153, 0);
      --btn-bg: rgba(0, 20, 70, 0.5);
      --btn-color: rgb(0, 195, 255);
      --btn-active-bg: rgb(0, 195, 255);
      --btn-active-text: rgb(5, 20, 50);
      --planet-type-bg: rgba(0, 60, 120, 0.5);
      --planet-type-text: rgb(200, 230, 255);
    ` : `
      --card-bg: rgba(240, 245, 255, 0.9);
      --card-border: rgba(100, 149, 245, 0.3);
      --card-shadow: 0 10px 25px rgba(30, 80, 255, 0.2);
      --card-hover-shadow: 0 15px 35px rgba(30, 80, 255, 0.3);
      --heading-color: rgb(25, 55, 160);
      --text-color: rgb(50, 50, 80);
      --accent-color: rgb(65, 105, 225);
      --accent-hover: rgb(100, 130, 255);
      --secondary-color: rgb(255, 153, 0);
      --btn-bg: rgba(240, 245, 255, 0.4);
      --btn-color: rgb(65, 105, 225);
      --btn-active-bg: rgb(65, 105, 225);
      --btn-active-text: rgb(255, 255, 255);
      --planet-type-bg: rgba(65, 105, 225, 0.15);
      --planet-type-text: rgb(25, 55, 160);
    `;
    
    // Enhanced space-themed styles with theme support
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          ${themeStyles}
        }
        
        :host(:hover) {
          transform: translateY(-8px);
          box-shadow: var(--card-hover-shadow);
        }
        
        .card {
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
          box-shadow: var(--card-shadow);
        }
        
        .image-container {
          position: relative;
          overflow: hidden;
        }
        
        .image-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 70%, var(--card-bg) 100%);
          pointer-events: none;
        }
        
        img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        
        .card:hover img {
          transform: scale(1.05);
        }
        
        .content {
          padding: 1.2rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }
        
        h3 {
          color: var(--heading-color);
          margin-top: 0;
          margin-bottom: 0.75rem;
          text-align: center;
          font-size: 1.4rem;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(50, 150, 255, 0.3);
        }
        
        p {
          color: var(--text-color);
          margin-bottom: 1.2rem;
          flex-grow: 1;
          line-height: 1.5;
        }
        
        .like-btn {
          background: var(--btn-bg);
          border: 1px solid var(--btn-color);
          border-radius: 20px;
          padding: 8px 16px;
          color: var(--btn-color);
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          margin-top: auto;
          z-index: 2;
          backdrop-filter: blur(5px);
        }
        
        .like-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 150, 255, 0.3);
          border-color: var(--accent-hover);
          color: var(--accent-hover);
        }
        
        .like-btn.liked {
          background: var(--btn-active-bg);
          color: var(--btn-active-text);
          border-color: var(--btn-active-bg);
        }
        
        .planet-type {
          font-size: 0.75rem;
          padding: 5px 12px;
          border-radius: 20px; 
          display: inline-block;
          margin-bottom: 10px;
          color: var(--planet-type-text);
          background: var(--planet-type-bg);
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(0, 60, 255, 0.15);
        }
        
        .view-details {
          text-align: center;
          margin-top: 10px;
          font-size: 0.85rem;
          color: var(--accent-color);
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }
        
        .card:hover .view-details {
          opacity: 1;
        }
        
        /* Star decoration */
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          filter: blur(1px);
          opacity: 0.8;
          z-index: 0;
        }
        .star:nth-child(1) { top: 10%; left: 15%; width: 2px; height: 2px; animation: twinkle 3s infinite; }
        .star:nth-child(2) { top: 20%; right: 25%; width: 1px; height: 1px; animation: twinkle 2.5s infinite 0.5s; }
        .star:nth-child(3) { bottom: 30%; left: 10%; width: 1.5px; height: 1.5px; animation: twinkle 4s infinite 1s; }
        .star:nth-child(4) { bottom: 15%; right: 20%; width: 1px; height: 1px; animation: twinkle 3.5s infinite 1.5s; }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      </style>
      
      <div class="card">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        
        <div class="image-container">
          <img src="${this._data.image}" alt="${this._data.name}">
        </div>
        
        <div class="content">
          <h3>${this._data.name}</h3>
          <div class="planet-type">${this.getTypeLabel(this._data.type)}</div>
          <p>${this._data.description}</p>
          <button class="like-btn ${this._liked ? 'liked' : ''}">
            ${this._liked ? '❤' : '🤍'} 
            ${this._liked ? 'Таалагдсан' : 'Таалагдах'}
          </button>
          <div class="view-details">Дэлгэрэнгүй мэдээлэл үзэх</div>
        </div>
      </div>
    `;
    
    this.shadowRoot.querySelector('.like-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleLike();
    });
    
    this.shadowRoot.querySelector('.card').addEventListener('click', (e) => this.navigateToPlanetPage(e));
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
}

customElements.define('planet-card', PlanetCard);

export default PlanetCard;

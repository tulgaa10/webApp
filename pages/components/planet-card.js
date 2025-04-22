class PlanetCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
    this._liked = false;
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
        this.render();
      }
    } catch (e) {
      console.error('Error parsing planet data:', e);
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
      composed: true // allows the event to cross shadow DOM boundary
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
    
    // Theme variables from root will be applied here
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.3s ease;
          background: var(--color-card, rgba(30, 30, 70, 0.7));
        }
        
        :host(:hover) {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg, 0 10px 25px rgba(0, 0, 255, 0.3));
        }
        
        .card {
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }
        
        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
        
        .content {
          padding: 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        h3 {
          color: var(--color-heading, rgb(132, 195, 250, 0.5));
          margin-top: 0;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        p {
          color: var(--color-text, #ffffff);
          margin-bottom: 1rem;
          flex-grow: 1;
        }
        
        .like-btn {
          background: transparent;
          border: 1px solid currentColor;
          border-radius: 5px;
          padding: 8px 12px;
          color: var(--color-accent, #00ffff);
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.2s ease;
          margin-top: auto;
          z-index: 2;
        }
        
        .like-btn:hover {
          color: var(--color-secondary, rgb(255, 153, 0));
        }
        
        .like-btn.liked {
          background: var(--color-accent, #00ffff);
          color: var(--color-primary, #021a61);
        }
        
        .planet-type {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 10px; 
          display: inline-block;
          margin-bottom: 8px;
          color: white;
          background: var(--color-primary, #021a61);
        }
        
        .view-details {
          text-align: center;
          margin-top: 8px;
          font-size: 14px;
          color: var(--color-accent, #00ffff);
        }
      </style>
      
      <div class="card">
        <img src="${this._data.image}" alt="${this._data.name}">
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
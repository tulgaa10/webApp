class PlanetFilter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._options = [];
    this._selected = localStorage.getItem('planet-filter') || 'all';
    this._theme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Bind the theme change handler to this instance
    this._handleThemeChange = this._handleThemeChange.bind(this);
  }
  
  // Property to get/set the filter options
  get options() {
    return this._options;
  }
  
  set options(value) {
    this._options = value;
    this.render();
  }
  
  // Property to get/set the selected filter
  get selected() {
    return this._selected;
  }
  
  set selected(value) {
    if (this._selected !== value) {
      this._selected = value;
      localStorage.setItem('planet-filter', value);
      this.render();
      
      // Dispatch custom event when selection changes
      this.dispatchEvent(new CustomEvent('filter-changed', {
        detail: { selected: value },
        bubbles: true
      }));
    }
  }
  
  connectedCallback() {
    try {
      if (this.getAttribute('options')) {
        this._options = JSON.parse(this.getAttribute('options'));
      }
      
      if (this.getAttribute('selected')) {
        this._selected = this.getAttribute('selected');
      }
      
      // Listen for theme change events
      window.addEventListener('theme-changed', this._handleThemeChange);
      document.addEventListener('theme-changed', this._handleThemeChange);
      
      this.render();
    } catch (e) {
      console.error('Error parsing filter options:', e);
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
    if (name === 'options' && oldValue !== newValue) {
      try {
        this._options = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Error parsing filter options:', e);
      }
    }
    
    if (name === 'selected' && oldValue !== newValue) {
      this._selected = newValue;
      this.render();
    }
  }
  
  static get observedAttributes() {
    return ['options', 'selected'];
  }
  
  handleChange(e) {
    this.selected = e.target.value;
  }
  
  render() {
    if (!this._options || !this._options.length) return;
    
    const optionsHtml = this._options
      .map(option => `<option value="${option.value}" ${this._selected === option.value ? 'selected' : ''}>${option.label}</option>`)
      .join('');
    
    // Define CSS variables based on current theme
    const themeStyles = this._theme === 'dark' ? `
      --filter-label: rgb(150, 200, 255);
      --filter-bg: rgba(15, 25, 50, 0.8);
      --filter-border: rgba(65, 132, 244, 0.4);
      --filter-text: rgb(200, 220, 255);
      --filter-shadow: 0 2px 10px rgba(0, 50, 200, 0.2);
      --filter-hover-border: rgba(0, 195, 255, 0.8);
      --option-hover-bg: rgba(0, 100, 255, 0.2);
      --option-selected-bg: rgba(0, 130, 255, 0.3);
    ` : `
      --filter-label: rgb(30, 50, 100);
      --filter-bg: rgba(240, 245, 255, 0.9);
      --filter-border: rgba(100, 150, 255, 0.5);
      --filter-text: rgb(30, 50, 100);
      --filter-shadow: 0 2px 10px rgba(30, 100, 255, 0.15);
      --filter-hover-border: rgba(65, 105, 225, 0.8);
      --option-hover-bg: rgba(65, 105, 225, 0.1);
      --option-selected-bg: rgba(65, 105, 225, 0.2);
    `;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 1rem 0;
          ${themeStyles}
        }
        
        .filter-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 40px;
          background: var(--filter-bg);
          padding: 6px 18px;
          box-shadow: var(--filter-shadow);
          backdrop-filter: blur(8px);
          border: 1px solid var(--filter-border);
          transition: all 0.3s ease;
        }
        
        .filter-container:hover {
          border-color: var(--filter-hover-border);
          box-shadow: 0 4px 15px rgba(0, 100, 255, 0.2);
        }
        
        label {
          font-weight: 500;
          color: var(--filter-label);
          font-size: 0.95rem;
          user-select: none;
          display: flex;
          align-items: center;
        }
        
        /* Galaxy icon before label */
        label::before {
          content: '🌌';
          margin-right: 8px;
          font-size: 1.2rem;
        }
        
        .filter-select {
          background: transparent;
          border: none;
          color: var(--filter-text);
          font-size: 0.95rem;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          outline: none;
          appearance: none;
          position: relative;
          min-width: 150px;
          transition: all 0.2s ease;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' fill='none'%3E%3Cpath d='M6 6L0 0h12L6 6z' fill='%234169E1'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 28px;
        }
        
        .filter-select:hover {
          background-color: var(--option-hover-bg);
        }
        
        .filter-select:focus {
          box-shadow: 0 0 0 2px var(--filter-hover-border);
        }
        
        /* Style for custom select dropdown (works in most modern browsers) */
        .filter-select option {
          background-color: var(--filter-bg);
          color: var(--filter-text);
          padding: 8px;
        }
        
        .filter-select option:hover,
        .filter-select option:focus {
          background-color: var(--option-hover-bg);
        }
        
        .filter-select option:checked {
          background-color: var(--option-selected-bg);
        }
        
        /* Star decoration */
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      </style>
      
      <div class="filter-container">
        <label for="planet-filter">Ангилал:</label>
        <select id="planet-filter" class="filter-select">
          ${optionsHtml}
        </select>
      </div>
    `;
    
    this.shadowRoot.querySelector('#planet-filter').addEventListener('change', (e) => this.handleChange(e));
  }
}

customElements.define('planet-filter', PlanetFilter);

export default PlanetFilter;

class PlanetFilter extends HTMLElement {
    constructor() {
      super();
      this._options = [];
      this._selected = localStorage.getItem('planet-filter') || 'all';
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
        
        this.render();
      } catch (e) {
        console.error('Error parsing filter options:', e);
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
      
      this.innerHTML = `
        <div class="filter-container">
          <label for="planet-filter">Ангилал:</label>
          <select id="planet-filter" class="filter-select">
            ${optionsHtml}
          </select>
        </div>
      `;
      
      this.querySelector('#planet-filter').addEventListener('change', (e) => this.handleChange(e));
    }
  }
  
  customElements.define('planet-filter', PlanetFilter);
  
  export default PlanetFilter;
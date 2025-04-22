class AppRouter extends HTMLElement {
    constructor() {
      super();
      this.routes = {
        '': 'home-page',
        'home': 'home-page',
        'kepler-22b': 'kepler-page',
        'proxima-centauri-b': 'proxima-page',
        'trappist-1e': 'trappist-page',
        'gliese-581g': 'gliese-page'
      };
    }
  
    connectedCallback() {
      window.addEventListener('hashchange', () => this.onRouteChanged());
      this.onRouteChanged();
    }
  
    onRouteChanged() {
      const path = window.location.hash.slice(1) || '';
      
      // Find the component name to load
      const componentName = this.routes[path] || 'home-page';
      
      // Dynamically import the component if not already loaded
      this.loadComponent(componentName).then(() => {
        // Clear and render the new component
        this.innerHTML = `<${componentName}></${componentName}>`;
      });
    }
    
    async loadComponent(componentName) {
      // Only try to import if the component isn't already defined
      if (!customElements.get(componentName)) {
        try {
          // Convert component name to file path
          await import(`./pages/${componentName}.js`);
        } catch (error) {
          console.error(`Failed to load component: ${componentName}`, error);
        }
      }
      return true;
    }
  }
  
  customElements.define('app-router', AppRouter);
  
  export default AppRouter;
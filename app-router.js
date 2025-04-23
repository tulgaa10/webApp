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

  async onRouteChanged() {
    const path = window.location.hash.slice(1);
    const componentName = this.routes[path] || 'home-page';

    try {
      await this.loadComponent(componentName);
      this.renderComponent(componentName);
    } catch (err) {
      console.error('Routing error:', err);
      this.innerHTML = `<div class="error">Page not found</div>`;
    }
  }

  async loadComponent(name) {
    if (!customElements.get(name)) {
      try {
        await import(`./pages/${name}.js`);
      } catch (error) {
        throw new Error(`Failed to import ${name}: ${error.message}`);
      }
    }
  }

  renderComponent(name) {
    this.innerHTML = `<${name}></${name}>`;
  }
}

customElements.define('app-router', AppRouter);
export default AppRouter;

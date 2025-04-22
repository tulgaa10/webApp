import './app-router.js';

class AppRoot extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<app-router></app-router>`;
  }
}
customElements.define('app-root', AppRoot);
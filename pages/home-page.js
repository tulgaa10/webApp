import './components/planet-card.js';
import './components/planet-filter.js';
import './components/profile-summary.js';
import './components/planet-stats.js';
import apiService from './services/api-service.js';
class HomePage extends HTMLElement {
  constructor() {
    super();
    this.planets = [];
    this.filterOptions = [];
    
    // Get the initial filter from localStorage
    this.currentFilter = localStorage.getItem('planet-filter') || 'all';
    this.isLoading = true;
  }

  async connectedCallback() {
    // Initial render with loading state
    this.render();
    
    // Listen for filter change events
    this.addEventListener('filter-changed', (event) => {
      this.currentFilter = event.detail.selected;
      this.renderPlanets();
    });
    
    try {
      // Load data from API
      const [planets, filterOptions] = await Promise.all([
        apiService.getPlanets(),
        apiService.getFilterOptions()
      ]);
      
      this.planets = planets;
      this.filterOptions = filterOptions;
      this.isLoading = false;
      
      // Dispatch planets-loaded event for components that need to know about planets
      this.dispatchEvent(new CustomEvent('planets-loaded', {
        bubbles: true,
        detail: { 
          planets: this.planets 
        }
      }));
      
      // Re-render with data
      this.render();
      setTimeout(() => this.renderPlanets(), 0);
      } catch (error) {
      console.error('Failed to load initial data:', error);
      this.isLoading = false;
      this.render();
    }
  }
  
  // Filter planets based on the current filter
  getFilteredPlanets() {
    if (this.currentFilter === 'all') {
      return this.planets;
    } else {
      return this.planets.filter(planet => planet.type === this.currentFilter);
    }
  }
  
  // Render the planets section
  renderPlanets() {
    const container = this.querySelector('.planets-container');
    if (!container) return;
    
    if (this.isLoading) {
      container.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Гаригуудын мэдээлэл ачааллаж байна...</p>
        </div>
      `;
      return;
    }
    
    const filteredPlanets = this.getFilteredPlanets();
    
    if (filteredPlanets.length === 0) {
      container.innerHTML = '<p>Хайлтад тохирох гаригууд олдсонгүй.</p>';
      return;
    }
    
    // Map the filtered planets to planet-card elements
    container.innerHTML = filteredPlanets.map(planet => {
      // Safely encode JSON to prevent issues with quotes
      const planetData = JSON.stringify(planet).replace(/'/g, '&#39;');
      return `<planet-card data='${planetData}'></planet-card>`;
    }).join('');
  }

  render() {
    this.innerHTML = `
      <div class="container">
        <div class="galaxy-background">
          <h2>Орчлон ертөнцийн гайхамшгийг нээцгээе</h2>
        </div>

        <!-- Entertainment Section -->
        <section id="entertainment">
          <h2>Энтертейнмент</h2>
          <div class="grid-container">
            <article>
              <a href="https://www.youtube.com/watch?v=zSWdZVtXT7E" target="_blank" class="video-link">
                <img src="images/space-movie.jpg" alt="Space Movie">
                <div class="play-button"></div>
              </a>
              <h3>Шилдэг сансрын киноны жагсаалт</h3>
              <p>Хамгийн шинжлэх ухааны үнэн зөв сансрын кино.</p>
            </article>
            <article>
              <a href="https://www.youtube.com/watch?v=udFxKZRyQt4" target="_blank" class="video-link">
                <img src="images/neutron-star.jpg" alt="Space Books">
                <div class="play-button"></div>
              </a>
              <h3>Нейтрон од гэж юу вэ?</h3>
              <p>Нейтрон од гэж юу болох манай нарнаас юугаараа ялгаатай талаар олж мэдээрэй.</p>
            </article>
            <article>
              <a href="https://www.youtube.com/watch?v=QqsLTNkzvaY" target="_blank" class="video-link">
                <img src="images/blackholefall.jpg" alt="Space Games">
                <div class="play-button"></div>
              </a>
              <h3>Хэрэв та хар нүхэнд унавал яах вэ?</h3>
              <p>Хар нүх бол орчлон ертөнцийн хамгийн хүчирхэг зүйл бөгөөд тэд үнэхээр хачирхалтай, төвөгтэй юм. Хэрэв та нэг дотор унавал юу болох вэ?.</p>
            </article>
          </div>
        </section>

        <!-- Exoplanets Section -->
        <section id="exoplanets">
          <h2>Экзогаригууд</h2>
          
          <!-- Add our planet-stats component here -->
          <planet-stats></planet-stats>
          
          <div class="filter-section">
            <planet-filter 
              options='${JSON.stringify(this.filterOptions)}' 
              selected="${this.currentFilter}">
            </planet-filter>
            
            <profile-summary></profile-summary>
          </div>
          
          <div class="planets-container">
            <!-- Planets will be rendered here -->
          </div>
        </section>

        <!-- Galaxy Section -->
        <section id="galaxy" class="video-section">
          <h2>Галактик судлал</h2>
          <div class="video-container">
            <video style="width: 100%;" controls poster="images/galaxy-poster.jpg">
              <source src="videos/galaxy-tour.mp4" type="video/mp4">
              <source src="videos/galaxy-tour.webm" type="video/webm">
              Таны вэб хөтөч видео тоглуулах боломжгүй байна.
            </video>
          </div>
          <p style="text-align: center; margin-top: 20px;">Манай Сүүн Зам галактик болон бусад галактикуудаар виртуал аялал хийгээрэй.</p>
        </section>

        <!-- Media Section -->
        <section id="media">
          <h2>Сансрын дуу чимээ</h2>
          <div class="audio-player">
            <h3 class="audio-title">Бархасбадь гаригийн дуу чимээ</h3>
            <audio controls>
              <source src="audio/cosmic-background.mp3" type="audio/mpeg">
              <source src="audio/cosmic-background.ogg" type="audio/ogg">
              Таны вэб хөтөч аудио тоглуулах боломжгүй байна.
            </audio>
            <p style="text-align: center; margin-top: 10px;">Бархасбадь гаригаас ирсэн цахилгаан соронзон долгионыг сонсогдохуйц дууны хэлбэрт хөрвүүлсэн..</p>
          </div>
        </section>
      </div>
    `;
    
    // Add theme toggle functionality
    const themeToggle = document.querySelector('#themeToggle');
    if (!themeToggle) {
      const toggle = document.createElement('button');
      toggle.id = 'themeToggle';
      toggle.className = 'theme-toggle';
      toggle.textContent = '🌞 / 🌙';
      toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
      this.querySelector('.container').prepend(toggle);
    }
  }
}

customElements.define('home-page', HomePage);

export default HomePage;
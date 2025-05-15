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
      this.likedPlanetIds = [];
      
      // Get the initial filter from localStorage
      this.currentFilter = localStorage.getItem('planet-filter') || 'all';
      this.isLoading = true;
      
      // If initial filter is 'liked', we should pre-load liked planet IDs
      if (this.currentFilter === 'liked') {
        this.preloadLikedPlanetIds();
      }
    }
    
    // Helper method to preload liked planet IDs from localStorage
    preloadLikedPlanetIds() {
      this.likedPlanetIds = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('like-')) {
          const isLiked = JSON.parse(localStorage.getItem(key));
          if (isLiked) {
            this.likedPlanetIds.push(key.replace('like-', ''));
          }
        }
      }
    }
    async connectedCallback() {
      // Initial render with loading state
      this.render();
      
      // Listen for filter change events
      this.addEventListener('filter-changed', (event) => {
        this.currentFilter = event.detail.selected;
        
        // Store the liked planet IDs if provided (for the 'liked' filter)
        if (event.detail.likedPlanetIds) {
          this.likedPlanetIds = event.detail.likedPlanetIds;
        }
        
        localStorage.setItem('planet-filter', this.currentFilter);
        this.renderPlanets();
      });    
      try {

        // Load data from API with fallback to mock data
        try {
          const [planets, filterOptions] = await Promise.all([
            apiService.getPlanets(),
            apiService.getFilterOptions()
          ]);
          
          this.planets = planets;
          this.filterOptions = filterOptions;
        } catch (apiError) {
          console.warn('API call failed:', apiError);
        }
        
        this.isLoading = false;
        
        // Dispatch planets-loaded event for components that need to know about planets
        this.dispatchEvent(new CustomEvent('planets-loaded', {
          bubbles: true,
          detail: {
            planets: this.planets,
            filterOptions: this.filterOptions
          }
        }));

        // Re-render with data
        this.render();
        this.renderPlanets();
      } catch (error) {
        console.error('Failed to load initial data:', error);
        this.isLoading = false;
        this.render();
      }
    }
    
    // Filter planets based on the current filter
  // Filter planets based on the current filter
  getFilteredPlanets() {
    if (this.currentFilter === 'all') {
      return this.planets;
    } else if (this.currentFilter === 'liked') {
      // Filter for liked planets by checking localStorage
      return this.planets.filter(planet => {
        const isLiked = JSON.parse(localStorage.getItem(`like-${planet.id}`)) || false;
        return isLiked;
      });
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
    
    let filteredPlanets = [];
    
    // Apply filtering based on the current filter
    if (this.currentFilter === 'all') {
      filteredPlanets = this.planets;
    } else if (this.currentFilter === 'liked') {
      // If we have pre-loaded likedPlanetIds, use them for efficiency
      if (this.likedPlanetIds && this.likedPlanetIds.length > 0) {
        filteredPlanets = this.planets.filter(planet => 
          this.likedPlanetIds.includes(planet.id.toString())
        );
      } else {
        // Otherwise check localStorage for each planet
        filteredPlanets = this.planets.filter(planet => {
          const isLiked = JSON.parse(localStorage.getItem(`like-${planet.id}`)) || false;
          return isLiked;
        });
      }
    } else {
      filteredPlanets = this.planets.filter(planet => planet.type === this.currentFilter);
    }
    
    if (filteredPlanets.length === 0) {
      container.innerHTML = '<p>Хайлтад тохирох гаригууд олдсонгүй.</p>';
      return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create and append each planet card as a DOM element
    filteredPlanets.forEach(planet => {
      const planetCard = document.createElement('planet-card');
      planetCard.setAttribute('data', JSON.stringify(planet));
      container.appendChild(planetCard);
    });
  }
    render() {
      this.innerHTML = `
        <div class="container">

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
    }
  }

  customElements.define('home-page', HomePage);

  export default HomePage;

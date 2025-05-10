export class ExoplanetExplorer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Экзопланетуудын өгөгдөл
    this.exoplanetsData = [
      {
        id: 1,
        name: "Gliese 581g",
        folderName: "gliese-581g",
        type: "Super-Earth",
        distanceFromEarth: 20.4,
        orbitalPeriod: 32,
        discoveryYear: 2010,
        habitable: "Потенциал амьдрах бүс",
        description: "Gliese 581g нь өөрийн одны амьдрах бүсэд оршдог гэж үздэг. Гэвч одоогоор үүний оршин байгаа эсэх нь маргаантай хэвээр байна.",
        color: "#8B4513",
        image: "Gliese_581_g.jpg"
      },
      {
        id: 2,
        name: "Kepler-22b",
        folderName: "kepler-22b",
        type: "Super-Earth/Mini-Neptune",
        distanceFromEarth: 620,
        orbitalPeriod: 290,
        discoveryYear: 2011,
        habitable: "Амьдрах бүсэд орших",
        description: "Kepler-22b бол одны амьдрах бүсэд орших баталгаатай анхны экзопланет юм. Гэвч энэ нь газрын гадаргуутай планет мөн эсэх нь тодорхойгүй.",
        color: "#228B22",
        image: "Kepler-22_b.jpg"
      },
      {
        id: 3,
        name: "Proxima Centauri b",
        folderName: "proxima-centauri-b",
        type: "Earth-sized",
        distanceFromEarth: 4.2,
        orbitalPeriod: 11.2,
        discoveryYear: 2016,
        habitable: "Боломжит амьдрах бүс",
        description: "Proxima Centauri b нь нарны аймгаас хамгийн ойр орших экзопланет бөгөөд өөрийн одны амьдрах бүсэд оршдог.",
        color: "#4169E1",
        image: "Centaur_b.jpg"
      },
      {
        id: 4,
        name: "TRAPPIST-1e",
        folderName: "trappist-1e",
        type: "Earth-sized",
        distanceFromEarth: 39,
        orbitalPeriod: 6.1,
        discoveryYear: 2017,
        habitable: "Амьдрах бүсэд орших",
        description: "TRAPPIST-1e нь TRAPPIST-1 системийн 7 планетаас нэг бөгөөд амьдрах бүсэд орших, дэлхийтэй хэмжээ ойролцоо планет юм.",
        color: "#800080",
        image: "TRAPPIST-1e.jpg"
      }
    ];
    
    this.selectedPlanet = null;
    this.render();
  }
  
  connectedCallback() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.planet-button');
    buttons.forEach(button => {
      const planetId = button.dataset.id;
      button.addEventListener('click', () => {
        this.selectedPlanet = this.exoplanetsData.find(p => p.id === parseInt(planetId));
        this.render();
      });
    });
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, Arial, sans-serif);
          --primary-color: var(--color-primary, #3366cc);
          --background-color: var(--color-background, #f5f5f5);
          --card-background: var(--color-card, #ffffff);
          --text-color: var(--color-text, #333333);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          text-align: center;
          margin-bottom: 30px;
          color: var(--text-color);
        }
        
        h2 {
          font-size: 24px;
          color: var(--text-color);
          margin-bottom: 20px;
        }
        
        .planet-list-container {
          margin-bottom: 30px;
        }
        
        .planet-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }
        
        .planet-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          padding: 15px;
          background-color: var(--card-background);
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }
        
        .planet-button:hover {
          transform: scale(1.05);
        }
        
        .planet-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-bottom: 10px;
        }
        
        .planet-name {
          font-weight: bold;
          color: var(--text-color);
        }
        
        .planet-info {
          background-color: var(--card-background);
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .info-placeholder {
          text-align: center;
          padding: 40px;
          color: #777;
        }
        
        .planet-detail h2 {
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .planet-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .info-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .info-item {
          margin-bottom: 10px;
        }
        
        .info-label {
          font-weight: bold;
          margin-bottom: 5px;
          color: var(--text-color);
        }
        
        .info-text {
          color: var(--text-color);
        }
        
        .planet-image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }
        
        .planet-image {
          width: 200px;
          height: 200px;
          border-radius: 50%;
        }
        
        .explanation {
          margin-top: 30px;
          background-color: var(--card-background);
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          padding: 20px;
          color: var(--text-color);
        }
        
        @media (max-width: 768px) {
          .planet-info-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      
      <div class="container">
        <h1>Экзопланетууд / Exoplanets</h1>
        
        <div class="planet-list-container">
          <h2>Бусад одны аймгийн гаригууд</h2>
          <div class="planet-list">
            ${this.exoplanetsData.map(planet => `
              <div class="planet-button" data-id="${planet.id}">
                <div class="planet-circle" style="background-color: ${planet.color}"></div>
                <span class="planet-name">${planet.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="planet-info">
          ${this.selectedPlanet ? `
            <div class="planet-detail">
              <h2>${this.selectedPlanet.name}</h2>
              <div class="planet-info-grid">
                <div class="info-column">
                  <div class="info-item">
                    <p class="info-label">Төрөл / Type:</p>
                    <p class="info-text">${this.selectedPlanet.type}</p>
                  </div>
                  <div class="info-item">
                    <p class="info-label">Дэлхийгээс зай / Distance from Earth:</p>
                    <p class="info-text">${this.selectedPlanet.distanceFromEarth} гэрлийн жил</p>
                  </div>
                  <div class="info-item">
                    <p class="info-label">Эргэлтийн хугацаа / Orbital Period:</p>
                    <p class="info-text">${this.selectedPlanet.orbitalPeriod} өдөр</p>
                  </div>
                  <div class="info-item">
                    <p class="info-label">Нээгдсэн он / Discovery Year:</p>
                    <p class="info-text">${this.selectedPlanet.discoveryYear}</p>
                  </div>
                  <div class="info-item">
                    <p class="info-label">Амьдрах боломж / Habitability:</p>
                    <p class="info-text">${this.selectedPlanet.habitable}</p>
                  </div>
                </div>
                <div class="info-column">
                  <div class="info-item">
                    <p class="info-label">Тайлбар / Description:</p>
                    <p class="info-text">${this.selectedPlanet.description}</p>
                  </div>
                  <div class="planet-image-container">
                    <div class="planet-image" style="background-color: ${this.selectedPlanet.color}"></div>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <div class="info-placeholder">
              <p>Экзопланет сонгоно уу / Please select an exoplanet</p>
            </div>
          `}
        </div>
        
        <div class="explanation">
          <h3>Тайлбар / Explanation:</h3>
          <p>Энэ програм нь exoplanets хавтасны мэдээллийг ашиглан бусад одны системд орших гаригуудын мэдээллийг харуулж байна.</p>
          <p>Экзопланет гэдэг нь бидний нарны аймгаас гадна орших, өөр одны эргэн тойронд эргэлдэх гаригуудыг хэлнэ.</p>
          <p>Энд харуулж буй 4 экзопланет нь (Gliese 581g, Kepler-22b, Proxima Centauri b, TRAPPIST-1e) бүгд амьдрах боломжтой бүсэд орших гэж үздэг.</p>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
}

// Custom element тодорхойлох
customElements.define('exoplanet-explorer', ExoplanetExplorer);

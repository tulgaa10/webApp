class ProximaPage extends HTMLElement {
  connectedCallback() {
    // Initial loading state
    this.innerHTML = `<div>Проксима Центавр b-ийн мэдээллийг ачааллаж байна...</div>`;

    // Path to the JSON file
    const jsonPath = './data/planets/proxima-centauri-b.json';
    console.log('Ачааллаж буй зам:', jsonPath);

    // Fetch JSON data
    fetch(jsonPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP алдаа! Статус: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Татсан мэдээлэл:', data);
        // Render the content with fetched data
        this.innerHTML = `
          <div class="galaxy-background">
            <h2>${data.name}</h2>
            <p>${data.description}</p>
          </div>
          <section>
            <h2>Товч мэдээлэл</h2>
            <div class="grid-container">
              <article>
                <img src="exoplanets/proxima-centauri-b/proxima-b-details.jpg" alt="Proxima Centauri b artist impression">
                <h3>Урлагын дүрслэл</h3>
                <p>Проксима Центавр b гаригийн урлагын дүрслэл. Энэ гариг Дэлхийгээс ${data.physicalProperties.mass} дахин их масстай бөгөөд амьдрах боломжтой бүсэд оршдог.</p>
              </article>
              <article>
                <img src="exoplanets/proxima-centauri-b/proxima-system.jpg" alt="Proxima Centauri system">
                <h3>Проксима Центавр систем</h3>
                <p>Проксима Центавр бол ${data.starType} төрлийн од бөгөөд Альфа Центавраар алдартай гурван одны системийн нэг хэсэг юм.</p>
              </article>
              <article>
                <img src="exoplanets/proxima-centauri-b/red-dwarf.jpg" alt="Red dwarf star">
                <h3>Улаан одой од</h3>
                <p>Проксима Центавр нь улаан одой од бөгөөд нарнаас хамаагүй жижиг, хүйтэн од юм.</p>
              </article>
            </div>
          </section>
          <section>
            <h2>Дэлгэрэнгүй мэдээлэл</h2>
            <article class="detailed-info">
              <img src="images/Centaur_b.jpg" alt="${data.name} image" class="planet-photo">
              <div class="info-text">
                <h3>${data.name} гаригийн шинж чанар</h3>
                <p>${data.fullDescription} Энэ гариг Дэлхийгээс ${data.distanceFromEarth} зайд байрладаг.</p>
                <ul>
                  <li>Дэлхийгээс ${data.physicalProperties.mass} дахин их масстай</li>
                  <li>Радиус: Дэлхийгээс ${data.physicalProperties.radius} дахин том</li>
                  <li>Гадаргын температур: ${data.physicalProperties.temperature} Кельвин</li>
                  <li>Таталцал: Дэлхийгээс ${data.physicalProperties.gravity} дахин их</li>
                  <li>Нээгдсэн он: ${data.discoveryYear}</li>
                  <li>Одын төрөл: ${data.starType}</li>
                </ul>
              </div>
            </article>
          </section>
          <section class="video-section">
            <h2>${data.name} тухай видео</h2>
            <div class="video-container">
              <a href="https://www.youtube.com/watch?v=Fg0NX1NW4oQ" target="_blank" class="video-link">
                <img src="exoplanets/proxima-centauri-b/proxima-video.jpg" alt="Proxima Centauri b video">
                <div class="play-button"></div>
              </a>
            </div>
          </section>
        `;
      })
      .catch((error) => {
        console.error('Проксима Центавр b мэдээллийг ачааллахад алдаа гарлаа:', error);
        this.innerHTML = `<div>Проксима Центавр b мэдээллийг ачааллахад алдаа гарлаа. Дэлгэрэнгүй: ${error.message}</div>`;
      });
  }
}

// Define the custom element
customElements.define('proxima-page', ProximaPage);

// Export the class
export default ProximaPage;

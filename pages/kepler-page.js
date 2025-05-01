class KeplerPage extends HTMLElement {
  connectedCallback() {
    // Initial loading state
    this.innerHTML = `<div>Кеплер-22b-ийн мэдээллийг ачааллаж байна...</div>`;

    // Path to the JSON file
    const jsonPath = './data/planets/kepler-22b.json';
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
                <img src="exoplanets/kepler-22b/Kepler-22_b-details.jpg" alt="Kepler-22b artist impression">
                <h3>Урлагын дүрслэл</h3>
                <p>Кеплер-22b гаригийн урлагын дүрслэл. Энэ гариг Дэлхийгээс ${data.physicalProperties.radius} дахин том бөгөөд амьдрах боломжтой бүсэд оршдог.</p>
              </article>
              <article>
                <img[src="exoplanets/kepler-22b/kepler-22-system.jpg" alt="Kepler-22 system">
                <h3>Кеплер-22 систем</h3>
                <p>Кеплер-22 од болон түүний гаригуудын систем. Кеплер-22b нь ${data.starType} төрлийн одыг тойрон эргэлддэг бөгөөд амьдрах боломжтой бүсэд байрладаг.</p>
              </article>
              <article>
                <img src="exoplanets/kepler-22b/habitable-zone.jpg" alt="Habitable zone">
                <h3>Амьдрах боломжтой бүс</h3>
                <p>Кеплер-22b гариг нь одныхоо амьдрах боломжтой бүсэд байрладаг бөгөөд энэ нь гадаргын температур шингэн ус байх боломжийг олгодог.</p>
              </article>
            </div>
          </section>
          <section>
            <h2>Дэлгэрэнгүй мэдээлэл</h2>
            <article style="grid-column: 1 / -1;">
              <h3>${data.name} гаригийн шинж чанар</h3>
              <p>${data.fullDescription} Энэ гариг Дэлхийгээс ${data.distanceFromEarth} зайд байрладаг.</p>
              <ul>
                <li>Дэлхийгээс ${data.physicalProperties.radius} дахин том радиустай</li>
                <li>Одны эргэн тойронд ${data.orbitalPeriod} хоногт нэг эргэлддэг</li>
                <li>Гадаргын дундаж температур: ${data.physicalProperties.temperature} °C</li>
                <li>Амьдрах боломжтой бүсэд байрладаг</li>
                <li>Нээгдсэн он: ${data.discoveryYear}</li>
                <li>Одын төрөл: ${data.starType}</li>
              </ul>
            </article>
          </section>
          <section class="video-section">
            <h2>${data.name} тухай видео</h2>
            <div class="video-container">
              <a href="https://www.youtube.com/watch?v=3a48xkXT9p0" target="_blank" class="video-link">
                <img src="exoplanets/kepler-22b/kepler-video.jpg" alt="Kepler-22b video">
                <div class="play-button"></div>
              </a>
            </div>
          </section>
        `;
      })
      .catch((error) => {
        console.error('Кеплер-22b мэдээллийг ачааллахад алдаа гарлаа:', error);
        this.innerHTML = `<div>Кеплер-22b мэдээллийг ачааллахад алдаа гарлаа. Дэлгэрэнгүй: ${error.message}</div>`;
      });
  }
}

// Define the custom element
customElements.define('kepler-page', KeplerPage);

// Export the class
export default KeplerPage;

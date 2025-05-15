class GliesePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div>Глизе 581g-ийн мэдээллийг ачааллаж байна...</div>`;

    // Амжилттай ажиллаж буй зам
    const jsonPath = './data/planets/gliese-581g.json';
    console.log('Ачааллаж буй зам:', jsonPath);

    fetch(jsonPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP алдаа! Статус: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Татсан мэдээлэл:', data);
        this.innerHTML = `
          <div class="galaxy-background">
            <h2>${data.name}</h2>
            <p>${data.description}</p>
          </div>
          <section>
            <h2>Товч мэдээлэл</h2>
            <div class="grid-container">
              <article>
                <img src="exoplanets/gliese-581g/gliese-581g-details.jpg" alt="Gliese 581g artist impression">
                <h3>Урлагын дүрслэл</h3>
                <p>Глизе 581g гаригийн урлагын дүрслэл. Энэ гариг нь Дэлхийгээс ${data.physicalProperties.radius} дахин том радиустай бөгөөд амьдрах боломжтой бүсэд оршдог.</p>
              </article>
              <article>
                <img src="exoplanets/gliese-581g/gliese-system.jpg" alt="Gliese 581 system">
                <h3>Глизе 581 систем</h3>
                <p>Глизе 581 систем нь ${data.starType} төрлийн одыг тойрон эргэлдэг бөгөөд g гариг нь амьдрах боломжтой бүсэд байрладаг.</p>
              </article>
              <article>
                <img src="exoplanets/gliese-581g/tidal-locking.jpg" alt="Tidal locking">
                <h3>Нэг талдаа тогтсон эргэлт</h3>
                <p>Глизе 581g нь одтойгоо нэг талаараа үргэлж хардаг байх магадлалтай бөгөөд энэ нь гаригийн нэг талд үргэлж өдөр, нөгөө талд үргэлж шөнө байдаг гэсэн үг юм.</p>
              </article>
            </div>
          </section>
          <section>
            <h2>Дэлгэрэнгүй мэдээлэл</h2>
            <article class="detailed-info">
              <img src="images/Gliese_581_g.jpg" alt="${data.name} image" class="planet-photo">
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
              <a href="https://www.youtube.com/watch?v=b4Rg9n0OiJQ" target="_blank" class="video-link">
                <img src="exoplanets/gliese-581g/gliese-video.jpg">
                <div class="play-button"></div>
              </a>
            </div>
          </section>
        `;
      })
      .catch((error) => {
        console.error('Глизе 581g мэдээллийг ачааллахад алдаа гарлаа:', error);
        this.innerHTML = `<div>Глизе 581g мэдээллийг ачааллахад алдаа гарлаа. Дэлгэрэнгүй: ${error.message}</div>`;
      });
  }
}

customElements.define('gliese-page', GliesePage);

export default GliesePage;

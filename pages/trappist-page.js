class TrappistPage extends HTMLElement {
  connectedCallback() {
  
    this.innerHTML = `<div>TRAPPIST-1e-ийн мэдээллийг ачааллаж байна...</div>`;

  
    const jsonPath = './data/planets/trappist-1e.json';
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
                <img src="exoplanets/trappist-1e/trappist-1e-details.jpg" alt="TRAPPIST-1e artist impression">
                <h3>Урлагын дүрслэл</h3>
                <p>TRAPPIST-1e гаригийн урлагын дүрслэл. Энэ гариг нь усан далайн их хэсгийг эзэлдэг байж болох бөгөөд Дэлхийн радиустай ${data.physicalProperties.radius} дахин ойролцоо.</p>
              </article>
              <article>
                <img src="exoplanets/trappist-1e/trappist-system.jpg" alt="TRAPPIST-1 system">
                <h3>TRAPPIST-1 систем</h3>
                <p>TRAPPIST-1 систем нь долоон дэлхийн хэмжээтэй гаригтай бөгөөд ${data.starType} төрлийн одыг тойрон эргэлддэг.</p>
              </article>
              <article>
                <img src="exoplanets/trappist-1e/ultracool-dwarf.jpg" alt="Ultracool dwarf star">
                <h3>Хэт хүйтэн одой од</h3>
                <p>TRAPPIST-1 нь хэт хүйтэн одой од бөгөөд нарнаас хамаагүй жижиг, хүйтэн од юм.</p>
              </article>
            </div>
          </section>
          <section>
            <h2>Дэлгэрэнгүй мэдээлэл</h2>
            <article style="grid-column: 1 / -1;">
              <h3>${data.name} гаригийн шинж чанар</h3>
              <p>${data.fullDescription} Энэ гариг Дэлхийгээс ${data.distanceFromEarth} зайд байрладаг.</p>
              <ul>
                <li>Дэлхийн радиустай ${data.physicalProperties.radius} дахин ойролцоо</li>
                <li>Дэлхийн массаас ${data.physicalProperties.mass} дахин том</li>
                <li>Одны эргэн тойронд ${data.orbitalPeriod} хоногт нэг эргэлддэг</li>
                <li>Амьдрах боломжтой бүсэд байрладаг</li>
                <li>Гадаргын температур: ${data.physicalProperties.temperature}</li>
                <li>Нээгдсэн он: ${data.discoveryYear}</li>
                <li>Одын төрөл: ${data.starType}</li>
              </ul>
            </article>
          </section>
          <section class="video-section">
            <h2>${data.name} тухай видео</h2>
            <div class="video-container">
              <a href="https://www.youtube.com/watch?v=vKg8GUgSQG0" target="_blank" class="video-link">
                <img src="exoplanets/trappist-1e/trappist-video.jpg" alt="TRAPPIST-1e video">
                <div class="play-button"></div>
              </a>
            </div>
          </section>
        `;
      })
      .catch((error) => {
        console.error('TRAPPIST-1e мэдээллийг ачааллахад алдаа гарлаа:', error);
        this.innerHTML = `<div>TRAPPIST-1e мэдээллийг ачааллахад алдаа гарлаа. Дэлгэрэнгүй: ${error.message}</div>`;
      });
  }
}

// Define the custom element
customElements.define('trappist-page', TrappistPage);

// Export the class
export default TrappistPage;

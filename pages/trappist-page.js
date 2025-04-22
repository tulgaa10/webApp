class TrappistPage extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="galaxy-background">
          <h2>TRAPPIST-1e</h2>
          <p>TRAPPIST-1 системийн долоон дэлхийн хэмжээтэй гаригуудын нэг</p>
        </div>
        <section>
          <h2>Товч мэдээлэл</h2>
          <div class="grid-container">
            <article>
              <img src="exoplanets/trappist-1e/trappist-1e-details.jpg" alt="TRAPPIST-1e artist impression">
              <h3>Урлагын дүрслэл</h3>
              <p>TRAPPIST-1e гаригийн урлагын дүрслэл. Энэ гариг нь усан далайн их хэсгийг эзэлдэг байж болох юм.</p>
            </article>
            <article>
              <img src="exoplanets/trappist-1e/trappist-system.jpg" alt="TRAPPIST-1 system">
              <h3>TRAPPIST-1 систем</h3>
              <p>TRAPPIST-1 систем нь долоон дэлхийн хэмжээтэй гаригтай бөгөөд тэдгээрийн гурав нь амьдрах боломжтой бүсэд байрладаг.</p>
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
            <h3>TRAPPIST-1e гаригийн шинж чанар</h3>
            <p>TRAPPIST-1e нь 2017 онд нээгдсэн экзогариг бөгөөд TRAPPIST-1 системийн дөрөв дэх гариг юм. Энэ гариг нь Дэлхийтэй маш төстэй шинж чанаруудтай.</p>
            <ul>
              <li>Дэлхийн радиустай ойролцоо (0.92 дахин)</li>
              <li>Дэлхийн массаас бага зэрэг том (0.62 дахин)</li>
              <li>Одны эргэн тойронд 6.1 хоногт нэг эргэлддэг</li>
              <li>Амьдрах боломжтой бүсэд байрладаг</li>
              <li>Гадаргын температур дунджаар -22°C байх магадлалтай</li>
            </ul>
          </article>
        </section>
        <section class="video-section">
          <h2>TRAPPIST-1e тухай видео</h2>
          <div class="video-container">
            <a href="https://www.youtube.com/watch?v=vKg8GUgSQG0" target="_blank" class="video-link">
              <img src="exoplanets/trappist-1e/trappist-video.jpg">
              <div class="play-button"></div>
            </a>
          </div>
        </section>
      `;
    }
  }
  customElements.define('trappist-page', TrappistPage);
  
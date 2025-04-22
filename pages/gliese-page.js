class GliesePage extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="galaxy-background">
          <h2>Глизе 581g</h2>
          <p>Глизе 581 системд амьдрах боломжтой супер-Дэлхий гариг</p>
        </div>
        <section>
          <h2>Товч мэдээлэл</h2>
          <div class="grid-container">
            <article>
              <img src="exoplanets/gliese-581g/gliese-581g-details.jpg" alt="Gliese 581g artist impression">
              <h3>Урлагын дүрслэл</h3>
              <p>Глизе 581g гаригийн урлагын дүрслэл. Энэ гариг нь Дэлхийгээс 1.3-2 дахин том бөгөөд амьдрах боломжтой бүсэд оршдог.</p>
            </article>
            <article>
              <img src="exoplanets/gliese-581g/gliese-system.jpg" alt="Gliese 581 system">
              <h3>Глизе 581 систем</h3>
              <p>Глизе 581 систем нь хэд хэдэн гаригтай бөгөөд g гариг нь амьдрах боломжтой бүсэд байрладаг.</p>
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
          <article style="grid-column: 1 / -1;">
            <h3>Глизе 581g гаригийн шинж чанар</h3>
            <p>Глизе 581g нь 2010 онд нээгдсэн экзогариг бөгөөд Глизе 581 одны эргэн тойронд эргэлддэг. Энэ гариг нь Дэлхийгээс 20 гэрлийн жилийн зайд байрладаг.</p>
            <ul>
              <li>Дэлхийгээс 1.3-2 дахин том масстай</li>
              <li>Одны эргэн тойронд 37 хоногт нэг эргэлддэг</li>
              <li>Амьдрах боломжтой бүсэд байрладаг</li>
              <li>Гадаргын температур -34°C-аас +71°C хооронд хэлбэлздэг</li>
              <li>Нэг талдаа тогтсон эргэлттэй байх магадлалтай</li>
            </ul>
          </article>
        </section>
        <section class="video-section">
          <h2>Глизе 581g тухай видео</h2>
          <div class="video-container">
            <a href="https://www.youtube.com/watch?v=b4Rg9n0OiJQ" target="_blank" class="video-link">
              <img src="exoplanets/gliese-581g/gliese-video.jpg">
              <div class="play-button"></div>
            </a>
          </div>
        </section>
      `;
    }
  } 

customElements.define('gliese-page', GliesePage);

export default GliesePage;
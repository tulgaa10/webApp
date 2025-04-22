class ProximaPage extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="galaxy-background">
          <h2>Проксима Центавр b</h2>
          <p>Бидний нарны системд хамгийн ойр байрлах экзогариг</p>
        </div>
        <section>
          <h2>Товч мэдээлэл</h2>
          <div class="grid-container">
            <article>
              <img src="exoplanets/proxima-centauri-b/proxima-b-details.jpg" alt="Proxima Centauri b artist impression">
              <h3>Урлагын дүрслэл</h3>
              <p>Проксима Центавр b гаригийн урлагын дүрслэл. Энэ гариг Дэлхийгээс 1.3 дахин том бөгөөд амьдрах боломжтой бүсэд оршдог.</p>
            </article>
            <article>
              <img src="exoplanets/proxima-centauri-b/proxima-system.jpg" alt="Proxima Centauri system">
              <h3>Проксима Центавр систем</h3>
              <p>Проксима Центавр бол Альфа Центавраар алдартай гурван одны системийн нэг хэсэг юм.</p>
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
          <article style="grid-column: 1 / -1;">
            <h3>Проксима Центавр b гаригийн шинж чанар</h3>
            <p>Проксима Центавр b нь 2016 онд нээгдсэн экзогариг бөгөөд зөвхөн 4.24 гэрлийн жилийн зайд байрладаг. Энэ нь одоогоор бидэнд хамгийн ойрхон байгаа экзогариг юм.</p>
            <ul>
              <li>Дэлхийгээс 1.3 дахин том масстай</li>
              <li>Одны эргэн тойронд 11.2 хоногт нэг эргэлддэг</li>
              <li>Одтойгоо маш ойрхон (0.05 AU) байрладаг</li>
              <li>Амьдрах боломжтой бүсэд байрладаг</li>
              <li>Гадаргын температур -40°C-аас +30°C хооронд хэлбэлздэг</li>
            </ul>
          </article>
        </section>
        <section class="video-section">
          <h2>Проксима Центавр b тухай видео</h2>
          <div class="video-container">
            <a href="https://www.youtube.com/watch?v=Fg0NX1NW4oQ" target="_blank" class="video-link">
              <img src="exoplanets/proxima-centauri-b/proxima-video.jpg">
              <div class="play-button"></div>
            </a>
          </div>
        </section>
      `;
    }
  }
  customElements.define('proxima-page', ProximaPage);
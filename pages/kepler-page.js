class KeplerPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="galaxy-background">
        <h2>Кеплер-22b</h2>
        <p>Нарны системтэй төстэй одны амьдрах боломжтой бүсийн анхны баталгаажсан гариг</p>
      </div>
      <section>
        <h2>Товч мэдээлэл</h2>
        <div class="grid-container">
          <article>
            <img src="exoplanets/kepler-22b/Kepler-22_b-details.jpg" alt="Kepler-22b artist impression">
            <h3>Урлагын дүрслэл</h3>
            <p>Кеплер-22b гаригийн урлагын дүрслэл. Энэ гариг Дэлхийгээс 2.4 дахин том бөгөөд амьдрах боломжтой бүсэд оршдог.</p>
          </article>
          <article>
            <img src="exoplanets/kepler-22b/kepler-22-system.jpg" alt="Kepler-22 system">
            <h3>Кеплер-22 систем</h3>
            <p>Кеплер-22 од болон түүний гаригуудын систем. Кеплер-22b нь энэ системийн цорын ганц гариг биш боловч амьдрах боломжтой цорын ганц гариг юм.</p>
          </article>
          <article>
            <img src="exoplanets/kepler-22b/habitable-zone.jpg" alt="Habitable zone">
            <h3>Амьдрах боломжтой бүс</h3>
            <p>Кеплер-22b гариг нь одныхоо амьдрах боломжтой бүсэд байрладаг бөгөөд энэ нь гадаргын температур нь шингэн ус байх боломжийг олгодог.</p>
          </article>
        </div>
      </section>
      <section>
        <h2>Дэлгэрэнгүй мэдээлэл</h2>
        <article style="grid-column: 1 / -1;">
          <h3>Кеплер-22b гаригийн шинж чанар</h3>
          <p>Кеплер-22b нь 2011 онд НАСА-гийн Кеплер сансрын дурангаар нээгдсэн экзогариг юм. Энэ гариг нь манай нарнаас 600 гэрлийн жилийн зайд Кеплер-22 одны эргэн тойронд эргэлддэг.</p>
          <ul>
            <li>Дэлхийгээс 2.4 дахин том радиустай</li>
            <li>Одны эргэн тойронд 290 хоногт нэг эргэлддэг</li>
            <li>Гадаргын дундаж температур 22°C байх магадлалтай</li>
            <li>Амьдрах боломжтой бүсэд байрладаг</li>
            <li>Хий болон шингэн ихтэй гариг байх магадлалтай</li>
          </ul>
        </article>
      </section>
      <section class="video-section">
        <h2>Кеплер-22b тухай видео</h2>
        <div class="video-container">
          <a href="https://www.youtube.com/watch?v=3a48xkXT9p0" target="_blank" class="video-link">
            <img src="exoplanets/kepler-22b/kepler-video.jpg" alt="Kepler-22b video">
            <div class="play-button"></div>
          </a>
        </div>
      </section>
    `;
  }
}

customElements.define('kepler-page', KeplerPage);

export default KeplerPage;
import AbstractView from './abstract-view';

const createFilmsSectionTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>

    </section>
  </section>`
);

class FilmsSectionView extends AbstractView {
  get template() {
    return createFilmsSectionTemplate();
  }
}

export default FilmsSectionView;

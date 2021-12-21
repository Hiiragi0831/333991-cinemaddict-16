import AbstractView from './abstract-view';

const createFilmsSectionTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>

    </section>
  </section>`
);

const createFilmsSectionEmptyTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

export default class FilmsSectionView extends AbstractView {
  get template() {
    return createFilmsSectionTemplate();
  }
}

export class FilmsSectionViewEmpty extends AbstractView {
  get template() {
    return createFilmsSectionEmptyTemplate();
  }
}

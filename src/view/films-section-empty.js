import AbstractView from './abstract-view';
import {FilterType} from '../const';

const createFilmsSectionEmptyTemplate = (emptyText) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${emptyText}</h2>
    </section>
  </section>`
);

class FilmsSectionEmptyView extends AbstractView {
  #filterType = '';
  #emptyText = '';

  get template() {
    return createFilmsSectionEmptyTemplate(this.#emptyText);
  }

  filterTypeEmpty = (type) => {
    this.#filterType = type;
    this.#emptyText = 'There are no movies in our database';

    switch (this.#filterType) {
      case FilterType.WATCHLIST:
        this.#emptyText = 'There are no movies in your watchlist';
        break;
      case FilterType.HISTORY:
        this.#emptyText = 'There are no movies in your history';
        break;
      case FilterType.FAVORITES:
        this.#emptyText = 'There are no movies in your favourites';
        break;
    }
  }
}

export {FilmsSectionEmptyView};

import AbstractView from './abstract-view';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const checkDescription = (description) => description.length > 140 ? `${description.slice(0, 140)}...` : description;

const createFilmCardTemplate = (film) => {
  dayjs.extend(duration);

  const watchlistClassName = film.isWatchlist ? 'film-card__controls-item--active' : '';
  const watchedClassName = film.isWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = film.isFavorite ? 'film-card__controls-item--active' : '';
  const date = new Date (film.releaseDate);

  return`<article class="film-card">
    <a class="film-card__link" data-film="${film.id}">
      <h3 class="film-card__title">${film.title}</h3>
      <p class="film-card__rating">${film.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
        <span class="film-card__duration">${dayjs.duration(film.runtime, 'minutes').format('H[h] m[m]')}</span>
        <span class="film-card__genre">${film.genres[0]}</span>
      </p>
      <img src="${film.poster}" alt="${film.title}" class="film-card__poster">
      <p class="film-card__description">${checkDescription(film.description)}</p>
      <span class="film-card__comments">${film.comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};


export default class FilmCardView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilmCardTemplate(this.#films);
  }

  setClickHandler = (callback) => {
    this._callback.filmClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmClick(this.#films.id);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(this.#films.id);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(this.#films.id);
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(this.#films.id);
  }
}

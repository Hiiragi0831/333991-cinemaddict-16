import AbstractView from './abstract-view';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const createFilmCardTemplate = (film, comments) => {
  dayjs.extend(duration);
  const {title, description, date, rating, runTime, genresOne, image, isWatchlist, isWatched, isFavorite} = film;

  const watchlistClassName = isWatchlist ? 'film-card__controls-item--active' : '';
  const watchedClassName = isWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = isFavorite ? 'film-card__controls-item--active' : '';

  let commentsMove = 0;

  for (let i = 0; i < comments.length; i++) {
    if (film.id === comments[i].id) {
      commentsMove++;
    }
  }

  return`<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date.format('YYYY')}</span>
        <span class="film-card__duration">${dayjs.duration(runTime, 'minutes').format('H[h] m[m]')}</span>
        <span class="film-card__genre">${genresOne}</span>
      </p>
      <img src="${image}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsMove} comments</span>
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
  #comments = null;

  constructor(films, comments) {
    super();
    this.#films = films;
    this.#comments = comments;
  }

  get template() {
    return createFilmCardTemplate(this.#films, this.#comments);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    // 3. А внутри абстрактного обработчика вызовем колбэк
    this._callback.click();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.WatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.WatchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(this.#films.id);
    evt.target.classList.toggle('film-card__controls-item--active');
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.WatchlistClick(this.#films.id);
    evt.target.classList.toggle('film-card__controls-item--active');
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.WatchedClick(this.#films.id);
    evt.target.classList.toggle('film-card__controls-item--active');
  }
}

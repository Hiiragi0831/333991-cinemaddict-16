import {createElement} from '../render.js';

const createSiteMenuTemplate = (films) => {
  const isWatchlist = films.filter((film) => !film.isWatchlist).length;
  const isWatched = films.filter((film) => !film.isWatched).length;
  const isFavorite = films.filter((film) => !film.isFavorite).length;

  return (`<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${isWatchlist}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${isWatched}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${isFavorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`);
};

export default class SiteMenuView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteMenuTemplate(this.#films);
  }

  removeElement() {
    this.#element = null;
  }
}

import AbstractView from './abstract-view';

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

export default class SiteMenuView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createSiteMenuTemplate(this.#films);
  }
}

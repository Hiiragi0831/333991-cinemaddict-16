import AbstractView from './abstract-view';
import {FilterType} from '../const';

const createSiteMenuTemplate = (watchListCount, historyCount, favoriteCount, currentFilter)  =>
  (`<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#" data-filter-type="${FilterType.All}" class="main-navigation__item ${currentFilter === FilterType.All ? 'main-navigation__item--active' : ''}">All movies</a>
      <a href="#" data-filter-type="${FilterType.WATCHLIST}" class="main-navigation__item ${currentFilter === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''} ">Watchlist <span class="main-navigation__item-count">${watchListCount}</span></a>
      <a href="#" data-filter-type="${FilterType.HISTORY}" class="main-navigation__item ${currentFilter === FilterType.HISTORY ? 'main-navigation__item--active' : ''} ">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#" data-filter-type="${FilterType.FAVORITES}" class="main-navigation__item ${currentFilter === FilterType.FAVORITES ? 'main-navigation__item--active' : ''} ">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
    </div>
    <a href="#" data-filter-type="${FilterType.STATS}" class="main-navigation__additional ${currentFilter === FilterType.STATS ? 'main-navigation__item--active' : ''}">Stats</a>
  </nav>`);

export default class SiteMenuView extends AbstractView {
  #watchListCount = 0;
  #historyCount = 0;
  #favoriteCount = 0;
  #filterModel = null;

  constructor(filterModel) {
    super();
    this.#filterModel = filterModel;
  }

  get template() {
    return createSiteMenuTemplate(this.#watchListCount, this.#historyCount, this.#favoriteCount, this.#filterModel.currentFilter);
  }

  get watchListCount() {
    return this.#watchListCount;
  }

  get historyCount() {
    return this.#historyCount;
  }

  get favoriteCount() {
    return this.#favoriteCount;
  }

  set watchListCount(watchListCount) {
    this.#watchListCount = watchListCount;
  }

  set historyCount(historyCount) {
    this.#historyCount = historyCount;
  }

  set favoriteCount(favoriteCount) {
    this.#favoriteCount = favoriteCount;
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
    this.element.querySelector('.main-navigation');
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
    this.element.querySelectorAll('.main-navigation__item').forEach((element) => element.classList.remove('main-navigation__item--active'));
    evt.target.classList.add('main-navigation__item--active');
  }
}

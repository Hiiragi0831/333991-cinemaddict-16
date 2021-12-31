import AbstractView from './abstract-view';

export const SortType = {
  DEFAULT: 'default',
  RATING: 'rating',
  DATE: 'date',
};

const createSortLinksTemplate = () => (
  `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
);

export default class SortLinksView extends AbstractView {
  get template() {
    return createSortLinksTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
    this.element.querySelector('.sort__button');
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    this.element.querySelectorAll('.sort__button').forEach((element) => element.classList.remove('sort__button--active'));
    evt.target.classList.add('sort__button--active');
  }
}

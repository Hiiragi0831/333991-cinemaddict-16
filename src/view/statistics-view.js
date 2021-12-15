import {createElement} from '../render';

const createFooterStatisticsTemplate = (films) => `<p>${films.length} movies inside</p>`;

export default class FooterStatisticsView {
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
    return createFooterStatisticsTemplate(this.#films);
  }

  removeElement() {
    this.#element = null;
  }
}

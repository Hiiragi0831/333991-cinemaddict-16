import {createElement} from '../render';

const createButtonMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonMoreView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createButtonMoreTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

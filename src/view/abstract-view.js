import {createElement} from '../render';

export default class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  replaceElement = () => {
    if (this.#element && this.#element.parentElement) {
      const prevElement = this.#element;
      const parent = prevElement.parentElement;

      this.#element = null;

      const newElement = this.element;

      parent.replaceChild(newElement, prevElement);
    }
  }

  removeElement = () => {
    if (this.#element) {
      this.#element.remove();
      this.#element = null;
    }
  }
}

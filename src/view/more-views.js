import AbstractView from './abstract-view.js';

const createButtonMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

class MoreView extends AbstractView {
  get template() {
    return createButtonMoreTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}

export default MoreView;

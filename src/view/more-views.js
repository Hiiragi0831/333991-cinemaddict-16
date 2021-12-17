import AbstractView from './abstract-view.js';

const createButtonMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonMoreView extends AbstractView {
  get template() {
    return createButtonMoreTemplate();
  }
}

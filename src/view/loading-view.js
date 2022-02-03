import AbstractView from './abstract-view';

const getLoadingTemplate = () => '<section class="films-list"><h2 class="films-list__title">Loading...</h2></section>';

class LoadingView extends AbstractView {
  get template() {
    return getLoadingTemplate();
  }
}

export {LoadingView};

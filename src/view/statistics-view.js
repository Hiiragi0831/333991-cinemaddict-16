import AbstractView from './abstract-view';

const createFooterStatisticsTemplate = (number) => `<p>${number} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView{
  #filmsNumber = null;

  get template() {
    return createFooterStatisticsTemplate(this.#filmsNumber);
  }

  setNumber = (number) => {
    this.#filmsNumber = number;
  }
}

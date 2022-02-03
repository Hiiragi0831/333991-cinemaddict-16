import AbstractView from './abstract-view';

const createFooterStatisticsTemplate = (number) => `<p>${number} movies inside</p>`;

class StatisticsView extends AbstractView{
  #filmsNumber = null;

  get template() {
    return createFooterStatisticsTemplate(this.#filmsNumber);
  }

  setNumber = (number) => {
    this.#filmsNumber = number;
  }
}

export default StatisticsView;

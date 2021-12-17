import AbstractView from './abstract-view';

const createFooterStatisticsTemplate = (films) => `<p>${films.length} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView{
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#films);
  }
}

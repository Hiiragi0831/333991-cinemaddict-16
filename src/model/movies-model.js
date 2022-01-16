import AbstractObservable from '../utils';

export default class MoviesModel extends AbstractObservable {
  #films = [];

  get films() {
    return this.#films;
  }

  set films(films) {
    this.#films = [...films];
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.idx === update.idx);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}

import AbstractObservable, {normalizeArray} from '../utils';
import ApiService from '../api-service';
import {normalizeMovie} from '../helps/normalize';
import {UpdateType} from '../const';

export default class MoviesModel extends AbstractObservable {
  #films = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return [...this.#films];
  }

  init = async () => {
    try {
      const response = await this.#apiService.films;
      this.#films = normalizeArray(await ApiService.parseResponse(response), normalizeMovie);
    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT, this.#films);
  }

  updateFilm = async (updateType, updatedMovie) => {
    try {
      await this.#apiService.updateMovie(updatedMovie);

      const index = this.#films.findIndex((film) => film.id === updatedMovie.id);

      if (index === -1) {
        throw new Error('Can\'t update unexisting movie');
      }

      this.#films = [
        ...this.#films.slice(0, index),
        updatedMovie,
        ...this.#films.slice(index + 1)
      ];

      this._notify(updateType, updatedMovie);

    } catch (err) {
      this._notify(UpdateType.ERROR, err);
    }
  }
}

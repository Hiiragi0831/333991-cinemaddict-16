import {normalizeArray} from '../utils';
import ApiService from '../api-service';
import {normalizeMovie} from '../helps/normalize';
import {UpdateType} from '../const';
import AbstractObservable from '../view/abstract-observable-view';

class MoviesModel extends AbstractObservable {
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
      this._notify(UpdateType.INIT, this.#films);
    } catch (err) {
      this.#films = [];
      this._notify(UpdateType.ERROR_LOAD_FILM, this.#films);
    }
  }

  addComment = (movieId, comments) => {
    const currentMovie = this.#films.find((movie) => movie.id === movieId);

    if (!currentMovie) {
      throw new Error('Movie doesn\'t exist.');
    }

    currentMovie.comments = comments;
  }

  deleteComment = (commentId) => {
    const currentMovie = this.#films.find((movie) => movie.comments.includes(commentId));
    const commentIndex = currentMovie.comments.findIndex((comment) => comment === commentId);

    currentMovie.comments = [
      ...currentMovie.comments.slice(0, commentIndex),
      ...currentMovie.comments.slice(commentIndex + 1),
    ];
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

export default MoviesModel;

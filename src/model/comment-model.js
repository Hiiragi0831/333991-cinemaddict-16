import AbstractObservable, {normalizeArray} from '../utils';
import ApiService from '../api-service';
import {UpdateType} from '../const';
import {normalizeComment} from '../helps/normalize';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor (apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  loadComments = async (movieId) => {
    try {
      const response = await this.#apiService.getMoviesComments(movieId);
      this.#comments = normalizeArray(await ApiService.parseResponse(response), normalizeComment);

      this._notify(UpdateType.LOAD_COMMENTS, this.#comments);
    } catch (err) {
      this.#comments = [];
    }
  }

  addComment = async (movieId, comment, callback) => {
    try {
      const response = await ApiService.parseResponse(await this.#apiService.addComment(movieId, comment));
      this.#comments = normalizeArray(response.comments, normalizeComment);

      callback(movieId, response.films.comments);

      this._notify();

    } catch (err) {
      this._notify(UpdateType.ERROR, err);
    }
  }

  deleteComment = async (commentId, callback) => {
    try {
      await this.#apiService.deleteComment(commentId);

      const index = this.#comments.findIndex((comment) => comment.id === commentId);

      if (index === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1)
      ];

      callback(commentId);

      this._notify();

    } catch (err) {
      this._notify(UpdateType.ERROR, err);
    }
  }
}

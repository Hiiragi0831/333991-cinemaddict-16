import {normalizeArray} from '../utils';
import AbstractObservable from '../view/abstract-observable-view';
import ApiService from '../api-service';
import {UpdateType} from '../const';
import {normalizeComment} from '../helps/normalize';

class CommentsModel extends AbstractObservable {
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
      this._notify(UpdateType.LOAD_COMMENTS_ERROR, this.#comments);
    }
  }

  addComment = async (movieId, comment, callback) => {

    try {
      const response = await ApiService.parseResponse(await this.#apiService.addComment(movieId, comment));
      this.#comments = normalizeArray(response.comments, normalizeComment);

      callback(movieId, response.movie.comments);

      this._notify(UpdateType.ADD_COMMENT, comment);

    } catch (err) {
      this._notify(UpdateType.ERROR_ADD_COMMENT, err);
    }
  }

  deleteComment = async (commentId) => {
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

      this._notify(UpdateType.DELETE_COMMENT, commentId);
    } catch (err) {
      this._notify(UpdateType.DELETE_COMMENT_ERROR, commentId);
    }
  }
}

export default CommentsModel;

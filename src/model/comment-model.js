import AbstractObservable from '../utils';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = [...comments];
    this._notify('load comments', comments);
  }
}

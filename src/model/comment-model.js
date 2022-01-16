import AbstractObservable from '../utils';

export default class CommentsModel extends AbstractObservable {
  #films = [];

  get comment() {
    return this.#films;
  }

  set comment(films) {
    this.#films = [...films];
  }
}

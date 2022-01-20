import AbstractObservable from '../utils';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  get comments() {
    return [...this.#comments];
  }

  set comments(comments) {
    this.#comments = [...comments];
    this._notify('load comments', comments);
  }

  addComment = (comment) => {
    this.#comments.push({
      id: comment.id,
      filmId: comment.filmId,
      text: comment.text,
      emotion: comment.emotion,
      author: comment.author,
      date: comment.date,
    });

    this._notify('add comment', comment);
  }

  deleteComment = (commentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify('delete comment', commentId);
  }
}

import SmartView from './smart-view';
import he from 'he';
import dayjs from 'dayjs';

const createPopupTemplate = (film, comments, currentEmoji, currentText) => {
  const watchlistClassName = film.isWatchlist ? 'film-details__control-button--active' : '';
  const watchedClassName = film.isWatched ? 'film-details__control-button--active' : '';
  const favoriteClassName = film.isFavorite ? 'film-details__control-button--active' : '';

  const commentsMove = [];

  const createGenreTemplate = (genresArr) => (
    genresArr.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')
  );

  const createCommentTemplate = (commentsArr) => (
    commentsArr.map((comment) => `<li class="film-details__comment" >
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${he.encode(comment.author)}</span>
          <span class="film-details__comment-day">${comment.date.format('DD/MM/YYYY HH:mm')}</span>
          <button class="film-details__comment-delete" data-id="${comment.id}">Delete</button>
        </p>
      </div>
    </li>`).join(' ')
  );

  for (let i = 0; i < comments.length; i++) {
    if (film.id === comments[i].filmId) {
      commentsMove.push(comments[i]);
    }
  }

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${film.image}" alt="${film.title}">

            <p class="film-details__age">${film.age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.title}</h3>
                <p class="film-details__title-original">Original: ${film.title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${film.date.format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${film.runTime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${createGenreTemplate(film.genres)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${film.description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsMove.length}</span></h3>

          <ul class="film-details__comments-list">
            ${createCommentTemplate(commentsMove)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
                ${currentEmoji ? `<img src="./images/emoji/${currentEmoji}.png" width="71" height="71" alt="emoji" data-emoji="smile">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(currentText)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${currentEmoji === 'smile' ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji" data-emoji="smile">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${currentEmoji === 'sleeping' ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji" data-emoji="sleeping">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${currentEmoji === 'puke' ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji" data-emoji="puke">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${currentEmoji === 'angry' ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji" data-emoji="angry">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class PopupCardView extends SmartView {
  #films = null;
  #comments = null;
  #currentEmoji = null;
  #currentText = '';

  constructor(films, comments) {
    super();
    this.#films = films;
    this.#comments = comments;
  }

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  get template() {
    return createPopupTemplate(this.#films, this.#comments, this.#currentEmoji, this.#currentText);
  }

  updateData = (filmUpdate, commentsUpdate) => {
    if (!filmUpdate && !commentsUpdate) {
      return;
    }

    if (filmUpdate) {
      this.#films = {...this.#films, ...filmUpdate};
    }

    if (commentsUpdate) {
      this.#comments = commentsUpdate;
    }

    this.updateElement();
  }

  resetData = () => {
    this.#currentEmoji = null;
    this.#currentText = '';
  }

  restoreHandlers = () => {
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#addCommentClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.WatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.WatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setEmojiClickHandler = (callback) => {
    this._callback.EmojiClick = callback;
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.DeleteClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentClickHandler);
  }

  setAddCommentClickHandler = (callback) => {
    this._callback.AddComment = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keyup', this.#addCommentClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(this.#films.id);
    evt.target.classList.toggle('film-details__control-button--active');
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.WatchlistClick(this.#films.id);
    evt.target.classList.toggle('film-details__control-button--active');
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.WatchedClick(this.#films.id);
    evt.target.classList.toggle('film-details__control-button--active');
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'IMG') {
      this.#currentEmoji = evt.target.dataset.emoji;
    }

    this._callback.EmojiClick(this.#currentEmoji);
  }

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'BUTTON') {
      this._callback.DeleteClick(evt.target.dataset.id);
    }
  }

  #addCommentClickHandler = (evt) => {
    const currentInput = this.element.querySelector('.film-details__comment-input');

    if (currentInput) {
      this.#currentText = currentInput.value;

      if (evt.ctrlKey && evt.key === 'Enter') {
        const newComment = {
          id: Math.random().toString(10).substr(2, 9),
          filmId: this.#films.id,
          text: this.#currentText,
          emotion: this.#currentEmoji || 'smile',
          author: 'Jon Doe',
          date: dayjs(new Date()),
        };
        this.resetData();
        this._callback.AddComment(newComment);
      }
    }
  }
}

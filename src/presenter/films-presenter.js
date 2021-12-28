import FilmsSectionView, {FilmsSectionViewEmpty} from '../view/films-section-view';
import SortLinksView, {SortType} from '../view/sort-view';
import {remove, render, RenderPosition} from '../render';
import FilmCardView from '../view/film-view';
import PopupCardView from '../view/film-details-view';
import ButtonMoreView from '../view/more-views';
import {sortTaskUp, sortTaskDown, sortMoviesByDate, sortMoviesByRating} from '../utils';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #activePopup = null;

  #filmsSectionComponent = new FilmsSectionView();
  #sortComponent = new SortLinksView();
  #noFilmsComponent = new FilmsSectionViewEmpty();
  #films = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (films, comments) => {
    this.#films = [...films];
    this.#comments = [...comments];

    this.#sourcedFilms = [...films];

    this.#renderSort();

    render(this.#filmsContainer, this.#filmsSectionComponent, RenderPosition.BEFOREEND);

    this.#renderContainer();
  }

  #sortFilms = (sortType) => {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE:
        this.#sourcedFilms = sortMoviesByRating(this.#sourcedFilms);
        break;
      case SortType.RATING:
        this.#sourcedFilms=;
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#sourcedFilms = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderContainer();
  }

  #renderSort = () => {
    render(this.#filmsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilm = (film, commentary) => {
    const filmComponent = new FilmCardView(film, commentary);
    const popupComponent = new PopupCardView(film, commentary);
    const filmsContainerElement = this.#filmsSectionComponent.element.querySelector('.films-list__container');

    const createPopup = () => {
      render(this.#filmsContainer, popupComponent, RenderPosition.AFTEREND);
      document.querySelector('body').classList.add('hide-overflow');
      this.#activePopup = popupComponent;
      popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick.bind(this));
      popupComponent.setWatchedClickHandler(this.#handleWatchedClick.bind(this));
      popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick.bind(this));
    };

    filmComponent.element.querySelector('.film-card__link').addEventListener(('click'), () => {
      if (this.#activePopup) {
        remove(this.#activePopup);
      }
      createPopup();
      document.addEventListener('keydown', this.#escKeyDownHandler);
      document.addEventListener('click', this.#closeButton);
    });

    render(filmsContainerElement, filmComponent, RenderPosition.BEFOREEND);

    this.#filmPresenter.set(film.idx, this.#renderFilm);
    filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick.bind(this));
    filmComponent.setWatchedClickHandler(this.#handleWatchedClick.bind(this));
    filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick.bind(this));
  }

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, this.#comments));
  }

  #renderNoFilms = () => {
    render(this.#filmsContainer, this.#noFilmsComponent, RenderPosition.AFTEREND);
  }

  #renderLoadMoreButton = () => {
    let renderedTaskCount = this.#renderedFilmCount;
    const filmsContainerElement = this.#filmsSectionComponent.element.querySelector('.films-list__container');
    const loadMoreButton = new ButtonMoreView();

    render(filmsContainerElement, loadMoreButton, RenderPosition.AFTEREND);

    loadMoreButton.setClickHandler(() => {
      this.#renderFilms(renderedTaskCount, renderedTaskCount + this.#renderedFilmCount);

      renderedTaskCount += this.#renderedFilmCount;

      if (renderedTaskCount >= this.#films.length) {
        remove(loadMoreButton);
      }
    });
  }

  #renderContainer = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilms(0, Math.min(this.#films.length, this.#renderedFilmCount));

    if (this.#films.length > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderFilms = this.#renderedFilmCount;
    remove(this.#renderLoadMoreButton);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      document.removeEventListener('click', this.#closeButton);
    }
  }

  #closeButton = (evt) => {
    if (evt.target === document.querySelector('.film-details__close-btn')) {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
      document.removeEventListener('click', this.#closeButton);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #handleFavoriteClick = (idx) => {
    const favFilm = this.#films.find((film) => film.idx === idx);
    favFilm.isFavorite = !favFilm.isFavorite;
  }

  #handleWatchedClick = (idx) => {
    const favFilm = this.#films.find((film) => film.idx === idx);
    favFilm.isWatched = !favFilm.isWatched;
  }

  #handleWatchlistClick = (idx) => {
    const favFilm = this.#films.find((film) => film.idx === idx);
    favFilm.isWatchlist = !favFilm.isWatchlist;
  }
}

import FilmsSectionView, {FilmsSectionViewEmpty} from '../view/films-section-view';
import SortLinksView, {SortType} from '../view/sort-view';
import {remove, render, RenderPosition} from '../render';
import FilmCardView from '../view/film-view';
import PopupCardView from '../view/film-details-view';
import ButtonMoreView from '../view/more-views';
import {sortByDate, sortByRating} from '../utils';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #activePopup = null;
  #loadMoreButton = null;

  #filmsSectionComponent = new FilmsSectionView();
  #sortComponent = new SortLinksView();
  #noFilmsComponent = new FilmsSectionViewEmpty();
  #films = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];
  #createdFilms = [];

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (films, comments) => {
    this.#films = [...films];
    this.#comments = [...comments];
    this.#sourcedFilms = [...films];

    this.#renderSortList();
    this.#renderContainer();
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films = sortByDate(this.#films);
        break;
      case SortType.RATING:
        this.#films = sortByRating(this.#films);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
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

  #renderSortList = () => {
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
    return filmComponent;
  }

  #renderFilms = (from, to) => {
    this.#createdFilms = [...this.#createdFilms, ...this.#films.slice(from, to).map((film) => this.#renderFilm(film, this.#comments))];
  }

  #renderNoFilms = () => {
    render(this.#filmsContainer, this.#noFilmsComponent, RenderPosition.AFTEREND);
  }

  #renderLoadMoreButton = () => {
    let renderedTaskCount = this.#renderedFilmCount;
    const filmsContainerElement = this.#filmsSectionComponent.element.querySelector('.films-list__container');
    this.#loadMoreButton = new ButtonMoreView();

    render(filmsContainerElement, this.#loadMoreButton, RenderPosition.AFTEREND);

    this.#loadMoreButton.setClickHandler(() => {
      this.#renderFilms(renderedTaskCount, renderedTaskCount + this.#renderedFilmCount);

      renderedTaskCount += this.#renderedFilmCount;

      if (renderedTaskCount >= this.#films.length) {
        remove(this.#loadMoreButton);
      }
    });
  }

  #renderContainer = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }
    render(this.#filmsContainer, this.#filmsSectionComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(0, Math.min(this.#films.length, this.#renderedFilmCount));

    if (this.#films.length > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  }

  #clearFilmList = () => {
    this.#createdFilms.forEach((film) => remove(film));
    remove(this.#loadMoreButton);
    this.#createdFilms = [];
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
    }
  }

  #closeButton = (evt) => {
    if (evt.target === document.querySelector('.film-details__close-btn')) {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
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

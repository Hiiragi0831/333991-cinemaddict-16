import FilmsSectionView from '../view/films-section-view';
import SortLinksView from '../view/sort-view';
import {remove, render} from '../render';
import FilmView from '../view/film-view';
import FilmDetailsView from '../view/film-details-view';
import MoreView from '../view/more-views';
import {filterFavoriteMovies, filterWatchedMovies, filterWatchingMovies, sortByDate, sortByRating} from '../utils';
import {SortType, FilterType, UpdateType, RenderPosition, FILM_COUNT_PER_STEP} from '../const';
import SiteMenuView from '../view/site-menu-view';
import StatsView from '../view/stats-view';
import {FilmsSectionEmptyView} from '../view/films-section-empty';
import ProfileView from '../view/profile-view';
import StatisticsView from '../view/statistics-view';
import {LoadingView} from '../view/loading-view';

class FilmsPresenter {
  #filmsContainer = null;
  #activePopup = null;
  #moviesModel = null;
  #commentsModel = null;
  #filterModel = null;
  #statsView = null;
  #filmsSectionView = new FilmsSectionView();
  #sortLinksView = new SortLinksView();
  #siteMenuView = null;
  #filmsSectionViewEmpty = new FilmsSectionEmptyView();
  #buttonMoreView = new MoreView();
  #profileSectionView = new ProfileView();
  #footerStatisticsView = new StatisticsView();
  #films = [];
  #watchMovies = [];
  #watchedMovies = [];
  #favoriteMovies = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #createdFilms = [];
  #currentFilm = null;
  #loadingView = new LoadingView();

  constructor(filmsContainer, moviesModel, commentsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#siteMenuView = new SiteMenuView(this.#filterModel);
    this.#loadingFilms();

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    let movies = this.#moviesModel.films;

    switch (this.#filterModel.currentFilter) {
      case FilterType.WATCHLIST:
        movies = filterWatchingMovies(movies);
        break;
      case FilterType.HISTORY:
        movies = filterWatchedMovies(movies);
        break;
      case FilterType.FAVORITES:
        movies = filterFavoriteMovies(movies);
        break;
      case FilterType.STATS:
        break;
    }
    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        this.#films = movies;
        return this.#films;
      case SortType.DATE:
        this.#films = sortByDate(movies);
        return this.#films;
      case SortType.RATING:
        this.#films = sortByRating(movies);
        return this.#films;
    }
    return this.#films;
  }

  init = () => {
    this.#films = [...this.films];

    this.#renderProfile();
    this.#renderFooter();
    this.#renderFiltersList();
    this.#renderSortList();
    this.#renderContainer();
  };

  #loadingFilms = () => {
    render(this.#filmsContainer, this.#loadingView, RenderPosition.BEFOREEND);
  }

  #renderProfile = () => {
    this.#updateFilters();
    this.#profileSectionView.ratingSet(this.#watchedMovies.length);
    render(document.querySelector('.header'), this.#profileSectionView, RenderPosition.BEFOREEND);
  }

  #renderFooter = () => {
    this.#footerStatisticsView.setNumber(this.#films.length);
    render(document.querySelector('.footer__statistics'), this.#footerStatisticsView, RenderPosition.BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderContainer();
  };

  #renderSortList = () => {
    if (this.#moviesModel.films.length === 0) {
      return;
    }

    render(this.#filmsContainer, this.#sortLinksView, RenderPosition.BEFOREEND);
    this.#sortLinksView.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.currentFilter === filterType) {
      return;
    }

    this.#filterModel.currentFilter = filterType;
    this.#currentSortType = SortType.DEFAULT;
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;

    this.#clearFilmList();
    this.#reloadSortList();
    this.#renderContainer();
  };

  #updateFilters = () => {
    this.#watchMovies = filterWatchingMovies(this.#moviesModel.films);
    this.#watchedMovies = filterWatchedMovies(this.#moviesModel.films);
    this.#favoriteMovies = filterFavoriteMovies(this.#moviesModel.films);
  };

  #renderFiltersList = () => {
    this.#updateFilters();

    this.#siteMenuView.watchListCount = this.#watchMovies.length;
    this.#siteMenuView.historyCount = this.#watchedMovies.length;
    this.#siteMenuView.favoriteCount = this.#favoriteMovies.length;

    render(this.#filmsContainer, this.#siteMenuView, RenderPosition.AFTERBEGIN);
    this.#siteMenuView.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  };

  #renderFilm = (film) => {
    const filmView = new FilmView(film);
    const filmsListContainerElement = this.#filmsSectionView.element.querySelector('.films-list__container');

    filmView.setClickHandler(this.#handleFilmClick.bind(this));

    render(filmsListContainerElement, filmView, RenderPosition.BEFOREEND);

    this.#filmPresenter.set(film.id, this.#renderFilm);
    filmView.setFavoriteClickHandler(this.#handleFavoriteClick.bind(this));
    filmView.setWatchedClickHandler(this.#handleWatchedClick.bind(this));
    filmView.setWatchlistClickHandler(this.#handleWatchlistClick.bind(this));
    return filmView;
  };

  #createPopup = (film, commentary) => {
    const filmDetailsView = new FilmDetailsView(film, commentary);

    render(this.#filmsContainer, filmDetailsView, RenderPosition.AFTEREND);
    document.querySelector('body').classList.add('hide-overflow');
    this.#activePopup = filmDetailsView;
    filmDetailsView.setFavoriteClickHandler(this.#handleFavoriteClick.bind(this));
    filmDetailsView.setWatchedClickHandler(this.#handleWatchedClick.bind(this));
    filmDetailsView.setWatchlistClickHandler(this.#handleWatchlistClick.bind(this));
    filmDetailsView.setEmojiClickHandler(this.#handleEmojiClick.bind(this));
    filmDetailsView.setDeleteClickHandler(this.#deleteComment.bind(this));
    filmDetailsView.setAddCommentClickHandler(this.#addComment.bind(this));
  };

  #handleFilmClick = (id) => {
    this.#currentFilm = this.#films.find((film) => film.id === id);
    this.#commentsModel.loadComments(this.#currentFilm.id);

    if (this.#activePopup) {
      remove(this.#activePopup);
    }

    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('click', this.#closeButton);
  }

  #renderFilms = (from, to) => {
    this.#createdFilms = [...this.#createdFilms, ...this.#films.slice(from, to).map((film) => this.#renderFilm(film))];
  };

  #initLoadMoreButtonClickHandler = () => {
    this.#buttonMoreView.setClickHandler(() => {
      this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

      this.#renderedFilmCount += FILM_COUNT_PER_STEP;

      if (this.#renderedFilmCount >= this.films.length) {
        remove(this.#buttonMoreView);
      }
    });
  };

  #renderLoadMoreButton = () => {
    const filmsListContainerElement = this.#filmsSectionView.element.querySelector('.films-list__container');
    render(filmsListContainerElement, this.#buttonMoreView, RenderPosition.AFTEREND);
    this.#initLoadMoreButtonClickHandler();
  };

  #renderContainer = () => {
    const filmsCount = this.films.length;

    if (filmsCount === 0) {
      if (this.#filmsSectionView) {
        remove(this.#filmsSectionView);
      }
      this.#filmsSectionViewEmpty.filterTypeEmpty(this.#filterModel.currentFilter);
      remove(this.#sortLinksView);
      render(this.#filmsContainer, this.#filmsSectionViewEmpty, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmsSectionViewEmpty) {
      remove(this.#filmsSectionViewEmpty);
    }

    if (this.#statsView) {
      this.#statsView.removeElement();
    }

    if (this.#filterModel.currentFilter === FilterType.STATS) {
      remove(this.#filmsSectionView);
      remove(this.#sortLinksView);
      this.#statsView = new StatsView(this.#watchedMovies);
      render(this.#filmsContainer, this.#statsView, RenderPosition.BEFOREEND);
      this.#statsView.updateElement();
      return;
    }

    render(this.#filmsContainer, this.#filmsSectionView, RenderPosition.BEFOREEND);

    this.#renderFilms(0, Math.min(filmsCount, this.#renderedFilmCount));

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  };

  #clearFilmList = () => {
    this.#createdFilms.forEach((film) => remove(film));
    remove(this.#buttonMoreView);
    this.#createdFilms = [];
  };

  #reloadSortList = () => {
    remove(this.#sortLinksView);
    this.#renderSortList();
  };

  #reloadFilterList = () => {
    remove(this.#siteMenuView);
    this.#renderFiltersList();
  };

  #reloadProfile = () => {
    remove(this.#profileSectionView);
    this.#renderProfile();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
    }
  };

  #closeButton = (evt) => {
    if (evt.target === document.querySelector('.film-details__close-btn')) {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
    }
  };

  #handleFavoriteClick = (id) => {
    const findFilm = this.#films.find((film) => film.id === id);
    findFilm.isFavorite = !findFilm.isFavorite;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, findFilm);
  };

  #handleWatchedClick = (id) => {
    const findFilm = this.#films.find((film) => film.id === id);
    findFilm.isWatched = !findFilm.isWatched;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, findFilm);
  };

  #handleWatchlistClick = (id) => {
    const findFilm = this.#films.find((film) => film.id === id);
    findFilm.isWatchlist = !findFilm.isWatchlist;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, findFilm);
  };

  #deleteComment = (id) => {
    const findComment = this.#commentsModel.comments.find((comment) => comment.id === id);
    this.#commentsModel.deleteComment(findComment.id);
    this.#moviesModel.deleteComment(findComment.id);
  };

  #addComment = (newComment) => {
    this.#commentsModel.addComment(this.#currentFilm.id, newComment, this.#moviesModel.addComment);
  };

  #handleEmojiClick = (emoji) => {
    this.#currentFilm.newComment.emoji = emoji;
    this.#activePopup.updateData(this.#currentFilm);
  };

  #reloadApp = () => {
    this.#clearFilmList();
    this.#reloadFilterList();
    this.#reloadProfile();
    this.#renderContainer();
  }

  #handleModelEvent = (updateType, data) => {

    if (updateType === UpdateType.INIT) {
      remove(this.#loadingView);
      this.init();
    }

    if (updateType === UpdateType.ERROR_LOAD_FILM) {
      remove(this.#loadingView);
      this.init();
    }

    if (updateType === UpdateType.LOAD_COMMENTS) {
      this.#createPopup(this.#currentFilm, data);
    }

    if (updateType === UpdateType.LOAD_COMMENTS_ERROR) {
      this.#createPopup(this.#currentFilm, data);
    }

    if (updateType === UpdateType.DELETE_COMMENT) {
      this.#activePopup.updateData(this.#currentFilm, this.#commentsModel.comments);
      this.#reloadApp();
    }

    if (updateType === UpdateType.ADD_COMMENT) {
      this.#activePopup.updateData(this.#currentFilm, this.#commentsModel.comments);
      this.#reloadApp();
    }

    if (updateType === UpdateType.CONTROLS) {
      if (this.#activePopup) {
        this.#activePopup.updateData(data, this.#commentsModel.comments);
      }
      this.#reloadApp();
    }

    this.#updateFilters();
  };
}

export default FilmsPresenter;

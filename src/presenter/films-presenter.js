import FilmsSectionView from '../view/films-section-view';
import SortLinksView from '../view/sort-view';
import {remove, render, RenderPosition} from '../render';
import FilmCardView from '../view/film-view';
import PopupCardView from '../view/film-details-view';
import ButtonMoreView from '../view/more-views';
import {filterFavoriteMovies, filterWatchedMovies, filterWatchingMovies, sortByDate, sortByRating} from '../utils';
import {SortType, FilterType, UpdateType} from '../const';
import SiteMenuView from '../view/site-menu-view';
import StatsView from '../view/stats-view';
import {FilmsSectionViewEmpty} from '../view/films-section-empty';
import ProfileSectionView from '../view/profile-view';
import FooterStatisticsView from '../view/statistics-view';
import {LoadingView} from '../view/loading-view';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #activePopup = null;
  #moviesModel = null;
  #commentsModel = null;
  #filterModel = null;
  #statsView = null;
  #filmsSectionComponent = new FilmsSectionView();
  #sortComponent = new SortLinksView();
  #filtersComponent = null;
  #noFilmsComponent = new FilmsSectionViewEmpty();
  #loadMoreButtonComponent = new ButtonMoreView();
  #profileComponent = new ProfileSectionView();
  #footerComponent = new FooterStatisticsView();
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

  // сюда принимаем данные из моделей и записываем их в переменные презентера и с нимим работаем
  constructor(filmsContainer, moviesModel, commentsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#filtersComponent = new SiteMenuView(this.#filterModel);
    this.#loadingFilms();

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  // получить фильмы с сортировкой
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
    this.#profileComponent.ratingSet(this.#watchedMovies.length);
    render(document.querySelector('.header'), this.#profileComponent, RenderPosition.BEFOREEND);
  }

  #renderFooter = () => {
    this.#footerComponent.setNumber(this.#films.length);
    render(document.querySelector('.footer__statistics'), this.#footerComponent, RenderPosition.BEFOREEND);
  }

  // Сортировка принимает в себя тип сортировки;
  // проверяем текуший тип соортировки если да то ничего не возврашаем;
  // записываем в переменную кликнутый тип сортировки;
  // очишаем фильмы;
  // заново вызываем рендер контейнера;
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderContainer();
  };

  // рендер списка сортировки;
  // дергаем обработчик кликов;
  #renderSortList = () => {
    if (this.#moviesModel.films.length === 0) {
      return;
    }

    render(this.#filmsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  // проверяем какой вид фильтра кликаем;
  // устанавливаем тип фильра на который кликнули;
  // сбрасываем тип сортировки;
  // очишаем список фильмов;
  // удаляем и заново рендерим список сортировки;
  // рендерим контейнер;
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

  // записываем в переменные данные по условиям фильтрации;
  #updateFilters = () => {
    this.#watchMovies = filterWatchingMovies(this.#moviesModel.films);
    this.#watchedMovies = filterWatchedMovies(this.#moviesModel.films);
    this.#favoriteMovies = filterFavoriteMovies(this.#moviesModel.films);
  };

  // дергаем функцию;
  // передаем данные о количестве фильмов в конкретной категории в модель;
  // рендерим меню;
  // вешаем обработчик событий клика;
  #renderFiltersList = () => {
    this.#updateFilters();

    this.#filtersComponent.watchListCount = this.#watchMovies.length;
    this.#filtersComponent.historyCount = this.#watchedMovies.length;
    this.#filtersComponent.favoriteCount = this.#favoriteMovies.length;

    render(this.#filmsContainer, this.#filtersComponent, RenderPosition.AFTERBEGIN);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  };

  // рендер 1 карточки фильма и создание попап компонента;
  #renderFilm = (film) => {
    const filmComponent = new FilmCardView(film);
    const filmsContainerElement = this.#filmsSectionComponent.element.querySelector('.films-list__container');

    filmComponent.setClickHandler(this.#handleFilmClick.bind(this));

    render(filmsContainerElement, filmComponent, RenderPosition.BEFOREEND);

    this.#filmPresenter.set(film.id, this.#renderFilm);
    filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick.bind(this));
    filmComponent.setWatchedClickHandler(this.#handleWatchedClick.bind(this));
    filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick.bind(this));
    return filmComponent;
  };

  #createPopup = (film, commentary) => {
    const popupComponent = new PopupCardView(film, commentary);

    render(this.#filmsContainer, popupComponent, RenderPosition.AFTEREND);
    document.querySelector('body').classList.add('hide-overflow');
    this.#activePopup = popupComponent;
    popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick.bind(this));
    popupComponent.setWatchedClickHandler(this.#handleWatchedClick.bind(this));
    popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick.bind(this));
    popupComponent.setEmojiClickHandler(this.#handleEmojiClick.bind(this));
    popupComponent.setDeleteClickHandler(this.#deleteComment.bind(this));
    popupComponent.setAddCommentClickHandler(this.#addComment.bind(this));
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

  // Проходимся по циклу
  #renderFilms = (from, to) => {
    this.#createdFilms = [...this.#createdFilms, ...this.#films.slice(from, to).map((film) => this.#renderFilm(film))];
  };

  // Функция загрузки фильпов по клику
  #initLoadMoreButtonClickHandler = () => {
    this.#loadMoreButtonComponent.setClickHandler(() => {
      this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

      this.#renderedFilmCount += FILM_COUNT_PER_STEP;

      if (this.#renderedFilmCount >= this.films.length) {
        remove(this.#loadMoreButtonComponent);
      }
    });
  };

  // Вывод кнопки
  #renderLoadMoreButton = () => {
    const filmsContainerElement = this.#filmsSectionComponent.element.querySelector('.films-list__container');
    render(filmsContainerElement, this.#loadMoreButtonComponent, RenderPosition.AFTEREND);
    this.#initLoadMoreButtonClickHandler();
  };

  // Вывод контейнера для фильмов и рендер
  #renderContainer = () => {
    const filmsCount = this.films.length;

    if (filmsCount === 0) {
      if (this.#filmsSectionComponent) {
        remove(this.#filmsSectionComponent);
      }
      this.#noFilmsComponent.filterTypeEmpty(this.#filterModel.currentFilter);
      remove(this.#sortComponent);
      render(this.#filmsContainer, this.#noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (this.#statsView) {
      this.#statsView.removeElement();
    }

    if (this.#filterModel.currentFilter === FilterType.STATS) {
      remove(this.#filmsSectionComponent);
      remove(this.#sortComponent);
      this.#statsView = new StatsView(this.#watchedMovies);
      render(this.#filmsContainer, this.#statsView, RenderPosition.BEFOREEND);
      this.#statsView.updateElement();
      return;
    }

    render(this.#filmsContainer, this.#filmsSectionComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(0, Math.min(filmsCount, this.#renderedFilmCount));

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  };

  // Очистка всех карточек фильмов
  #clearFilmList = () => {
    this.#createdFilms.forEach((film) => remove(film));
    remove(this.#loadMoreButtonComponent);
    this.#createdFilms = [];
  };

  // очистка и рендер списка сортирровки
  #reloadSortList = () => {
    remove(this.#sortComponent);
    this.#renderSortList();
  };

  #reloadFilterList = () => {
    remove(this.#filtersComponent);
    this.#renderFiltersList();
  };

  #reloadProfile = () => {
    remove(this.#profileComponent);
    this.#renderProfile();
  }

  // Слушатель Escape
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
    }
  };

  // Слушатель кнопки закрытия
  #closeButton = (evt) => {
    if (evt.target === document.querySelector('.film-details__close-btn')) {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
    }
  };

  // Слушатель клика избранного
  #handleFavoriteClick = (id) => {
    const findFilm = this.#films.find((film) => film.id === id);
    findFilm.isFavorite = !findFilm.isFavorite;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, findFilm);
  };

  // Слушатель клика просмотренно
  #handleWatchedClick = (id) => {
    const findFilm = this.#films.find((film) => film.id === id);
    findFilm.isWatched = !findFilm.isWatched;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, findFilm);
  };

  // Слушатель клика для добавления в список просмотренных
  #handleWatchlistClick = (id) => {
    const findFilm = this.#films.find((film) => film.id === id);
    findFilm.isWatchlist = !findFilm.isWatchlist;
    this.#moviesModel.updateFilm(UpdateType.CONTROLS, findFilm);
  };

  #deleteComment = (id) => {
    const findComment = this.#commentsModel.comments.find((comment) => comment.id === id);
    this.#commentsModel.deleteComment(findComment.id);
    this.#moviesModel.updateFilm(UpdateType.DELETE_COMMENT, this.#currentFilm);
  };

  #addComment = (newComment) => {
    this.#commentsModel.addComment(this.#currentFilm.id, newComment);
    this.#moviesModel.updateFilm(UpdateType.ADD_COMMENT, this.#currentFilm);
  };

  // Слушатель для комментария клик по эмоджи
  #handleEmojiClick = (emoji) => {
    this.#currentFilm.newComment.emoji = emoji;
    this.#activePopup.updateData(this.#currentFilm);
  };

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
      this.#clearFilmList();
      this.#reloadFilterList();
      this.#reloadProfile();
      this.#renderContainer();
    }

    if (updateType === UpdateType.ADD_COMMENT) {
      this.#activePopup.updateData(this.#currentFilm, this.#commentsModel.comments);
      this.#clearFilmList();
      this.#reloadFilterList();
      this.#reloadProfile();
      this.#renderContainer();
    }

    if (updateType === UpdateType.CONTROLS) {
      if (this.#activePopup) {
        this.#activePopup.updateData(data, this.#commentsModel.comments);
      }

      this.#clearFilmList();
      this.#reloadFilterList();
      this.#reloadProfile();
      this.#renderContainer();
    }

    this.#updateFilters();
  };
}
// вторая дз
// реализовать добавление и уадление комментов

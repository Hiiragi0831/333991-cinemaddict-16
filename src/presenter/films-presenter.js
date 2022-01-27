import FilmsSectionView from '../view/films-section-view';
import SortLinksView from '../view/sort-view';
import {remove, render, RenderPosition} from '../render';
import FilmCardView from '../view/film-view';
import PopupCardView from '../view/film-details-view';
import ButtonMoreView from '../view/more-views';
import {filterFavoriteMovies, filterWatchedMovies, filterWatchingMovies, sortByDate, sortByRating} from '../utils';
import {SortType, FilterType} from '../const';
import SiteMenuView from '../view/site-menu-view';
import StatsView from '../view/stats-view';
import {FilmsSectionViewEmpty} from '../view/films-section-empty';

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
  #films = [];
  #watchMovies = [];
  #watchedMovies = [];
  #favoriteMovies = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #createdFilms = [];

  // сюда принимаем данные из моделей и записываем их в переменные презентера и с нимим работаем
  constructor(filmsContainer, moviesModel, commentsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#filtersComponent = new SiteMenuView(this.#filterModel);

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

    this.#renderFiltersList();
    this.#renderSortList();
    this.#renderContainer();
  };

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
  #renderFilm = (film, commentary) => {
    const filmComponent = new FilmCardView(film, commentary);
    const filmsContainerElement = this.#filmsSectionComponent.element.querySelector('.films-list__container');

    filmComponent.element.querySelector('.film-card__link').addEventListener(('click'), () => {
      if (this.#activePopup) {
        remove(this.#activePopup);
      }

      this.#createPopup(film, commentary);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      document.addEventListener('click', this.#closeButton);
    });

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

  // Проходимся по циклу
  #renderFilms = (from, to) => {
    this.#createdFilms = [...this.#createdFilms, ...this.#films.slice(from, to).map((film) => this.#renderFilm(film, this.#commentsModel.comments))];
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

  #removeSortList = () => {
    remove(this.#sortComponent);
  };

  #removeFilterList = () => {
    remove(this.#filtersComponent);
  };

  // очистка и рендер списка сортирровки
  #reloadSortList = () => {
    this.#removeSortList();
    this.#renderSortList();
  };

  #reloadFilterList = () => {
    this.#removeFilterList();
    this.#renderFiltersList();
  };

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

    if (this.#activePopup) {
      this.#activePopup.updateData(findFilm, this.#commentsModel.comments);
    }

    this.#moviesModel.updateFilm('film FavoriteClick', findFilm);
    this.#reloadFilterList();
    this.#clearFilmList();
    this.#renderContainer();
  };

  // Слушатель клика просмотренно
  #handleWatchedClick = (id) => {
    const findFilm = this.#films.find((film) => film.id === id);
    findFilm.isWatched = !findFilm.isWatched;

    if (this.#activePopup) {
      this.#activePopup.updateData(findFilm, this.#commentsModel.comments);
    }

    this.#moviesModel.updateFilm('film WatchedClick', findFilm);
    this.#reloadFilterList();
    this.#clearFilmList();
    this.#renderContainer();
  };

  // Слушатель клика для добавления в список просмотренных
  #handleWatchlistClick = (id) => {
    const findFilm = this.#films.find((film) => film.id === id);
    findFilm.isWatchlist = !findFilm.isWatchlist;

    if (this.#activePopup) {
      this.#activePopup.updateData(findFilm, this.#commentsModel.comments);
    }

    this.#moviesModel.updateFilm('film WatchlistClick', findFilm);
    this.#reloadFilterList();
    this.#clearFilmList();
    this.#renderContainer();
  };

  // this.#comments => this.#commentsModel.comments
  #deleteComment = (id) => {
    const findComment = this.#commentsModel.comments.find((comment) => comment.id === id);
    const findFilm = this.#films.find((film) => film.id === findComment.filmId);
    this.#commentsModel.deleteComment(findComment.id);
    this.#activePopup.updateData(findFilm, this.#commentsModel.comments);
    this.#moviesModel.updateFilm('film deleteComment', findFilm);
    this.#reloadFilterList();
    this.#clearFilmList();
    this.#renderContainer();
  };

  #addComment = (newComment) => {
    this.#commentsModel.addComment(newComment);
    const findComment = this.#commentsModel.comments.find((comment) => comment.id === newComment.id);
    const findFilm = this.#films.find((film) => film.id === findComment.filmId);
    this.#activePopup.updateData(findFilm, this.#commentsModel.comments);
    this.#moviesModel.updateFilm('film add Comment', findFilm);
    this.#reloadFilterList();
    this.#clearFilmList();
    this.#renderContainer();
  };

  // Слушатель для комментария клик по эмоджи
  #handleEmojiClick = (emoji) => {
    this.#activePopup.updateData({newComment: {emoji}});
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    if (updateType === 'load films') {
      this.init();
    }
  };
}

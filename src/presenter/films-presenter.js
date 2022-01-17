import FilmsSectionView, {FilmsSectionViewEmpty} from '../view/films-section-view';
import SortLinksView from '../view/sort-view';
import {remove, render, RenderPosition} from '../render';
import FilmCardView from '../view/film-view';
import PopupCardView from '../view/film-details-view';
import ButtonMoreView from '../view/more-views';
import {filterFavoriteMovies, filterWatchedMovies, filterWatchingMovies, sortByDate, sortByRating} from '../utils';
import {SortType, FilterType} from '../const';
import SiteMenuView from '../view/site-menu-view';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #activePopup = null;
  #moviesModel = null;
  #commentsModel = null;
  #filterModel = null;
  #filmsSectionComponent = new FilmsSectionView();
  #sortComponent = new SortLinksView();
  #filtersComponent = new SiteMenuView();
  #noFilmsComponent = new FilmsSectionViewEmpty();
  #loadMoreButtonComponent = new ButtonMoreView();
  #films = [];
  #comments = [];
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

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  // получить фильмы с сортировкой
  get films() {
    switch (this.#filterModel.currentFilter) {
      case FilterType.WATCHLIST:
        this.#films = filterWatchingMovies(this.#moviesModel.films);
        return this.#films;
      case FilterType.HISTORY:
        this.#films = filterWatchedMovies(this.#moviesModel.films);
        return this.#films;
      case FilterType.FAVORITES:
        this.#films = filterFavoriteMovies(this.#moviesModel.films);
        return this.#films;
    }
    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        this.#films = this.#moviesModel.films;
        return this.#films;
      case SortType.DATE:
        this.#films = sortByDate(this.#moviesModel.films);
        return this.#films;
      case SortType.RATING:
        this.#films = sortByRating(this.#moviesModel.films);
        return this.#films;
    }
    return this.#moviesModel.films;
  }

  init = () => {
    this.#films = [...this.films];
    this.#comments = [...this.#commentsModel.comments];

    this.#renderFiltersList();
    this.#renderSortList();
    this.#renderContainer();
  }

  #updateFilters = () => {
    this.#watchMovies = filterWatchingMovies(this.#moviesModel.films);
    this.#watchedMovies = filterWatchedMovies(this.#moviesModel.films);
    this.#favoriteMovies = filterFavoriteMovies(this.#moviesModel.films);
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
  }

  // Рендер списка сортировки
  #renderSortList = () => {
    render(this.#filmsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.currentFilter === filterType) {
      return;
    }

    this.#filterModel.currentFilter = filterType;
    this.#clearFilmList();
    this.#renderContainer();
  }

  #renderFiltersList = () => {
    this.#updateFilters();

    this.#filtersComponent.watchListCount = this.#watchMovies.length;
    this.#filtersComponent.historyCount = this.#watchedMovies.length;
    this.#filtersComponent.favoriteCount = this.#favoriteMovies.length;

    render(this.#filmsContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  }

  // Рендер 1 карточки фильма и создание попап компонента
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
      popupComponent.setEmojiClickHandler(this.#handleEmojiClick.bind(this));
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

    this.#filmPresenter.set(film.id, this.#renderFilm);
    filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick.bind(this));
    filmComponent.setWatchedClickHandler(this.#handleWatchedClick.bind(this));
    filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick.bind(this));
    return filmComponent;
  }

  // Проходимся по циклу
  #renderFilms = (from, to) => {
    this.#createdFilms = [...this.#createdFilms, ...this.#films.slice(from, to).map((film) => this.#renderFilm(film, this.#comments))];
  }

  // Если фильмов нет то рендерим компонент с надписью пусто (Надо переделать на строку)
  #renderNoFilms = () => {
    render(this.#filmsContainer, this.#noFilmsComponent, RenderPosition.AFTEREND);
  }

  // Функция загрузки фильпов по клику
  #initLoadMoreButtonClickHandler = () => {
    const filmsCount = this.films.length;
    let renderedTaskCount = this.#renderedFilmCount;

    this.#loadMoreButtonComponent.setClickHandler(() => {
      this.#renderFilms(renderedTaskCount, renderedTaskCount + this.#renderedFilmCount);

      renderedTaskCount += this.#renderedFilmCount;

      if (renderedTaskCount >= filmsCount) {
        remove(this.#loadMoreButtonComponent);
      }
    });
  }

  // Вывод кнопки
  #renderLoadMoreButton = () => {
    const filmsContainerElement = this.#filmsSectionComponent.element.querySelector('.films-list__container');
    render(filmsContainerElement, this.#loadMoreButtonComponent, RenderPosition.AFTEREND);
    this.#initLoadMoreButtonClickHandler();
  }

  // Вывод контейнера для фильмов и рендер
  #renderContainer = () => {
    const filmsCount = this.films.length;

    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }
    render(this.#filmsContainer, this.#filmsSectionComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(0, Math.min(filmsCount, this.#renderedFilmCount));

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  }

  // Очистка всех карточек фильмов
  #clearFilmList = () => {
    this.#createdFilms.forEach((film) => remove(film));
    remove(this.#loadMoreButtonComponent);
    this.#createdFilms = [];
  }

  // Слушатель Escape
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
    }
  }

  // Слушатель кнопки закрытия
  #closeButton = (evt) => {
    if (evt.target === document.querySelector('.film-details__close-btn')) {
      evt.preventDefault();
      remove(this.#activePopup);
      document.querySelector('body').classList.remove('hide-overflow');
    }
  }

  // Слушатель клика избранного
  #handleFavoriteClick = (id) => {
    const favFilm = this.#films.find((film) => film.id === id);
    favFilm.isFavorite = !favFilm.isFavorite;
  }

  // Слушатель клика просмотренно
  #handleWatchedClick = (id) => {
    const favFilm = this.#films.find((film) => film.id === id);
    favFilm.isWatched = !favFilm.isWatched;
  }

  // Слушатель клика для добавления в список просмотренных
  #handleWatchlistClick = (id) => {
    const favFilm = this.#films.find((film) => film.id === id);
    favFilm.isWatchlist = !favFilm.isWatchlist;
  }

  // Слушатель для комментария клик по эмоджи
  #handleEmojiClick = (emoji) => {
    this.#activePopup.updateData({newComment: {emoji}});
  }

  // хрен пойми что!!!
  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  // хрен пойми что!!!
  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    if (updateType === 'load films') {
      this.init();
    }

    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }
}

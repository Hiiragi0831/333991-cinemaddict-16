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
  #moviesModel = null;
  #commentsModel = null;

  #filmsSectionComponent = new FilmsSectionView();
  #sortComponent = new SortLinksView();
  #noFilmsComponent = new FilmsSectionViewEmpty();
  #loadMoreButtonComponent = new ButtonMoreView();
  #films = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #createdFilms = [];

  // что-то иницилизируем особенно не понятно зачем здесь модель?
  constructor(filmsContainer, moviesModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  // хрен пойми что!!! но как понял, это получить фильмы, но как эта шляпа работает не понятно
  get films() {
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

    this.#renderSortList();
    this.#renderContainer();
  }

  // Сортировка принимает в себя тип сортировки
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

    this.#filmPresenter.set(film.idx, this.#renderFilm);
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
  #handleFavoriteClick = (idx) => {
    const favFilm = this.#films.find((film) => film.idx === idx);
    favFilm.isFavorite = !favFilm.isFavorite;
  }

  // Слушатель клика просмотренно
  #handleWatchedClick = (idx) => {
    const favFilm = this.#films.find((film) => film.idx === idx);
    favFilm.isWatched = !favFilm.isWatched;
  }

  // Слушатель клика для добавления в список просмотренных
  #handleWatchlistClick = (idx) => {
    const favFilm = this.#films.find((film) => film.idx === idx);
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

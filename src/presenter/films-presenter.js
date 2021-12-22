import FilmsSectionView, {FilmsSectionViewEmpty} from '../view/films-section-view';
import SortLinksView from '../view/sort-view';
import {remove, render, RenderPosition} from '../render';
import FilmCardView from '../view/film-view';
import PopupCardView from '../view/film-details-view';
import ButtonMoreView from '../view/more-views';

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

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (films, comments) => {
    this.#films = [...films];
    this.#comments = [...comments];

    this.#renderSort();

    render(this.#filmsContainer, this.#filmsSectionComponent, RenderPosition.BEFOREEND);

    this.#renderContainer();
  }

  #renderSort = () => {
    render(this.#filmsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderFilm = (film, commentary) => {
    const filmComponent = new FilmCardView(film, commentary);
    const popupComponent = new PopupCardView(film, commentary);
    const body = document.querySelector('body');
    const filmsContainerElement = this.#filmsSectionComponent.element.querySelector('.films-list__container');

    const createPopup = () => {
      render(this.#filmsContainer, popupComponent, RenderPosition.AFTEREND);
      body.classList.add('hide-overflow');
      this.#activePopup = popupComponent;
    };

    const closeButton = (evt) => {
      evt.preventDefault();
      popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
        remove(this.#activePopup);
        body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', closeButton);
      });
      document.removeEventListener('keydown', closeButton);
    };

    filmComponent.setClickHandler(() => {
      if (this.#activePopup) {
        remove(this.#activePopup);
      }
      createPopup();
      document.addEventListener('keydown', this.#escKeyDownHandler);
      document.addEventListener('click', closeButton);
    });

    render(filmsContainerElement, filmComponent, RenderPosition.BEFOREEND);

    this.#filmPresenter.set(film.idx, this.#renderFilm);
  }

  #renderFilms = (from, to) => {
    // Метод для рендеринга N-задач за раз
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

  #clearTaskList = () => {
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
    }
  }
}
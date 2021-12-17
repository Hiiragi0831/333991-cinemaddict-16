import ProfileSectionView from './view/profile-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortLinksView from './view/sort-view.js';
import FilmsSectionView, {FilmsSectionViewEmpty} from './view/films-section-view.js';
import FilmCardView from './view/film-view.js';
import ButtonMoreView from './view/more-views.js';
import PopupCardView from './view/film-details-view.js';
import FooterStatisticsView from './view/statistics-view.js';
import {RenderPosition, render, remove} from './render.js';
import {generateMovie} from './mock/movie.js';
import {generateComments} from './utils.js';

const FILM_CARD_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;


const films = Array.from({length: FILM_CARD_COUNT}, generateMovie);
const comments = generateComments(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const renderFilm = (containerElement, film, commentary) => {
  const filmComponent = new FilmCardView(film, commentary);
  const popupComponent = new PopupCardView(film, commentary);
  const body = document.querySelector('body');

  const createPopup = () => {
    render(siteMainElement, popupComponent, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(popupComponent);
      body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const closeButton = (evt) => {
    evt.preventDefault();
    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      remove(popupComponent);
      body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', closeButton);
    });
    document.removeEventListener('keydown', closeButton);
  };

  filmComponent.setClickHandler(() => {
    if (popupComponent.element) {
      remove(popupComponent);
    }
    createPopup();
    document.addEventListener('keydown', onEscKeyDown);
    document.addEventListener('click', closeButton);
  });

  render(containerElement, filmComponent, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new ProfileSectionView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(films), RenderPosition.BEFOREEND);
render(siteMainElement, new SortLinksView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsSectionView(), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new FooterStatisticsView(films), RenderPosition.BEFOREEND);

const filmsContainerElement = document.querySelector('.films-list__container');

if (films.length === 0) {
  render(filmsContainerElement, new FilmsSectionViewEmpty(), RenderPosition.AFTEREND);
} else {
  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilm(filmsContainerElement, films[i], comments);
  }
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedTaskCount = FILM_COUNT_PER_STEP;
  const loadMoreButton = new ButtonMoreView();

  render(filmsContainerElement, loadMoreButton, RenderPosition.AFTEREND);

  loadMoreButton.setClickHandler(() => {
    films
      .slice(renderedTaskCount, renderedTaskCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmsContainerElement, film, comments));

    renderedTaskCount += FILM_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.element.remove();
    }
  });
}

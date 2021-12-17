import ProfileSectionView from './view/profile-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortLinksView from './view/sort-view.js';
import FilmsSectionView, {FilmsSectionViewEmpty} from './view/films-section-view.js';
import FilmCardView from './view/film-view.js';
import ButtonMoreView from './view/more-views.js';
import PopupCardView from './view/film-details-view.js';
import FooterStatisticsView from './view/statistics-view.js';
import {RenderPosition, render} from './render.js';
import {generateMovie} from './mock/movie.js';
import {generateComments} from './utils.js';

const FILM_CARD_COUNT = 0;
const FILM_COUNT_PER_STEP = 5;


const films = Array.from({length: FILM_CARD_COUNT}, generateMovie);
const comments = generateComments(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const renderFilm = (containerElement, film, commentary) => {
  const filmComponent = new FilmCardView(film, commentary);
  const popupComponent = new PopupCardView(film, commentary);
  const popup = document.querySelector('.film-details');
  const body = document.querySelector('body');

  const createPopup = () => {
    render(siteMainElement, popupComponent.element, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      popup.remove();
      body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  const closeButton = (evt) => {
    evt.preventDefault();
    document.querySelector('.film-details__close-btn').addEventListener('click', () => {
      popup.remove();
      body.classList.remove('hide-overflow');
    });
    document.removeEventListener('keydown', closeButton);
  };

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    if (popup) {
      popup.remove();
    }
    createPopup();
    document.addEventListener('keydown', onEscKeyDown);
    document.addEventListener('click', closeButton);
  });

  render(containerElement, filmComponent.element, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new ProfileSectionView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(films).element, RenderPosition.BEFOREEND);
render(siteMainElement, new SortLinksView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsSectionView().element, RenderPosition.BEFOREEND);
render(footerStatisticsElement, new FooterStatisticsView(films).element, RenderPosition.BEFOREEND);

const filmsContainerElement = document.querySelector('.films-list__container');

if (films.length === 0) {
  render(filmsContainerElement, new FilmsSectionViewEmpty().element, RenderPosition.AFTEREND);
} else {
  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilm(filmsContainerElement, films[i], comments);
  }
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedTaskCount = FILM_COUNT_PER_STEP;

  render(filmsContainerElement, new ButtonMoreView().element, RenderPosition.AFTEREND);

  const loadMoreButton = document.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedTaskCount, renderedTaskCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmsContainerElement, film, comments));

    renderedTaskCount += FILM_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

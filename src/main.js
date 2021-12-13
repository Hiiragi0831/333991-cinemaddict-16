import {createProfileTemplate} from './view/profile-view.js';
import SiteMenuView from './view/site-menu-view.js';
import {createSortLinksTemplate} from './view/sort-view.js';
import {createFilmsSectionTemplate} from './view/films-section-view.js';
import {createFilmCardTemplate} from './view/film-view.js';
import {createButtonMoreTemplate} from './view/more-views.js';
import {createPopupTemplate} from './view/film-details-view.js';
import {createFooterStatisticsTemplate} from './view/statistics-view.js';

import {renderTemplate, RenderPosition, renderElement} from './render.js';
import {generateMovie} from './mock/movie';
import {generateComment} from './mock/comment';
import {getRandomInteger} from './utils';

const FILM_CARD_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;


const films = Array.from({length: FILM_CARD_COUNT}, generateMovie);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);
// renderTemplate(siteMainElement, createSiteMenuTemplate(films), RenderPosition.BEFOREEND);
renderElement(siteHeaderElement, new SiteMenuView(films).element, RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortLinksTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmsSectionTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footerStatisticsElement, createFooterStatisticsTemplate(films), RenderPosition.BEFOREEND);

const filmsContainerElement = document.querySelector('.films-list__container');

function generateComments (arr) {
  const newArr = [];

  for (let i = 0; i < arr.length; i++) {
    const randNum = getRandomInteger(0, 5);

    for (let j = 0; j < randNum; j++) {
      newArr.push(generateComment(arr[i].idx));
    }
  }
  return newArr;
}
const comments = generateComments(films);

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(filmsContainerElement, createFilmCardTemplate(films[i], comments), RenderPosition.BEFOREEND);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedTaskCount = FILM_COUNT_PER_STEP;

  renderTemplate(filmsContainerElement, createButtonMoreTemplate(), RenderPosition.AFTEREND);

  const loadMoreButton = document.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedTaskCount, renderedTaskCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsContainerElement, createFilmCardTemplate(film, comments), RenderPosition.BEFOREEND));

    renderedTaskCount += FILM_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

renderTemplate(siteMainElement, createPopupTemplate(films[0], comments), RenderPosition.AFTEREND);

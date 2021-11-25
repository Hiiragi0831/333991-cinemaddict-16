import {createProfileTemplate} from './view/profile-view.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createSortLinksTemplate} from './view/sort-view.js';
import {createFilmsSectionTemplate} from './view/films-section-view.js';
import {createFilmCardTemplate} from './view/film-view.js';
import {createButtonMoreTemplate} from './view/more-views.js';
import {createPopupTemplate} from './view/film-details-view.js';
import {createFooterStatisticsTemplate} from './view/statistics-view.js';

import {renderTemplate, RenderPosition} from './render.js';

const FILM_CARD_COUNT = 5;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortLinksTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmsSectionTemplate(), RenderPosition.BEFOREEND);


const filmsContainerElement = document.querySelector('.films-list__container');

for (let i = 0; i < FILM_CARD_COUNT; i++) {
  renderTemplate(filmsContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(filmsContainerElement, createButtonMoreTemplate(), RenderPosition.AFTEREND);
renderTemplate(siteMainElement, createPopupTemplate(), RenderPosition.AFTEREND);

const footerStatisticsElement = document.querySelector('.footer__statistics');

renderTemplate(footerStatisticsElement, createFooterStatisticsTemplate(), RenderPosition.BEFOREEND);

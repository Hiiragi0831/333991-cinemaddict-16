import ProfileSectionView from './view/profile-view.js';
import FooterStatisticsView from './view/statistics-view.js';
import {RenderPosition, render} from './render.js';
import {generateMovie} from './mock/movie.js';
import {generateComments} from './utils.js';
import FilmsPresenter from './presenter/films-presenter';
import MoviesModel from './model/movies-model';
import CommentsModel from './model/comment-model';
import FilterModel from './model/filter-model';

const FILM_CARD_COUNT = 20;

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
const films = Array.from({length: FILM_CARD_COUNT}, generateMovie);
const comments = generateComments(films);
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

new FilmsPresenter(siteMainElement, moviesModel, commentsModel, filterModel);

render(siteHeaderElement, new ProfileSectionView(), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new FooterStatisticsView(films), RenderPosition.BEFOREEND);

commentsModel.comments = comments;
moviesModel.films = films;

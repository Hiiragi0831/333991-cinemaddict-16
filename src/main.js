import ProfileSectionView from './view/profile-view.js';
import FooterStatisticsView from './view/statistics-view.js';
import {RenderPosition, render} from './render.js';
import FilmsPresenter from './presenter/films-presenter';
import MoviesModel from './model/movies-model';
import CommentsModel from './model/comment-model';
import FilterModel from './model/filter-model';
import ApiService from './api-service';

const AUTHORIZATION = 'Basic Hiiragi0808';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const apiService = new ApiService(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel(apiService);
const commentsModel = new CommentsModel(apiService);
const filterModel = new FilterModel();
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

new FilmsPresenter(siteMainElement, moviesModel, commentsModel, filterModel);

render(siteHeaderElement, new ProfileSectionView(), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new FooterStatisticsView('0'), RenderPosition.BEFOREEND);

moviesModel.init();

import FilmsPresenter from './presenter/films-presenter';
import MoviesModel from './model/movies-model';
import CommentsModel from './model/comment-model';
import FilterModel from './model/filter-model';
import ApiService from './api-service';
import {AUTHORIZATION, END_POINT} from './const';

const apiService = new ApiService(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel(apiService);
const commentsModel = new CommentsModel(apiService);
const filterModel = new FilterModel();
const siteMainElement = document.querySelector('.main');

new FilmsPresenter(siteMainElement, moviesModel, commentsModel, filterModel);
moviesModel.init();

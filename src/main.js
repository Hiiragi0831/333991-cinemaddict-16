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
const siteMainElement = document.querySelector('.main');

new FilmsPresenter(siteMainElement, moviesModel, commentsModel, filterModel);
moviesModel.init();

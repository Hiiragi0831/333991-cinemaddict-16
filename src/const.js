const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const FilterType = {
  All: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATS: 'stats',
};

const TimeUnits = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const FilterStats = {
  All: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const Urls = {
  MOVIES: 'movies',
  COMMENTS: 'comments',
};

const Methods = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const UpdateType = {
  INIT: 'INIT',
  ERROR: 'ERROR',
  ERROR_LOAD_FILM: 'ERROR_LOAD_FILM',
  LOAD_COMMENTS: 'LOAD_COMMENTS',
  LOAD_COMMENTS_ERROR: 'LOAD_COMMENTS_ERROR',
  ADD_COMMENT: 'ADD_COMMENT',
  ERROR_ADD_COMMENT: 'ERROR_ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  DELETE_COMMENT_ERROR: 'DELETE_COMMENT_ERROR',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  CONTROLS: 'CONTROLS',
};

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const MINUTES_IN_HOUR = 60;
const BAR_HEIGHT = 50;
const FILM_COUNT_PER_STEP = 5;
const AUTHORIZATION = 'Basic Hiiragi0808';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

export {
  RenderPosition,
  MINUTES_IN_HOUR,
  BAR_HEIGHT,
  UpdateType,
  Methods,
  Urls,
  FilterStats,
  TimeUnits,
  FilterType,
  SortType,
  AUTHORIZATION,
  END_POINT,
  FILM_COUNT_PER_STEP
};

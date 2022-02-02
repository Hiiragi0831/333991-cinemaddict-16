export const ActionType = {
  CHANGE_SORT: 'CHANGE_SORT',
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  CHANGE_FILTER: 'CHANGE_FILTER',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const FilterType = {
  All: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATS: 'stats',
};

export const EMPTY_MOVIE = {
  id: '',
  title: '',
  date: '',
  description: '',
  runTime: '',
  genres: '',
  genresOne: '',
  isWatchlist: false,
  isWatched: false,
  isFavorite: false,
  image: '',
  rating: '',
  writers: '',
  director: '',
  actors: '',
  country: '',
  age: '',
  newComment: '',
};

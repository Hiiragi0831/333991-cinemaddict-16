import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {SortType, TimeUnits, FilterStats, MINUTES_IN_HOUR} from './const';

dayjs.extend(isBetween);

function byField(field) {
  return (a, b) => a[field] < b[field] ? 1 : -1;
}

const sortByRating = (films) => films.sort(byField(SortType.RATING));
const sortByDate = (films) => films.sort(byField(SortType.DATE));

const filterWatchingMovies = (films) => films.filter((film) => film.isWatchlist);
const filterWatchedMovies = (films) => films.filter((film) => film.isWatched);
const filterFavoriteMovies = (films) => films.filter((film) => film.isFavorite);
const filterMoviesByDate = (films, timeUnit) => films.filter(({watchingDate}) => dayjs(watchingDate).isBetween(dayjs().subtract(1, timeUnit), dayjs()));

const filterStats = (films, filter) => {
  switch (filter) {
    case FilterStats.TODAY:
      return filterMoviesByDate(films, TimeUnits.DAY);
    case FilterStats.WEEK:
      return filterMoviesByDate(films, TimeUnits.WEEK);
    case FilterStats.MONTH:
      return filterMoviesByDate(films, TimeUnits.MONTH);
    case FilterStats.YEAR:
      return filterMoviesByDate(films, TimeUnits.YEAR);
    default:
      return films;
  }
};

const normalizeArray = (list, callback) => list.map(callback);
const getDuration = (films) => films.reduce(((prevValue, {runtime}) => prevValue + runtime), 0);
const getDurationHours = (duration) => Math.floor(duration / MINUTES_IN_HOUR);
const getDurationMinutes = (duration) => duration % MINUTES_IN_HOUR;

const getStatsInfo = (movies) => {
  const stats = {};

  for (const movie of movies) {
    for (const genre of movie.genres) {
      if (stats[genre]) {
        stats[genre] += 1;
        continue;
      }

      stats[genre] = 1;
    }
  }

  return stats;
};

const sortChartGenres = (chartData) => {
  const genres = Object.keys(chartData);
  return genres.sort((firstGenre, secondGenre) => chartData[secondGenre] - firstGenre[secondGenre]);
};

const sortChartValues = (chartData) => {
  const values = Object.values(chartData);
  return values.sort((firstValue, secondValue) => secondValue - firstValue);
};

export {
  sortChartValues,
  sortChartGenres,
  getStatsInfo,
  normalizeArray,
  getDuration,
  getDurationHours,
  getDurationMinutes,
  filterStats,
  filterWatchingMovies,
  filterWatchedMovies,
  filterFavoriteMovies,
  filterMoviesByDate,
  sortByRating,
  sortByDate
};

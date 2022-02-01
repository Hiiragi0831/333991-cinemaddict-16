import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {SortType, TimeUnits, FilterStats, MINUTES_IN_HOUR} from './const';

dayjs.extend(isBetween);

function byField(field) {
  return (a, b) => a[field] < b[field] ? 1 : -1;
}

export const sortByRating = (films) => films.sort(byField(SortType.RATING));
export const sortByDate = (films) => films.sort(byField(SortType.DATE));

export const filterWatchingMovies = (films) => films.filter((film) => film.isWatchlist);
export const filterWatchedMovies = (films) => films.filter((film) => film.isWatched);
export const filterFavoriteMovies = (films) => films.filter((film) => film.isFavorite);
export const filterMoviesByDate = (films, timeUnit) => films.filter(({watchingDate}) => dayjs(watchingDate).isBetween(dayjs().subtract(1, timeUnit), dayjs()));

export const filterStats = (films, filter) => {
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

export default class AbstractObservable {
  #observers = new Set();

  addObserver(observer) {
    this.#observers.add(observer);
  }

  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}

export const normalizeArray = (list, callback) => list.map(callback);
export const getDuration = (films) => films.reduce(((prevValue, {runtime}) => prevValue + runtime), 0);
export const getDurationHours = (duration) => Math.floor(duration / MINUTES_IN_HOUR);
export const getDurationMinutes = (duration) => duration % MINUTES_IN_HOUR;

export const getStatsInfo = (films) => {
  const stats = {};

  for (let i = 0; i < films.length; i++) {
    for (let j = 0; j < films[i].genres.length; j++) {
      if (stats[films[i].genres[j]]) {
        stats[films[i].genres[j]] += 1;
        continue;
      }

      stats[films[i].genres[j]] = 1;
    }
  }

  return stats;
};

export const sortChartGenres = (chartData) => {
  const genres = Object.keys(chartData);
  return genres.sort((firstGenre, secondGenre) => chartData[secondGenre] - firstGenre[secondGenre]);
};

export const sortChartValues = (chartData) => {
  const values = Object.values(chartData);
  return values.sort((firstValue, secondValue) => secondValue - firstValue);
};

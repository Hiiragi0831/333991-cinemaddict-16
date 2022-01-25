import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {END_DATE, MAX_GAP_MINUTES, MIN_GAP_MINUTES, START_DATE, MINUTES_IN_HOUR} from './mock/constants';
import {generateComment} from './mock/comment';
import {SortType, TimeUnits, FilterStats} from './const';

dayjs.extend(isBetween);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const generateRandomMuchString = (elements, quantity) => {
  const elementsCopy = [...elements];
  let randomLength = getRandomInteger(1, elementsCopy.length);

  if (elementsCopy.length >= quantity) {
    randomLength = getRandomInteger(1, quantity);
  }

  const resultElements = [];

  for (let i = 0; i < randomLength; i++) {
    const index = getRandomInteger(0, elementsCopy.length - 1);
    resultElements.push(elementsCopy[index]);
    elementsCopy.splice(index, 1);
  }
  return resultElements;
};


export const getRandomFloat = (a, b, digits = 1) => {
  const lower = Math.min(Math.abs(a), Math.abs(b));
  const upper = Math.max(Math.abs(a), Math.abs(b));

  const result = Math.random() * (upper - lower) + lower;

  return Number(result.toFixed(digits));
};


export const generateRandomString = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};

export const generateRuntime= () => getRandomInteger(MIN_GAP_MINUTES, MAX_GAP_MINUTES);

export const generateDate= () => dayjs(getRandomDate(START_DATE, END_DATE));

export function generateComments (arr) {
  const newArr = [];

  for (let i = 0; i < arr.length; i++) {
    const randNum = getRandomInteger(0, 5);

    for (let j = 0; j < randNum; j++) {
      newArr.push(generateComment(arr[i].id));
    }
  }
  return newArr;
}

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

export const getDuration = (films) => films.reduce(((prevValue, {runTime}) => prevValue + runTime), 0);
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

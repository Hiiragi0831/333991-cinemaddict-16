import {
  getRandomInteger,
  getRandomFloat,
  generateRandomString,
  generateRandomMuchString, generateRuntime, generateDate
} from '../utils.js';

import {
  DEFAULT_MIN_NUMBER,
  FILMS_ACTORS, FILMS_COUNTRIES,
  FILMS_DESCRIPTIONS, FILMS_DIRECTORS,
  FILMS_GENRES,
  FILMS_POSTERS,
  FILMS_SCREEN_WRITERS,
  FILMS_TITLES,
  MAX_RATING_NUMBER,
  MIN_RATING_NUMBER,
  RATING_DECIMAL,
  DEFAULT_MAX_NUMBER,
  MAX_GENRES_COUNT,
  MAX_DESCRIPTIONS_COUNT,
  MAX_AGE,
} from './constants';

export const generateMovie = () => {
  const date = generateDate();
  const runTime = generateRuntime();
  const genres = generateRandomMuchString(FILMS_GENRES, MAX_GENRES_COUNT);
  const description = generateRandomMuchString(FILMS_DESCRIPTIONS, MAX_DESCRIPTIONS_COUNT);
  const writers = generateRandomMuchString(FILMS_SCREEN_WRITERS, MAX_DESCRIPTIONS_COUNT).join(', ');
  const actors = generateRandomMuchString(FILMS_ACTORS, MAX_DESCRIPTIONS_COUNT).join(', ');
  const idx = Math.random().toString(10).substr(2, 9);

  return {
    idx,
    title: generateRandomString(FILMS_TITLES),
    date,
    description: description.join(' '),
    runTime,
    genres,
    genresOne: generateRandomString(genres),
    isWatchlist: Boolean(getRandomInteger(DEFAULT_MIN_NUMBER, DEFAULT_MAX_NUMBER)),
    isWatched: Boolean(getRandomInteger(DEFAULT_MIN_NUMBER, DEFAULT_MAX_NUMBER)),
    isFavorite: Boolean(getRandomInteger(DEFAULT_MIN_NUMBER, DEFAULT_MAX_NUMBER)),
    image: generateRandomString(FILMS_POSTERS),
    rating: getRandomFloat(MIN_RATING_NUMBER, MAX_RATING_NUMBER, RATING_DECIMAL),
    writers,
    director: generateRandomString(FILMS_DIRECTORS),
    actors,
    country: generateRandomString(FILMS_COUNTRIES),
    age: getRandomInteger(DEFAULT_MIN_NUMBER, MAX_AGE),
    newComment: {emoji: null},
  };
};

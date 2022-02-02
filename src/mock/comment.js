import {generateRandomMuchString, generateRandomString, getRandomDate} from '../utils';
import {
  COMMENTS_AUTHORS,
  COMMENTS_EMOTION,
  END_DATE,
  FILMS_DESCRIPTIONS,
  MAX_DESCRIPTIONS_COUNT,
  START_DATE
} from './constants';
import dayjs from 'dayjs';

export const generateComment = (filmId) => {
  const id = Math.random().toString(10).substr(2, 9);
  return {
    id,
    filmId,
    text: generateRandomMuchString(FILMS_DESCRIPTIONS, MAX_DESCRIPTIONS_COUNT).join(', '),
    emotion: generateRandomString(COMMENTS_EMOTION),
    author: generateRandomString(COMMENTS_AUTHORS),
    date: dayjs(getRandomDate(START_DATE, END_DATE)),
  };
};

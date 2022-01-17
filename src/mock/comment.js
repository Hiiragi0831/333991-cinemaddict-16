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

export const generateComment = (id) => ({
  id,
  text: generateRandomMuchString(FILMS_DESCRIPTIONS, MAX_DESCRIPTIONS_COUNT),
  emotion: generateRandomString(COMMENTS_EMOTION),
  author: generateRandomString(COMMENTS_AUTHORS),
  date: dayjs(getRandomDate(START_DATE, END_DATE)),
});

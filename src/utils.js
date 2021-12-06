import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {MAX_GAP_MINUTES, MIN_GAP_MINUTES, START_DATE, END_DATE} from './mock/constants';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

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

export const generateRuntime= () => {
  dayjs.extend(duration);
  const runtime = getRandomInteger(MIN_GAP_MINUTES, MAX_GAP_MINUTES);

  return dayjs.duration(runtime, 'minutes');
};

export const generateDate= () => dayjs(getRandomDate(START_DATE, END_DATE));

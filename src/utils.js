import dayjs from 'dayjs';
import {END_DATE, MAX_GAP_MINUTES, MIN_GAP_MINUTES, START_DATE} from './mock/constants';
import {generateComment} from './mock/comment';

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
      newArr.push(generateComment(arr[i].idx));
    }
  }
  return newArr;
}

function byField(field) {
  return (a, b) => a[field] < b[field] ? 1 : -1;
}

export const sortByRating = (films) => films.sort(byField('rating'));
export const sortByDate = (films) => films.sort(byField('date'));

// что и для чего?? судя по всему что-то за кем-то следит
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

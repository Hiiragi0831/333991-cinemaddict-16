const FILMS_TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const FILMS_POSTERS = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',
];

const FILMS_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const FILMS_GENRES = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery',
];

const FILMS_DIRECTORS = [
  'Ida Lupino',
  'Bong Joon Ho',
  'Guillermo del Toro',
  'David Cronenberg',
  'Sidney Lumet',
  'Woody Allen',
  'Kathryn Bigelow',
];

const FILMS_SCREEN_WRITERS = [
  'Ola Balogun',
  'Biyi Bandele',
  'Nicole Asinugo',
  'Jude Idada',
  'Kehinde Olorunyomi',
  'Tade Ogidan',
  'Chika Anadu',
  'Jeffrey Musa',
  'Kemi Adesoye',
  'Chet Anekwe',
];

const FILMS_ACTORS = [
  'Casey Affleck',
  'Adam Driver',
  'Michael Keaton',
  'Rami Malek',
  'Gary Oldman',
  'Chiwetel Ejiofor',
  'Kerry Armstrong',
  'Wendy Hughes',
  'Angourie Rice',
  'Sacha Horler',
  'Noni Hazlehurst',
  'Rose Byrne',
  'Sheila Florance',
];

const FILMS_COUNTRIES = [
  'USA',
  'Canada',
  'Russia',
  'China',
  'France',
];

const COMMENTS_EMOTION = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

const COMMENTS_AUTHORS = [
  'Tim Macoveev',
  'John Doe',
  'Hiiragi Renji',
  'Hinata Hatari ',
  'Kamina Dziha',
  'Shiba Tatsuya',
  'Erika Chiba',
];

const DEFAULT_MIN_NUMBER = 0;
const DEFAULT_MAX_NUMBER = 1;
const MIN_GAP_MINUTES = 40;
const MAX_GAP_MINUTES = 240;
const MIN_RATING_NUMBER = 0;
const MAX_RATING_NUMBER = 10;
const RATING_DECIMAL = 1;
const MAX_GENRES_COUNT = 3;
const MAX_DESCRIPTIONS_COUNT = 5;
const START_DATE = new Date(1940, 0, 1);
const END_DATE = new Date(2000, 0, 1);
const MAX_AGE = 18;

export {
  FILMS_TITLES,
  FILMS_POSTERS,
  FILMS_DESCRIPTIONS,
  FILMS_GENRES,
  FILMS_DIRECTORS,
  FILMS_SCREEN_WRITERS,
  FILMS_ACTORS,
  FILMS_COUNTRIES,
  COMMENTS_EMOTION,
  COMMENTS_AUTHORS,
  DEFAULT_MIN_NUMBER,
  DEFAULT_MAX_NUMBER,
  MIN_GAP_MINUTES,
  MAX_GAP_MINUTES,
  MIN_RATING_NUMBER,
  MAX_RATING_NUMBER,
  RATING_DECIMAL,
  MAX_GENRES_COUNT,
  MAX_DESCRIPTIONS_COUNT,
  START_DATE,
  END_DATE,
  MAX_AGE
};

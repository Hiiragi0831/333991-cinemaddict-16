export const normalizeMovie = (
  {
    id,
    comments,
    film_info: {
      title,
      alternative_title: originalTitle,
      total_rating: rating,
      poster,
      age_rating: age,
      director,
      writers: writers,
      actors,
      release: {
        date: releaseDate,
        release_country: country,
      },
      runtime,
      genre: genres,
      description,
    },
    user_details: {
      watchlist: isWatchlist,
      already_watched: isWatched,
      watching_date: watchingDate,
      favorite: isFavorite,
    }}) => ({
  id,
  poster,
  title,
  originalTitle,
  rating,
  director,
  writers,
  actors,
  releaseDate,
  runtime,
  country,
  genres,
  description,
  age,
  comments,
  isWatchlist,
  isWatched,
  isFavorite,
  watchingDate,
});

export const normalizeMovieServer = (
  {
    id,
    poster,
    title,
    originalTitle,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    runtime,
    country,
    genres,
    description,
    age,
    comments,
    isWatchlist,
    isWatched,
    isFavorite,
    watchingDate,
  }) => ({
  id,
  comments,
  'film_info': {
    title,
    'alternative_title': originalTitle,
    'total_rating': rating,
    poster,
    'age_rating': age,
    director,
    writers: writers,
    actors,
    release: {
      'date': releaseDate,
      'release_country': country,
    },
    runtime,
    genre: genres,
    description,
  },
  'user_details': {
    watchlist: isWatchlist,
    'already_watched': isWatched,
    'watching_date': watchingDate,
    favorite: isFavorite,
  },
});

export const normalizeComment = ({id, comment, emotion, author, date}) => ({
  id,
  text: comment,
  emotion,
  author,
  date,
});

export const normalizeCommentServer = ({text, emotion}) => ({
  comment: text,
  emotion,
});

export const normalizeUser = ({avatar, rating}) => ({
  avatar,
  rating,
});

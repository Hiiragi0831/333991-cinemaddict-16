export const createFilmCardTemplate = (film, comments) => {
  const {title, description, releaseDateYear, rating, runTime, genresOne, image, isWatchlist, isWatched, isFavorite} = film;

  const watchlistClassName = isWatchlist ? 'film-card__controls-item--active' : '';
  const watchedClassName = isWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = isFavorite ? 'film-card__controls-item--active' : '';

  let commentsMove = 0;

  for (let i = 0; i < comments.length; i++) {
    if (film.idx === comments[i].idx) {
      commentsMove++;
    }
  }

  return`<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDateYear}</span>
        <span class="film-card__duration">${runTime}</span>
        <span class="film-card__genre">${genresOne}</span>
      </p>
      <img src="${image}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsMove} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

import {Methods, Urls} from './const';
import {normalizeCommentServer, normalizeMovieServer} from './helps/normalize';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor (endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: Urls.MOVIES});
  }

  getMoviesComments = (movieId) => this.#load({url: `${Urls.COMMENTS}/${movieId}`})

  updateMovie = (movie) => this.#load({
    url: `${Urls.MOVIES}/${movie.id}`,
    method: Methods.PUT,
    body: JSON.stringify(normalizeMovieServer(movie)),
    headers: new Headers({'Content-Type': 'application/json'}),
  });

  addComment = (movieId, comment) => this.#load({
    url: `${Urls.COMMENTS}/${movieId}`,
    method: Methods.POST,
    body: JSON.stringify(normalizeCommentServer(comment)),
    headers: new Headers({'Content-Type': 'application/json'}),
  });

  deleteComment = (commentId) => this.#load({
    url: `${Urls.COMMENTS}/${commentId}`,
    method: Methods.DELETE,
  });

  #load = async ({
    url,
    method = Methods.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    try {
      const response = await fetch(`${this.#endPoint}/${url}`, {method, body, headers});

      ApiService.checkStatus(response);

      return response;

    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}

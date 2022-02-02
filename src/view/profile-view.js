import AbstractView from './abstract-view';

const createProfileTemplate = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileSectionView extends AbstractView {
  #number = null;
  #rating = '';

  get template() {
    return createProfileTemplate(this.#rating);
  }

  ratingSet= (number) => {
    this.#number = number;

    if (this.#number >= 21) {
      this.#rating = 'movie buff';
    } else if (this.#number >= 11) {
      this.#rating = 'fan';
    } else if (this.#number >= 1){
      this.#rating = 'novice';
    } else {
      this.#rating = '';
    }
  }
}

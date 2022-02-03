import AbstractView from './abstract-view.js';

class SmartView extends AbstractView {
  _data = {};
  #events = {};

  updateData = (update) => {
    if (!update) {
      return;
    }
    this._data = {...this._data, ...update};

    this.updateElement();
  }

  updateElement = () => {
    const scrollPosition = this.element.scrollTop;
    this.replaceElement();
    this.element.scrollTop = scrollPosition;
    this.restoreHandlers();
  }

  addEvent = (eventTitle, event, callback, element = this.element) => {
    this.#events[eventTitle] = callback;
    element.addEventListener(event, callback);
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}

export default SmartView;

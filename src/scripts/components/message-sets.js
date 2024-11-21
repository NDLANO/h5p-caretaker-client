import { MessageSet } from './message-set.js';

export class MessageSets {

  #dom;
  #messageSets;

  constructor(params = {}) {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-sets');

    this.#messageSets = {};

    if (Object.keys(params.sets).length === 0) {
      return;
    }

    for (const id in params.sets) {
      this.#messageSets[id] = new MessageSet({
        id: id,
        sections: params.sets[id],
        messages: params.messages,
        translations: params.translations,
        l10n: {
          expandAllMessages: params.l10n.expandAllMessages,
          collapseAllMessages: params.l10n.collapseAllMessages
        }
      });
      this.#dom.append(this.#messageSets[id].getDOM());
    }

    this.show(Object.keys(this.#messageSets)[0]);
  }

  /**
   * Get the DOM element.
   * @returns {HTMLElement} DOM element.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Show a message set.
   * @param {string} id The id of the message set to show.
   */
  show(id) {
    if (!this.#messageSets[id]) {
      return;
    }

    for (const key in this.#messageSets) {
      if (key === id) {
        this.#messageSets[key].show();
      }
      else {
        this.#messageSets[key].hide();
      }
    }
  }
}

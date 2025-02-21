import { MessageAccordion } from './message-accordion.js';

export class MessageSet {
  #dom;
  #accordions = [];

  /**
   * @class MessageSet
   * @param {object} params Parameters for the message set.
   */
  constructor(params = {}) {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-set');

    params.sections.forEach((section) => {
      const messages = params.messages.filter((message) => message[params.id] === section.id);
      if (!messages.length) {
        return;
      }

      const accordion = new MessageAccordion({
        type: section.id,
        header: section.header,
        messages: messages,
        translations: params.translations,
        l10n: params.l10n
      });
      this.#accordions.push(accordion);

      this.#dom.append(accordion.getDOM());
    });
  }

  /**
   * Get the DOM element.
   * @returns {HTMLElement} The DOM element of the message set.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Filter the message set.
   * @param {string[]} subcontentIds Subcontent IDs of contents to show.
   */
  filter(subcontentIds) {
    this.#accordions.forEach((accordion) => {
      accordion.filter(subcontentIds);
    });
  }

  /**
   * Show the message set.
   */
  show() {
    this.#dom.classList.remove('display-none');
  }

  /**
   * Hide the message set.
   */
  hide() {
    this.#dom.classList.add('display-none');
  }
}

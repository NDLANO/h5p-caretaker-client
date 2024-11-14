import { MessageAccordionPanel } from './message-accordion-panel.js';

export class MessageAccordion {

  #dom;

  /**
   * @class
   * @param {object} params Parameters for the message accordion.
   */
  constructor(params = {}) {

    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-accordion');

    const header = document.createElement('div');
    header.classList.add('message-accordion-header');
    header.innerText = params.translations[`${params.type}`];
    this.#dom.append(header);

    const panels = document.createElement('ul');
    panels.classList.add('message-accordion-panels-list');
    this.#dom.append(panels);

    params.messages.forEach((message) => {
      const listItem = document.createElement('li');
      listItem.classList.add('message-accordion-panels-list-item');

      const panel = new MessageAccordionPanel({
        message: message,
        translations: params.translations
      });
      listItem.append(panel.getDOM());

      panels.append(listItem);
    });
  }

  /**
   * Get message accordion DOM.
   * @returns {HTMLElement} The DOM element of the message accordion.
   */
  getDOM() {
    return this.#dom;
  }
}

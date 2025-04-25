import { TypeAccordionPanel } from './type-accordion-panel.js';

export class MessageAccordion {

  #dom;
  #allFiltered;
  #panels = [];

  /**
   * @class
   * @param {object} params Parameters for the message accordion.
   */
  constructor(params = {}) {

    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-accordion');
    this.#dom.style.setProperty(
      '--message-accordion-header-icon',
      `var(--message-accordion-header-icon-${params.type})`
    );

    const anchor = document.createElement('a');
    anchor.classList.add('message-accordion-header-anchor');
    anchor.setAttribute('name', `${params.type}`);
    this.#dom.append(anchor);

    const header = document.createElement('div');
    header.classList.add('message-accordion-header');

    this.#dom.append(header);

    const text = document.createElement('p');
    text.classList.add('message-accordion-header-text');
    text.innerText = params.header;

    header.append(text);

    const panelsDOM = document.createElement('ul');
    panelsDOM.classList.add('type-accordion-panels-list');
    this.#dom.append(panelsDOM);

    const types = [...(new Set(params.messages.map((message) => message.type)))];
    types.forEach((type) => {
      const listItem = document.createElement('li');
      listItem.classList.add('type-accordion-panels-list-item');

      const typeAccordionPanel = new TypeAccordionPanel({
        type: type,
        messages: params.messages.filter((message) => message.type === type),
        translations: params.translations,
        l10n: {
          nextMessage: params.l10n.nextMessage,
          previousMessage: params.l10n.previousMessage,
          showDetails: params.l10n.showDetails,
          hideDetails: params.l10n.hideDetails
        }
      });
      this.#panels.push(typeAccordionPanel);
      listItem.append(typeAccordionPanel.getDOM());
      panelsDOM.append(listItem);
    });

    this.#allFiltered = document.createElement('div');
    this.#allFiltered.classList.add('message-accordion-all-filtered');
    this.#allFiltered.classList.add('display-none');
    this.#allFiltered.innerHTML = params.l10n.allFilteredOut;
    this.#dom.append(this.#allFiltered);
  }

  /**
   * Get message accordion DOM.
   * @returns {HTMLElement} The DOM element of the message accordion.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Filter the message accordion.
   * @param {string[]} subcontentIds Subcontent IDs of contents to show.
   */
  filter(subcontentIds) {
    this.#panels.forEach((panel) => {
      panel.filter(subcontentIds);
    });

    if (this.#panels.some((panel) => panel.isVisible())) {
      this.#allFiltered.classList.add('display-none');
    }
    else {
      this.#allFiltered.classList.remove('display-none');
    }
  }
}

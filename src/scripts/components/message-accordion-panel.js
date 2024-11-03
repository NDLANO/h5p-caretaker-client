import { createUUID } from '@services/util.js';
import { MessageContent } from './message-content.js';

export class MessageAccordionPanel {

  #dom;

  /**
   * @class
   * @param {object} params Parameters for the message accordion panel.
   * @param {object} params.message Message object.
   * @param {object} params.translations Translations object.
   */
  constructor(params = {}) {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-accordion-panel');

    const headerId = createUUID();
    const contentId = createUUID();

    const header = document.createElement('div');
    header.classList.add('message-accordion-panel-header');
    header.setAttribute('Id', headerId);

    const icon = document.createElement('span');
    icon.classList.add('message-accordion-panel-icon');
    header.append(icon);

    const button = document.createElement('button');
    button.classList.add('message-accordion-panel-button');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', contentId);
    button.innerText = params.message.summary;
    header.append(button);

    if (params.message.level && params.translations[params.message.level]) {
      const level = document.createElement('span');
      level.classList.add('message-accordion-panel-level');
      level.classList.add(params.message.level);
      level.innerText = params.translations[params.message.level];
      header.append(level);
    }

    this.#dom.append(header);

    const contentGrid = document.createElement('div');
    contentGrid.setAttribute('Id', contentId);
    contentGrid.classList.add('message-accordion-panel-content-grid');
    contentGrid.setAttribute('role', 'region');
    contentGrid.setAttribute('aria-labelledby', headerId);
    contentGrid.setAttribute('aria-hidden', 'true');

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('message-accordion-panel-content-wrapper');
    const content = new MessageContent({
      message: params.message,
      translations: params.translations
    });
    contentWrapper.append(content.getDOM());
    contentGrid.append(contentWrapper);

    this.#dom.append(contentGrid);

    this.#dom.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      contentGrid.setAttribute('aria-hidden', isExpanded.toString());
      button.setAttribute('aria-expanded', (!isExpanded).toString());
    });
  }

  /**
   * Get DOM element of the message accordion panel.
   * @returns {HTMLElement} The DOM element of the message accordion panel.
   */
  getDOM() {
    return this.#dom;
  }
}

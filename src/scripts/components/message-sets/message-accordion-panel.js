import { createUUID } from '@services/util.js';
import { MessageContent } from './message-content.js';

export class MessageAccordionPanel {

  #dom;
  #contentGrid;
  #button;
  #content;
  #isVisibleState = true;
  #callbacks;

  /**
   * @class
   * @param {object} params Parameters for the message accordion panel.
   * @param {object} params.message Message object.
   * @param {object} params.translations Translations object.
   * @param {object} callbacks Callbacks.
   */
  constructor(params = {}, callbacks = {}) {
    this.#callbacks = callbacks;
    this.#callbacks.expandedStateChanged = this.#callbacks.expandedStateChanged ?? (() => {});

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

    this.#button = document.createElement('button');
    this.#button.classList.add('message-accordion-panel-button');
    this.#button.setAttribute('aria-expanded', 'false');
    this.#button.setAttribute('aria-controls', contentId);
    this.#button.innerText = params.message.summary;
    header.append(this.#button);

    if (params.message.level && params.translations[params.message.level]) {
      const level = document.createElement('span');
      level.classList.add('message-accordion-panel-level');
      level.classList.add(params.message.level);
      level.innerText = params.translations[params.message.level];
      header.append(level);
    }

    this.#dom.append(header);

    this.#contentGrid = document.createElement('div');
    this.#contentGrid.setAttribute('Id', contentId);
    this.#contentGrid.classList.add('message-accordion-panel-content-grid');
    this.#contentGrid.setAttribute('role', 'region');
    this.#contentGrid.setAttribute('aria-labelledby', headerId);
    this.#contentGrid.setAttribute('hidden', '');

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('message-accordion-panel-content-wrapper');
    this.#content = new MessageContent({
      message: params.message,
      translations: params.translations
    });
    contentWrapper.append(this.#content.getDOM());
    this.#contentGrid.append(contentWrapper);

    this.#dom.append(this.#contentGrid);

    this.#dom.addEventListener('click', () => {
      this.toggle();
    });
  }

  /**
   * Get DOM element of the message accordion panel.
   * @returns {HTMLElement} The DOM element of the message accordion panel.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Check if the panel is visible.
   * @returns {boolean} True if panel is visible, else false.
   */
  isVisible() {
    return this.#isVisibleState;
  }

  /**
   * Check if the panel is expanded.
   * @returns {boolean} Whether the panel is expanded.
   */
  isExpanded() {
    return this.#button.getAttribute('aria-expanded') === 'true';
  }

  /**
   * Toggle the panel's expanded state.
   * @param {boolean} [state] The desired expanded state of the panel.
   */
  toggle(state) {
    const targetState = (typeof state === 'boolean') ?
      state :
      this.#button.getAttribute('aria-expanded') !== 'true';

    if (targetState) {
      this.expand();
    }
    else {
      this.collapse();
    }
  }

  /**
   * Filter the panel
   * @param {string[]} subContentIds Sub-content IDs of contents to show.
   */
  filter(subContentIds) {
    if (!subContentIds || subContentIds.includes(this.#content.getSubContentId())) {
      this.show();
    }
    else {
      this.collapse();
      this.hide();
    }
  }

  /**
   * Show.
   */
  show() {
    this.#dom.classList.remove('display-none');
    this.#isVisibleState = true;
  }

  /**
   * Hide.
   */
  hide() {
    this.#dom.classList.add('display-none');
    this.#isVisibleState = false;
  }

  /**
   * Expand the panel.
   */
  expand() {
    this.#contentGrid.removeAttribute('hidden');
    this.#button.setAttribute('aria-expanded', 'true');

    this.#callbacks.expandedStateChanged(true);
  }

  /**
   * Collapse the panel.
   */
  collapse() {
    this.#contentGrid.setAttribute('hidden', '');
    this.#button.setAttribute('aria-expanded', 'false');

    this.#callbacks.expandedStateChanged(false);
  }
}

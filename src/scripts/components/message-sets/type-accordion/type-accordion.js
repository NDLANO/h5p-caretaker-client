import { TypeAccordionPanel } from './type-accordion-panel.js';

export class TypeAccordion {

  #callbacks;
  #dom;
  #allFiltered;
  #panels = [];

  /**
   * @class
   * @param {object} params Parameters for the message accordion.
   * @param {object} callbacks Callbacks for the message accordion.
   */
  constructor(params = {}, callbacks = {}) {
    this.#callbacks = callbacks ?? {};
    this.#callbacks.onFieldEdit = this.#callbacks.onFieldEdit ?? (() => {});

    this.#dom = document.createElement('div');
    this.#dom.classList.add('type-accordion');
    this.#dom.style.setProperty(
      '--type-accordion-header-icon',
      `var(--type-accordion-header-icon-${params.type})`
    );

    const anchor = document.createElement('a');
    anchor.classList.add('type-accordion-header-anchor');
    anchor.setAttribute('name', `${params.type}`);
    this.#dom.append(anchor);

    const header = document.createElement('div');
    header.classList.add('type-accordion-header');

    this.#dom.append(header);

    const text = document.createElement('p');
    text.classList.add('type-accordion-header-text');
    text.innerText = params.header;

    header.append(text);

    const panelsDOM = document.createElement('ul');
    panelsDOM.classList.add('type-accordion-panels-list');
    this.#dom.append(panelsDOM);

    const types = [...(new Set(params.messages.map((message) => message.type)))];
    types.forEach((type) => {
      const listItem = document.createElement('li');
      listItem.classList.add('type-accordion-panels-list-item');

      const typeAccordionPanel = new TypeAccordionPanel(
        {
          type: type,
          messages: params.messages.filter((message) => message.type === type),
          translations: params.translations,
          l10n: {
            nextMessage: params.l10n.nextMessage,
            previousMessage: params.l10n.previousMessage,
            showDetails: params.l10n.showDetails,
            hideDetails: params.l10n.hideDetails
          }
        },
        {
          onFieldEdit: (uuids, value) => {
            this.#callbacks.onFieldEdit(uuids, value);
          }
        }
      );
      this.#panels.push(typeAccordionPanel);
      listItem.append(typeAccordionPanel.getDOM());
      panelsDOM.append(listItem);
    });

    this.#allFiltered = document.createElement('div');
    this.#allFiltered.classList.add('type-accordion-all-filtered');
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

  /**
   * Ensure all fields use their current values as initial values.
   */
  makeCurrentValuesInitial() {
    this.#panels.forEach((panel) => {
      panel.makeCurrentValuesInitial();
    });
  }

  /**
   * Clear the pending state of all panels.
   */
  clearPendingState() {
    this.#panels.forEach((panel) => {
      panel.clearPendingState();
    });
  }

  /**
   * Update message edit fields.
   * @param {string[]} uuids UUIDs of the fields to update.
   * @param {string} value Value to set.
   */
  updateFields(uuids, value) {
    this.#panels.forEach((panel) => {
      panel.updateFields(uuids, value);
    });
  }

  getEdits() {
    return this.#panels.map((panel) => panel.getEdits()).flat();
  }
}

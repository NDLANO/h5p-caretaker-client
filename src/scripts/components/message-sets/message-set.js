import { TypeAccordion } from './type-accordion/type-accordion.js';

export class MessageSet {
  #callbacks;
  #dom;
  #accordions = [];

  /**
   * @class MessageSet
   * @param {object} params Parameters for the message set.
   * @param {object} callbacks Callbacks for the message set.
   */
  constructor(params = {}, callbacks = {}) {
    this.#callbacks = callbacks ?? {};
    this.#callbacks.onFieldEdit = this.#callbacks.onFieldEdit ?? (() => {});

    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-set');

    params.sections.forEach((section) => {
      const messages = params.messages.filter((message) => message[params.id] === section.id);
      if (!messages.length) {
        return;
      }

      const accordion = new TypeAccordion(
        {
          type: section.id,
          header: section.header,
          messages: messages,
          translations: params.translations,
          l10n: params.l10n
        },
        {
          onFieldEdit: (uuids, value) => {
            this.#callbacks.onFieldEdit(uuids, value);
          }
        }
      );
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

  /**
   * Ensure all fields use their current values as initial values.
   */
  makeCurrentValuesInitial() {
    this.#accordions.forEach((accordion) => {
      accordion.makeCurrentValuesInitial();
    });
  }

  /**
   * Clear the pending state of all accordions.
   */
  clearPendingState() {
    this.#accordions.forEach((accordion) => {
      accordion.clearPendingState();
    });
  }

  /**
   * Update message edit fields.
   * @param {string[]} uuids UUIDs of the messages to update.
   * @param {string} value Value to set the fields to.
   */
  updateFields(uuids, value) {
    this.#accordions.forEach((accordion) => {
      accordion.updateFields(uuids, value);
    });
  }

  getEdits() {
    return this.#accordions.map((accordion) => accordion.getEdits()).flat();
  }
}

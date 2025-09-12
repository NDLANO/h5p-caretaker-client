import { MessageSet } from './message-set.js';

export class MessageSets {

  #dom;
  #messageSets;
  #callbacks;

  /**
   * @class MessageSets
   * @param {object} params Parameters for the message sets.
   * @param {object} params.sets Sets of messages.
   * @param {object} params.messages Messages object.
   * @param {object} params.translations Translations object.
   * @param {object} params.l10n Localization object.
   * @param {object} callbacks Callbacks for the message sets.
   * @param {function} callbacks.onFieldEdit Callback for when a message field is edited.
   */
  constructor(params = {}, callbacks = {}) {
    this.#callbacks = callbacks ?? {};
    this.#callbacks.onFieldEdit = this.#callbacks.onFieldEdit ?? (() => {});

    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-sets');

    this.#messageSets = {};

    for (const id in params.sets) {
      params.sets[id] = params.sets[id]
        .filter((section) => typeof section === 'string' || typeof section?.id === 'string')
        .map((section) => {
          if (typeof section === 'string') {
            section = { id: section };
          }
          section.header = section.header ?? params.translations[section.id];

          return section;
        });

      if (!params.sets[id].length) {
        delete params.sets[id];
      }
    }

    if (Object.keys(params.sets).length === 0) {
      return;
    }

    for (const id in params.sets) {
      this.#messageSets[id] = new MessageSet(
        {
          id: id,
          sections: params.sets[id],
          messages: params.messages,
          translations: params.translations,
          l10n: params.l10n
        },
        {
          onFieldEdit: (uuids, value) => {
            this.#updateFields(uuids, value);
          }
        }
      );
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

  /**
   * Filter for subcontent ids.
   * @param {string[]} subcontentIds Massages to filter for by subcontent id.
   */
  filter(subcontentIds) {
    for (const key in this.#messageSets) {
      this.#messageSets[key].filter(subcontentIds);
    }
  }

  /**
   * Ensure all fields use their current values as initial values.
   */
  makeCurrentValuesInitial() {
    for (const key in this.#messageSets) {
      this.#messageSets[key].makeCurrentValuesInitial();
    }
  }

  /**
   * Clear the pending state of all message sets.
   */
  clearPendingState() {
    for (const key in this.#messageSets) {
      this.#messageSets[key].clearPendingState();
    }
  }

  getEdits() {
    const allEdits = Object.keys(this.#messageSets).map((key) => this.#messageSets[key].getEdits()).flat();

    // MessageSets can contain multiple messages with the same field, remove duplicates
    return [...new Map(allEdits.map((edit) => [edit.uuid, edit])).values()];
  }

  #updateFields(uuids, value) {
    Object.keys(this.#messageSets).forEach((key) => {
      this.#messageSets[key].updateFields(uuids, value);
    });

    this.#callbacks.onFieldEdit();
  }
}

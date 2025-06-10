import { MessageContent } from './message-content.js';

export class CarouselItem {
  #callbacks;
  #dom;
  #messageContent;
  #available = true;

  /**
   * @class CarouselItem
   * @param {object} params Parameters for the carousel item.
   * @param {object} callbacks Callbacks for the carousel item.
   */
  constructor(params = {}, callbacks = {}) {
    this.#callbacks = callbacks ?? {};
    this.#callbacks.onFieldEdit = this.#callbacks.onFieldEdit ?? (() => {});

    this.#dom = document.createElement('div');
    this.#dom.classList.add('carousel-item');
    this.#dom.setAttribute('role', 'group');
    this.#dom.setAttribute('aria-roledescription', 'slide');
    this.#dom.setAttribute('aria-labelledby', `carousel-item-summary-${params.carouselUuid}-${params.index}`);

    const head = document.createElement('div');
    head.classList.add('carousel-item-header');
    this.#dom.append(head);

    const summary = document.createElement('span');
    summary.setAttribute('id', `carousel-item-summary-${params.carouselUuid}-${params.index}`);
    summary.classList.add('summary');
    summary.innerText = params.message.summary;
    head.append(summary);

    const level = document.createElement('span');
    level.classList.add('level');
    level.classList.add(params.message.level);
    level.innerText = params.message.level;
    head.append(level);

    this.#messageContent = new MessageContent(
      {
        message: params.message,
        translations: params.translations,
        l10n: params.l10n
      },
      {
        onEdit: (uuids, value) => {
          this.#callbacks.onFieldEdit(uuids, value);
        }
      }
    );
    this.#dom.append(this.#messageContent.getDOM());
  }

  getDOM() {
    return this.#dom;
  }

  getSubContentId() {
    return this.#messageContent.getSubContentId();
  }

  toggleActive(active) {
    this.#dom.classList.toggle('active', active);
  }

  toggleAvailable(available) {
    this.#available = available;
  }

  isAvailable() {
    return this.#available;
  }

  /**
   * Ensure all fields use their current values as initial values.
   */
  makeCurrentValuesInitial() {
    this.#messageContent.makeCurrentValuesInitial();
  }

  /**
   * Update message edit fields.
   * @param {string[]} uuids UUIDs of the fields to update.
   * @param {string} value Value to set for the fields.
   */
  updateField(uuids, value) {
    this.#messageContent.setField(uuids, value);
  }

  getEdits() {
    return this.#messageContent.getEdits();
  }
}

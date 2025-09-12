import { createUUID } from '@services/util.js';
import { Carousel } from '../carousel/carousel.js';

export class TypeAccordionPanel {

  #dom;
  #contentGrid;
  #button;
  #carousel;
  #messageCount;
  #pendingIndicator;
  #isVisibleState = true;
  #callbacks;

  /**
   * @class
   * @param {object} params Parameters for the type accordion panel.
   * @param {object} params.type Type object.
   * @param {object} params.translations Translations object.
   * @param {object} callbacks Callbacks.
   */
  constructor(params = {}, callbacks = {}) {
    this.#callbacks = callbacks;
    this.#callbacks.expandedStateChanged = this.#callbacks.expandedStateChanged ?? (() => {});
    this.#callbacks.onFieldEdit = this.#callbacks.onFieldEdit ?? (() => {});

    this.#dom = document.createElement('div');
    this.#dom.classList.add('type-accordion-panel');
    const iconCategory = 'var(--type-accordion-header-icon)';
    const iconType = `var(--type-accordion-panel-header-icon-${params.type}, ${iconCategory})`;
    this.#dom.style.setProperty( '--type-accordion-panel-header-icon', iconType);

    const headerId = createUUID();
    const contentId = createUUID();

    const header = document.createElement('div');
    header.classList.add('type-accordion-panel-header');
    header.setAttribute('id', headerId);

    this.#button = document.createElement('button');
    this.#button.classList.add('type-accordion-panel-button');
    this.#button.setAttribute('aria-expanded', 'false');
    this.#button.setAttribute('aria-controls', contentId);
    this.#button.innerText = params.translations[params.type];
    header.append(this.#button);

    this.#pendingIndicator = document.createElement('span');
    this.#pendingIndicator.classList.add('type-accordion-panel-pending-indicator');
    header.append(this.#pendingIndicator);

    this.#messageCount = document.createElement('span');
    this.#messageCount.classList.add('type-accordion-panel-count');
    header.append(this.#messageCount);

    const icon = document.createElement('span');
    icon.classList.add('type-accordion-panel-icon');
    header.append(icon);

    this.#dom.append(header);

    this.#contentGrid = document.createElement('div');
    this.#contentGrid.setAttribute('id', contentId);
    this.#contentGrid.classList.add('type-accordion-panel-content-grid');
    this.#contentGrid.setAttribute('role', 'region');
    this.#contentGrid.setAttribute('aria-labelledby', headerId);
    this.#contentGrid.setAttribute('hidden', '');

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('type-accordion-panel-content-wrapper');

    this.#carousel = new Carousel(
      {
        ariaLabel: params.translations[params.type],
        messages: params.messages,
        translations: params.translations,
        l10n: params.l10n,
      },
      {
        onFieldEdit: (uuids, value) => {
          const hasEdits = this.#carousel.getEdits().length > 0;

          this.#togglePendingIndicator(hasEdits);
          this.#callbacks.onFieldEdit(uuids, value);
        }
      }
    );
    contentWrapper.append(this.#carousel.getDOM());
    this.#contentGrid.append(contentWrapper);

    this.#dom.append(this.#contentGrid);

    this.#dom.addEventListener('click', (event) => {
      const targetIsCarouselItem = event.target.closest('.carousel-item') !== null;
      if (targetIsCarouselItem) {
        return;
      }

      this.toggle();
    });

    this.#togglePendingIndicator(false);
    this.updateMessageCount();
  }

  /**
   * Get DOM element of the type accordion panel.
   * @returns {HTMLElement} The DOM element of the type accordion panel.
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
    this.#carousel.filter(subContentIds);
    this.updateMessageCount();

    if (!subContentIds || this.#carousel.getNumberOfAvailableItems() > 0) {
      this.show();
    }
    else {
      this.collapse();
      this.hide();
    }
  }

  /**
   * Update message count.
   */
  updateMessageCount() {
    this.#messageCount.innerText = this.#carousel.getNumberOfAvailableItems();
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

  /**
   * Ensure all fields use their current values as initial values.
   */
  makeCurrentValuesInitial() {
    this.#carousel.makeCurrentValuesInitial();
  }

  /**
   * Clear the pending state of all panels.
   */
  clearPendingState() {
    this.#togglePendingIndicator(false);
  }

  /**
   * Update message edit fields.
   * @param {string[]} uuids UUIDs of the fields to update.
   * @param {string} value Value to set for the fields.
   */
  updateFields(uuids, value) {
    this.#carousel.updateFields(uuids, value);
  }

  getEdits() {
    return this.#carousel.getEdits();
  }

  /**
   * Toggle the pending indicator.
   * @param {boolean} shouldBeVisible Whether the pending indicator should be visible.
   */
  #togglePendingIndicator(shouldBeVisible) {
    this.#pendingIndicator.classList.toggle('hidden', !shouldBeVisible);
  }
}

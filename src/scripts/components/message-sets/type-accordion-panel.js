import { createUUID } from '@services/util.js';
import { TypeContent } from './type-content.js';
import { MessageAccordionPanel } from './message-accordion-panel.js';

export class TypeAccordionPanel {

  #dom;
  #contentGrid;
  #button;
  #content;
  #isVisibleState = true;
  #callbacks;
  // #panels = [];

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

    this.#dom = document.createElement('div');
    this.#dom.classList.add('type-accordion-panel');
    const iconCategory = 'var(--message-accordion-header-icon)';
    const iconType = `var(--type-accordion-header-icon-${params.type}, ${iconCategory})`;
    this.#dom.style.setProperty( '--type-accordion-header-icon', iconType);

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

    const count = document.createElement('span');
    count.classList.add('type-accordion-panel-count');
    count.innerText = `${params.messages.length}`;
    header.append(count);

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
    this.#content = new TypeContent({
      type: params.type,
      translations: params.translations,
      l10n: params.l10n
    });
    contentWrapper.append(this.#content.getDOM());
    this.#contentGrid.append(contentWrapper);

    this.#dom.append(this.#contentGrid);

    this.#dom.addEventListener('click', () => {
      this.toggle();
    });

    const panelsDOM = document.createElement('ul');
    panelsDOM.classList.add('message-accordion-panels-list');
    contentWrapper.append(panelsDOM);

    params.messages.forEach((message) => {
      const listItem = document.createElement('li');
      listItem.classList.add('message-accordion-panels-list-item');

      const panel = new MessageAccordionPanel(
        {
          message: message,
          translations: params.translations,
          l10n: {
            showDetails: params.l10n.showDetails,
            hideDetails: params.l10n.hideDetails
          }
        },
        {
          expandedStateChanged: (state) => {
            // if (this.#panels.every((panel) => !panel.isExpanded())) {
            //   this.#expandButton.toggle(false, true);
            // }
            // else {
            //   this.#expandButton.toggle(true, true);
            // }
          }
        }
      );
      listItem.append(panel.getDOM());
      // this.#panels.push(panel);

      panelsDOM.append(listItem);
    });
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

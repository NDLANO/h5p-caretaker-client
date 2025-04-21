import { createUUID } from '@services/util.js';
import './content-filter-item.css';

export class ContentFilterItem {
  #dom;
  #expander;
  #checkbox;
  #panel;
  #isExpandedState = false;
  #isExpandable = false;
  #isVisibleState = false;
  #items = [];
  #params;

  /**
   * @class ContentFilterItem
   * @param {object} params Parameters.
   */
  constructor(params = {}) {
    this.#params = params;

    const uuid = createUUID();
    this.#dom = document.createElement('li');
    this.#dom.classList.add('content-filter-item');
    this.#dom.setAttribute('role', 'treeitem');
    this.#dom.setAttribute('tabindex', '-1');
    this.#dom.setAttribute('aria-checked', 'true');

    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('content-filter-item-wrapper');
    this.#dom.append(itemWrapper);

    this.#panel = document.createElement('div');
    this.#panel.classList.add('content-filter-item-panel');
    itemWrapper.append(this.#panel);

    this.#isExpandable = params.items?.length > 0;

    if (this.#isExpandable) {
      this.#panel.classList.add('expandable');
      this.#expander = document.createElement('button');
      this.#expander.classList.add('content-filter-item-expander');
      this.#expander.setAttribute('tabindex', '-1');
      this.#panel.append(this.#expander);

      this.#dom.setAttribute('aria-expanded', this.#isExpandedState);

      // Create nested items
      const group = document.createElement('ul');
      group.classList.add('content-filter-group');
      group.setAttribute('role', 'group');
      itemWrapper.append(group);

      params.items.forEach((itemParams) => {
        const childItem = new ContentFilterItem({
          ...itemParams,
          l10n: params.l10n,
        });
        group.append(childItem.getDOM());
        this.#items.push(childItem);
      });

      this.toggleExpandedState(false);
    }
    else {
      const spacer = document.createElement('div');
      this.#panel.append(spacer);
    }

    this.#checkbox = document.createElement('input');
    this.#checkbox.name = params.subcontentId;
    this.#checkbox.classList.add('content-filter-item-checkbox');
    this.#checkbox.setAttribute('aria-labelledby', uuid);
    this.#checkbox.setAttribute('tabindex', '-1');
    this.#checkbox.type = 'checkbox';
    this.#checkbox.checked = true;
    this.#panel.append(this.#checkbox);

    const label = document.createElement('span');
    label.setAttribute('id', uuid);
    label.classList.add('content-filter-item-label');
    label.innerText = params.label;
    this.#panel.append(label);
  }

  /**
   * Get DOM element of the content filter.
   * @returns {HTMLElement} DOM element of the content filter.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Get the name of the content filter item.
   * @returns {string} The name of the content filter item.
   */
  getName() {
    return this.#params.name;
  }

  /**
   * Get the subcontent ID of the content filter item.
   * @returns {string} The subcontent ID of the content filter item.
   */
  getSubcontentId() {
    return this.#params.subcontentId;
  }

  /**
   * Get the level of the content filter item.
   * @returns {string} The level of the content filter item.
   */
  getLevel() {
    return this.#params.level;
  }

  /**
   * Get the label of the content filter item.
   * @returns {string} The label of the content filter item.
   */
  getLabel() {
    return this.#params.label;
  }

  /**
   * Get the items of the content filter item.
   * @returns {ContentFilterItem[]} The items of the content filter item.
   */
  getItems() {
    return this.#items;
  }

  /**
   * Determine if the content filter item is selected.
   * @returns {boolean} True if the content filter item is selected, else false.
   */
  isSelected() {
    return this.#checkbox.checked;
  }

  /**
   * Determine if the content filter item is expandable.
   * @returns {boolean} True if the content filter item is expandable, else false.
   */
  isExpandable() {
    return this.#isExpandable;
  }

  /**
   * Determine if the content filter item is expanded.
   * @returns {boolean} True if the content filter item is expanded, else false.
   */
  isExpanded() {
    return this.#isExpandedState;
  }

  /**
   * Determine if the content filter item is visible.
   * @returns {boolean} True if the content filter item is visible, else false.
   */
  isVisible() {
    return this.#isVisibleState;
  }

  /**
   * Toggle the selected state of the content filter item.
   * @param {boolean} [state] True for selected, false for unselected, undefined for toggling.
   */
  toggleSelectedState(state) {
    state = state ?? !this.#checkbox.checked;

    this.#checkbox.checked = state;
    this.#checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    this.#dom.setAttribute('aria-checked', state);
  }

  /**
   * Toggle the expanded state of the content filter item.
   * @param {boolean} [state] True for expanded, false for collapsed.
   */
  toggleTabbable(state) {
    this.#dom.setAttribute('tabindex', state ? '0' : '-1');
  }

  /**
   * Focus on the content filter item.
   */
  focus() {
    this.#dom.focus();
  }

  /**
   * Toggle the border of the content filter item.
   * @param {string} name Name of the border to toggle ['top'|'bottom'|'left'].
   * @param {boolean} state True for border, false for no border.
   */
  toggleBorder(name, state) {
    if (!['top', 'bottom', 'left'].includes(name) || typeof state !== 'boolean') {
      return;
    }

    this.#panel.classList.toggle(`border-${name}`, state);
  }

  /**
   * Toggle the expanded state of the content filter item.
   * @param {boolean} [state] True for expanded, false for collapsed, undefined for toggling.
   */
  toggleExpandedState(state) {
    if (!this.#isExpandable) {
      return;
    }

    if (state === undefined) {
      state = !this.#isExpandedState;
    }

    this.#dom.setAttribute('aria-expanded', state);
    this.#isExpandedState = state;

    if (state) {
      this.#expander.setAttribute('aria-label', this.#params.l10n.collapseList);
    }
    else {
      this.#expander.setAttribute('aria-label', this.#params.l10n.expandList);
    }

    this.#items.forEach((item) => {
      item.toggleVisibility(state);
    });
  }

  /**
   * Toggle the visibility of the content filter item.
   * @param {boolean} state True for visible, false for hidden.
   */
  toggleVisibility(state) {
    if (typeof state !== 'boolean') {
      return;
    }

    this.#isVisibleState = state;

    this.#items.forEach((item) => {
      item.toggleVisibility(state && this.isExpanded());
    });
  }
}

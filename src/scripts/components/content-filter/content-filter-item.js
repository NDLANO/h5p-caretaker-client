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
   * @param {object} callbacks Callbacks.
   */
  constructor(params = {}, callbacks = {}) {
    this.#params = params;

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
        const childItem = new ContentFilterItem(itemParams);
        group.append(childItem.getDOM());
        this.#items.push(childItem);
      });
    }
    else {
      const spacer = document.createElement('div');
      this.#panel.append(spacer);
    }

    this.#checkbox = document.createElement('input');
    this.#checkbox.classList.add('content-filter-item-checkbox');
    this.#checkbox.setAttribute('tabindex', '-1');
    this.#checkbox.type = 'checkbox';
    this.#checkbox.checked = true;
    this.#panel.append(this.#checkbox);

    const label = document.createElement('span');
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

  getName() {
    return this.#params.name;
  }

  getSubcontentId() {
    return this.#params.subcontentId;
  }

  getLevel() {
    return this.#params.level;
  }

  getLabel() {
    return this.#params.label;
  }

  getItems() {
    return this.#items;
  }

  isSelected() {
    return this.#checkbox.checked;
  }

  isExpandable() {
    return this.#isExpandable;
  }

  isExpanded() {
    return this.#isExpandedState;
  }

  isVisible() {
    return this.#isVisibleState;
  }

  toggleSelectedState(state) {
    state = state ?? !this.#checkbox.checked;

    this.#checkbox.checked = state;
    this.#checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    this.#dom.setAttribute('aria-checked', state);
  }

  toggleTabbable(state) {
    this.#dom.setAttribute('tabindex', state ? '0' : '-1');
  }

  focus() {
    this.#dom.focus();
  }

  toggleBorder(name, state) {
    if (!['top', 'bottom', 'left'].includes(name) || typeof state !== 'boolean') {
      return;
    }

    this.#panel.classList.toggle(`border-${name}`, state);
  }

  toggleExpandedState(state) {
    if (!this.#isExpandable) {
      return;
    }

    if (state === undefined) {
      state = !this.#isExpandedState;
    }

    this.#dom.setAttribute('aria-expanded', state);
    this.#isExpandedState = state;

    this.#items.forEach((item) => {
      item.toggleVisibility(state);
    });
  }

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

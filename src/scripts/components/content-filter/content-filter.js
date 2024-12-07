import { ContentFilterItem } from './content-filter-item.js';
import './content-filter.css';

export class ContentFilter {

  #dom;
  #headerSelected;
  #buttonReset;
  #l10n;
  #items = [];
  #callbacks = {};
  #activeItem;

  /**
   * @class ContentFilter
   * @param {object} params Parameters for the content filter.
   * @param {object} callbacks Callbacks for the content filter.
   */
  constructor(params = {}, callbacks = {}) {
    // Add level to each item.
    const traverse = (item, level = 0) => {
      item.level = level;
      item.items?.forEach((item) => {
        traverse(item, level + 1);
      });
    };
    traverse(params.item);

    this.#l10n = params.l10n;

    this.#callbacks = callbacks ?? {};
    this.#callbacks.onFilterChange = this.#callbacks.onFilterChange ?? (() => {});

    this.#dom = document.createElement('div');
    this.#dom.classList.add('content-filter');
    this.#dom.classList.add('block-visible');

    const header = document.createElement('div');
    header.classList.add('content-filter-header');

    const headerIntro = document.createElement('span');
    headerIntro.classList.add('content-filter-header-intro');
    headerIntro.innerHTML = this.#l10n.filterByContent;
    header.append(headerIntro);

    this.#headerSelected = document.createElement('span');
    this.#headerSelected.classList.add('content-filter-header-selected');
    this.#headerSelected.innerHTML = this.#l10n.showAll;
    header.append(this.#headerSelected);

    this.#buttonReset = document.createElement('button');
    this.#buttonReset.classList.add('button-reset');
    this.#buttonReset.classList.add('display-none');
    this.#buttonReset.textContent = this.#l10n.reset;
    this.#buttonReset.addEventListener('click', () => {
      this.#reset();
    });
    header.append(this.#buttonReset);

    this.#dom.append(header);

    /*
     * Following the ARIA guidelines for tree view
     * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
     */
    const tree = document.createElement('ul');
    tree.classList.add('content-filter-tree');
    tree.setAttribute('role', 'tree');
    tree.setAttribute('aria-multiselectable', 'true');
    tree.setAttribute('aria-label', this.#l10n.contentFilter);
    this.#dom.append(tree);

    const item = new ContentFilterItem(params.item);
    item.toggleVisibility(true);
    tree.append(item.getDOM());

    this.#items = this.flattenItems(item);

    this.#dom.addEventListener('click', (event) => {
      this.#handleClick(event);
    });

    this.#dom.addEventListener('change', (event) => {
      this.#handleChange(event);
    });

    this.#dom.addEventListener('keydown', (event) => {
      this.#handleKeydown(event);
    });

    this.#activeItem = this.#items[0];
    this.#activeItem.toggleTabbable(true);
    this.#updateBorders();
  }

  flattenItems(item, items = []) {
    items.push(item);
    item.getItems().forEach((item) => {
      this.flattenItems(item, items);
    });
    return items;
  }

  /**
   * Get DOM element of the content filter.
   * @returns {HTMLElement} DOM element of the content filter.
   */
  getDOM() {
    return this.#dom;
  }

  #handleClick(event) {
    if (
      event.target.classList.contains('content-filter-item-wrapper') ||
      event.target.classList.contains('content-filter-item-checkbox')
    ) {
      return;
    }

    const item = this.#items.find((item) => item.getDOM() === event.target.closest('.content-filter-item'));
    if (!item) {
      return;
    }

    item.toggleExpandedState();
    this.#updateBorders();
  }

  #handleChange(event) {
    if (!event.target.classList.contains('content-filter-item-checkbox')) {
      return;
    }

    this.#updateSelection();
  }

  #handleKeydown(event) {
    if (event.code === 'Enter' || event.code === 'Space') {
      this.#activeItem.toggleSelectedState();
    }
    if (event.code === 'ArrowRight') {
      if (!this.#activeItem.isExpandable()) {
        return;
      }
      else if (!this.#activeItem.isExpanded()) {
        this.#handleClick(event);
      }
      else {
        this.#focusItem(this.#getNextItem());
      }
    }
    else if (event.code === 'ArrowLeft') {
      if (!this.#activeItem.isExpandable() || !this.#activeItem.isExpanded()) {
        this.#focusItem(this.#getPreviousExpandableItem());
      }
      else {
        this.#handleClick(event);
      }
    }
    else if (event.key === 'ArrowDown') {
      this.#focusItem(this.#getNextItem());
    }
    else if (event.key === 'ArrowUp') {
      this.#focusItem(this.#getPreviousItem());
    }
    else if (event.key === 'Home') {
      this.#focusItem(this.#getVisibleItems()[0]);
    }
    else if (event.key === 'End') {
      this.#focusItem(this.#getVisibleItems().slice(-1)[0]);
    }
    else if (event.key === '*') {
      if (!this.#activeItem.isExpandable()) {
        return;
      }

      [...this.#activeItem, ...this.#getSiblings(this.#activeItem)]
        .filter((item) => item.isExpandable())
        .forEach((item) => {
          item.toggleExpandedState(true);
        });

      this.#updateBorders();
    }
    else if (event.key.length === 1 && event.key.match(/\S/) && !event.ctrlKey && !event.metaKey) {
      // Matches a printable character.
      const index = this.#getVisibleItems().indexOf(this.#activeItem);
      const found = this.#getVisibleItems().slice(index + 1)
        .find((item) => item.getLabel().toLowerCase().startsWith(event.key.toLowerCase()));

      if (found) {
        this.#focusItem(found);
      }
    }
  }

  #updateSelection() {
    const selectedItems = this.#items.filter((item) => item.isSelected());

    let headerSelectedText;
    if (selectedItems.length === 0) {
      headerSelectedText = this.#l10n.showNone;
      this.#buttonReset.classList.remove('display-none');
    }
    else if (selectedItems.length === this.#items.length) {
      headerSelectedText = this.#l10n.showAll;
      this.#buttonReset.classList.add('display-none');
    }
    else {
      headerSelectedText = this.#l10n.showSelected;
      this.#buttonReset.classList.remove('display-none');
    }
    this.#headerSelected.innerHTML = headerSelectedText;

    this.#callbacks.onFilterChange(selectedItems.map((item) => item.getSubcontentId()));
  }

  #reset() {
    this.#items.forEach((item) => {
      item.toggleSelectedState(true);
    });

    this.#updateSelection();
  }

  #focusItem(item) {
    if (!item) {
      return;
    }

    this.#activeItem.toggleTabbable(false);
    this.#activeItem = item;
    this.#activeItem.toggleTabbable(true);
    this.#activeItem.focus();
  }

  #getSiblings(item) {
    if (!item || !item.isVisible()) {
      return [];
    }

    const visibleItems = this.#getVisibleItems();
    const activeIndex = visibleItems.indexOf(item);
    const activeItemLevel = item.getLevel();

    const filterItems = (items) => {
      const result = [];
      for (const item of items) {
        const itemLevel = item.getLevel();
        if (itemLevel === activeItemLevel) {
          result.push(item);
        }
        else if (itemLevel < activeItemLevel) {
          break;
        }
      }
      return result;
    };

    const beforeIn = visibleItems.slice(0, activeIndex).reverse();
    const beforeOut = filterItems(beforeIn);

    const afterIn = visibleItems.slice(activeIndex + 1);
    const afterOut = filterItems(afterIn);

    return [...beforeOut, ...afterOut];
  }

  #getVisibleItems() {
    return this.#items.filter((item) => item.isVisible());
  }

  #getPreviousExpandableItem() {
    const visibleItems = this.#getVisibleItems();
    const activeIndex = visibleItems.indexOf(this.#activeItem);

    for (let i = activeIndex - 1; i >= 0; i--) {
      if (visibleItems[i].isExpandable()) {
        return visibleItems[i];
      }
    }

    return null;
  }

  #getPreviousItem() {
    const visibleItems = this.#getVisibleItems();
    const activeIndex = visibleItems.indexOf(this.#activeItem);
    if (activeIndex === -1 || activeIndex === 0) {
      return null;
    }

    return visibleItems[activeIndex - 1];
  }

  #getNextItem() {
    const visibleItems = this.#getVisibleItems();
    const activeIndex = visibleItems.indexOf(this.#activeItem);

    if (activeIndex === -1 || activeIndex === visibleItems.length - 1) {
      return null;
    }

    return visibleItems[activeIndex + 1];
  }

  #updateBorders() {
    this.#getVisibleItems()
      .forEach((item, index, allItems) => {
        item.toggleBorder('top', index === 0 || item.getLevel() < allItems[index - 1].getLevel());
        item.toggleBorder('bottom', index !== allItems.length - 1 && item.getLevel() <= allItems[index + 1].getLevel());
        item.toggleBorder('left', index !== 0);
      });
  }
}

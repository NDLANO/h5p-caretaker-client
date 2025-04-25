import { createUUID } from '@services/util.js';
import { CarouselItem } from './carousel-item.js';

export class Carousel {
  #dom;
  #activeItemIndex = 0;
  #messageCount;
  #carouselItems = [];

  /**
   * @class
   * @param {object} params Parameters for the carousel.
   * @param {object} params.messages Messages to be displayed in the carousel.
   * @param {object} params.translations Translations for the messages.
   * @param {object} params.l10n Localization object.
   * @param {string} params.ariaLabel Aria label for the carousel.
   */
  constructor(params = {}) {
    const uuid = createUUID();

    this.#dom = document.createElement('section');
    this.#dom.setAttribute('id', `carousel-${uuid}`);
    this.#dom.classList.add('h5p-caretaker-carousel');
    this.#dom.setAttribute('aria-roledescription', 'carousel');
    this.#dom.setAttribute('aria-label', params.ariaLabel);

    const controls = document.createElement('div');
    controls.classList.add('carousel-controls');
    this.#dom.append(controls);

    const prevButton = document.createElement('button');
    prevButton.classList.add('carousel-button');
    prevButton.classList.add('previous');
    prevButton.setAttribute('aria-label', params.l10n.previousMessage);
    prevButton.setAttribute('aria-controls', `carousel-items-${uuid}`);
    prevButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.#setActive(this.#activeItemIndex - 1);
    });
    controls.append(prevButton);

    this.#messageCount = document.createElement('span');
    this.#messageCount.classList.add('carousel-count');
    this.#messageCount.setAttribute('aria-live', 'polite');
    // eslint-disable-next-line no-magic-numbers
    this.#messageCount.style.setProperty('--count-width', `${2 * params.messages.length.toString().length + 3}ch`);
    controls.append(this.#messageCount);

    const nextButton = document.createElement('button');
    nextButton.classList.add('carousel-button');
    nextButton.classList.add('next');
    nextButton.setAttribute('aria-label', params.l10n.nextMessage);
    nextButton.setAttribute('aria-controls', `carousel-items-${uuid}`);
    nextButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.#setActive(this.#activeItemIndex + 1);
    });
    controls.append(nextButton);

    const items = document.createElement('div');
    items.setAttribute('id', `carousel-items-${uuid}`);
    items.classList.add('carousel-items');
    this.#dom.append(items);

    params.messages.forEach((message, index) => {
      const carouselItem = new CarouselItem({
        message: message,
        index: index,
        carouselUuid: uuid,
        translations: params.translations,
        l10n: params.l10n,
      });

      this.#carouselItems.push(carouselItem);

      items.append(carouselItem.getDOM());
    });

    this.#setActive(0);
  }

  /**
   * Get the DOM element of the carousel.
   * @returns {HTMLElement} The DOM element of the carousel.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Get subcontent ids of all the messages in the carousel.
   * @returns {string[]} Subcontent ids of all the messages in the carousel.
   */
  getSubContentIds() {
    return this.#carouselItems.map((item) => item.getSubContentId());
  }

  /**
   * Get the number of available items in the carousel.
   * @returns {number} The number of available items.
   */
  getNumberOfAvailableItems() {
    return this.#carouselItems.filter((item) => item.isAvailable()).length;
  }

  /**
   * Filter the carousel items based on subcontent IDs.
   * @param {string[]} subcontentIds - Subcontent IDs of contents to show.
   */
  filter(subcontentIds) {
    this.#carouselItems.forEach((item) => {
      item.toggleAvailable(subcontentIds.includes(item.getSubContentId()));
    });

    this.#setActive(this.#activeItemIndex);
  }

  /**
   * Set the active item in the carousel.
   * @param {number} index - The index of the item to set as active.
   */
  #setActive(index) {
    if (typeof index !== 'number') {
      return;
    }

    const direction = this.#activeItemIndex === -1 || index === this.#activeItemIndex ?
      0 :
      Math.sign(index - this.#activeItemIndex);

    // Wrap around the index for circular navigation
    index = ((index % this.#carouselItems.length) + this.#carouselItems.length) % this.#carouselItems.length;

    if (!this.#carouselItems[index].isAvailable()) {
      index = this.#findNextAvailableIndex(index, direction);
    }

    this.#carouselItems.forEach((item, itemIndex) => {
      item.toggleActive(itemIndex === index);
    });
    this.#activeItemIndex = index;
    this.#updateMessageCount();
  }

  /**
   * Find the next available index in the carousel.
   * @param {number} currentIndex - Current index of the active item.
   * @param {number} direction - Direction to search for the next available item.
   * @returns {number} The index of the next available item.
   */
  #findNextAvailableIndex(currentIndex, direction) {
    direction = direction === 0 ? 1 : direction;
    const availabilityMap = this.#carouselItems.map((item) => item.isAvailable());

    if (direction === 1) {
      const indexAfter = availabilityMap.indexOf(true, currentIndex);
      return indexAfter !== -1 ? indexAfter : availabilityMap.indexOf(true);
    }
    else {
      const indexBefore = availabilityMap.lastIndexOf(true, currentIndex);
      return indexBefore !== -1 ? indexBefore : availabilityMap.lastIndexOf(true);
    }
  }

  /**
   * Update the message count display.
   */
  #updateMessageCount() {
    const availableItems = this.#carouselItems.filter((item) => item.isAvailable());
    const activeItemPosition = availableItems.findIndex((item) => item === this.#carouselItems[this.#activeItemIndex]);

    this.#messageCount.innerText = `${activeItemPosition + 1} / ${this.getNumberOfAvailableItems()}`;
  }
}

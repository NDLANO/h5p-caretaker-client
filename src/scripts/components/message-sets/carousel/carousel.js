import { createUUID } from '@services/util.js';
import { MessageContent } from '../message-content.js';

export class Carousel {
  #dom;
  #carouselItems = [];

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
      this.setActive(this.activeItemIndex - 1);
    });
    controls.append(prevButton);

    this.messageCount = document.createElement('span');
    this.messageCount.classList.add('carousel-count');
    this.messageCount.setAttribute('aria-live', 'polite');
    // eslint-disable-next-line no-magic-numbers
    this.messageCount.style.setProperty('--count-width',  `${2 * params.messages.length.toString().length + 3}ch`);
    controls.append(this.messageCount);

    const nextButton = document.createElement('button');
    nextButton.classList.add('carousel-button');
    nextButton.classList.add('next');
    nextButton.setAttribute('aria-label', params.l10n.nextMessage);
    nextButton.setAttribute('aria-controls', `carousel-items-${uuid}`);
    nextButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.setActive(this.activeItemIndex + 1);
    });
    controls.append(nextButton);

    const items = document.createElement('div');
    items.setAttribute('id', `carousel-items-${uuid}`);
    items.classList.add('carousel-items');
    this.#dom.append(items);

    params.messages.forEach((message, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      carouselItem.setAttribute('role', 'group');
      carouselItem.setAttribute('aria-roledescription', 'slide');
      carouselItem.setAttribute('aria-labelledby', `carousel-item-summary-${uuid}-${index}`);
      items.append(carouselItem);

      const head = document.createElement('div');
      head.classList.add('carousel-item-header');
      carouselItem.append(head);

      const summary = document.createElement('span');
      summary.setAttribute('id', `carousel-item-summary-${uuid}-${index}`);
      summary.classList.add('summary');
      summary.innerText = message.summary;
      head.append(summary);

      const level = document.createElement('span');
      level.classList.add('level');
      level.classList.add(message.level);
      level.innerText = message.level;
      head.append(level);

      const messageItem = new MessageContent({
        message: message,
        translations: params.translations,
        l10n: params.l10n
      });
      carouselItem.append(messageItem.getDOM());

      this.#carouselItems.push(carouselItem);
    });

    this.setActive(0);
  }

  getDOM() {
    return this.#dom;
  }

  setActive(index) {
    if (typeof index !== 'number') {
      return;
    }

    if (index < 0) {
      index = this.#carouselItems.length - 1;
    }
    else if (index >= this.#carouselItems.length) {
      index = 0;
    }

    this.activeItemIndex = index;

    this.#carouselItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    this.messageCount.innerText = `${index + 1} / ${this.#carouselItems.length}`;
  }
}

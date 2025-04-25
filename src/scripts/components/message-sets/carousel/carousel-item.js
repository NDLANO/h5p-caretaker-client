import { MessageContent } from './message-content.js';

export class CarouselItem {
  #dom;
  #messageContent;
  #available = true;

  constructor(params = {}) {
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

    this.#messageContent = new MessageContent({
      message: params.message,
      translations: params.translations,
      l10n: params.l10n
    });
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
}

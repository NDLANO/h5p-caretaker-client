import { MessageAccordion } from './message-accordion.js';

export class MessageSet {
  #dom;
  #accordions = [];

  constructor(params = {}) {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-set');

    params.sections.forEach((section) => {
      const messages = params.messages.filter((message) => message[params.id] === section.id);
      if (!messages.length) {
        return;
      }

      const accordion = new MessageAccordion({
        type: section.id,
        header: section.header,
        messages: messages,
        translations: params.translations,
        l10n: {
          expandAllMessages: params.l10n.expandAllMessages,
          collapseAllMessages: params.l10n.collapseAllMessages,
          allFilteredOut: params.l10n.allFilteredOut
        }
      });
      this.#accordions.push(accordion);

      this.#dom.append(accordion.getDOM());
    });
  }

  getDOM() {
    return this.#dom;
  }

  filter(subcontentIds) {
    this.#accordions.forEach((accordion) => {
      accordion.filter(subcontentIds);
    });
  }

  show() {
    this.#dom.classList.remove('display-none');
  }

  hide() {
    this.#dom.classList.add('display-none');
  }
}

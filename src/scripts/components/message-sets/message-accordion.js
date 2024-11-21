import { ExpandButton } from './expand-button.js';
import { MessageAccordionPanel } from './message-accordion-panel.js';

export class MessageAccordion {

  #dom;

  /**
   * @class
   * @param {object} params Parameters for the message accordion.
   */
  constructor(params = {}) {

    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-accordion');

    const panels = [];

    const header = document.createElement('div');
    header.classList.add('message-accordion-header');
    this.#dom.append(header);

    const text = document.createElement('p');
    text.classList.add('message-accordion-header-text');
    text.innerText = params.translations[`${params.type}`];
    header.append(text);

    const expandButton = new ExpandButton(
      {
        l10n: {
          expandAllMessages: params.l10n.expandAllMessages,
          collapseAllMessages: params.l10n.collapseAllMessages
        }
      },
      {
        expandedStateChanged: (state) => {
          panels.forEach((panel) => {
            panel.toggle(state);
          });
        }
      }
    );
    expandButton.setWidth();
    header.append(expandButton.getDOM());

    const panelsDOM = document.createElement('ul');
    panelsDOM.classList.add('message-accordion-panels-list');
    this.#dom.append(panelsDOM);

    params.messages.forEach((message) => {
      const listItem = document.createElement('li');
      listItem.classList.add('message-accordion-panels-list-item');

      const panel = new MessageAccordionPanel(
        {
          message: message,
          translations: params.translations
        },
        {
          expandedStateChanged: (state) => {
            if (panels.every((panel) => !panel.isExpanded())) {
              expandButton.toggle(false, true);
            }
            else {
              expandButton.toggle(true, true);
            }
          }
        }
      );
      listItem.append(panel.getDOM());
      panels.push(panel);

      panelsDOM.append(listItem);
    });
  }

  /**
   * Get message accordion DOM.
   * @returns {HTMLElement} The DOM element of the message accordion.
   */
  getDOM() {
    return this.#dom;
  }
}

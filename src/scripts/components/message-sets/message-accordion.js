import { ExpandButton } from './expand-button.js';
import { MessageAccordionPanel } from './message-accordion-panel.js';

export class MessageAccordion {

  #dom;
  #expandButton;
  #allFiltered;
  #panels = [];

  /**
   * @class
   * @param {object} params Parameters for the message accordion.
   */
  constructor(params = {}) {

    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-accordion');

    const anchor = document.createElement('a');
    anchor.classList.add('message-accordion-header-anchor');
    anchor.setAttribute('name', `${params.type}`);
    this.#dom.append(anchor);

    const header = document.createElement('div');
    header.classList.add('message-accordion-header');
    this.#dom.append(header);

    const text = document.createElement('p');
    text.classList.add('message-accordion-header-text');
    text.innerText = params.header;

    header.append(text);

    this.#expandButton = new ExpandButton(
      {
        l10n: {
          expandAllMessages: params.l10n.expandAllMessages,
          collapseAllMessages: params.l10n.collapseAllMessages
        }
      },
      {
        expandedStateChanged: (state) => {
          this.#panels.forEach((panel) => {
            panel.toggle(state);
          });
        }
      }
    );
    this.#expandButton.setWidth();
    header.append(this.#expandButton.getDOM());

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
            if (this.#panels.every((panel) => !panel.isExpanded())) {
              this.#expandButton.toggle(false, true);
            }
            else {
              this.#expandButton.toggle(true, true);
            }
          }
        }
      );
      listItem.append(panel.getDOM());
      this.#panels.push(panel);

      panelsDOM.append(listItem);
    });

    this.#allFiltered = document.createElement('div');
    this.#allFiltered.classList.add('message-accordion-all-filtered');
    this.#allFiltered.classList.add('display-none');
    this.#allFiltered.innerHTML = params.l10n.allFilteredOut;
    this.#dom.append(this.#allFiltered);
  }

  /**
   * Get message accordion DOM.
   * @returns {HTMLElement} The DOM element of the message accordion.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Filter the message accordion.
   * @param {string[]} subcontentIds Subcontent IDs of contents to show.
   */
  filter(subcontentIds) {
    this.#panels.forEach((panel) => {
      panel.filter(subcontentIds);
    });

    if (this.#panels.some((panel) => panel.isVisible())) {
      this.#expandButton.show();
      this.#allFiltered.classList.add('display-none');
    }
    else {
      this.#expandButton.hide();
      this.#allFiltered.classList.remove('display-none');
    }
  }
}

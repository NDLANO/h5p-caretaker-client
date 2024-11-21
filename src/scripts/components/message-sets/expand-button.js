export class ExpandButton {
  #params;
  #dom;
  #callbacks;
  #isExpanded = false;
  #wasButtonWidthSet = false;

  /**
   * @class ExpandButton
   * @param {object} params Parameters.
   * @param {object} params.l10n Localization.
   * @param {string} params.l10n.expandAllMessages Label for button: "Expand all messages".
   * @param {string} params.l10n.collapseAllMessages Label for button: "Collapse all messages".
   * @param {object} callbacks Callbacks.
   * @param {function} callbacks.expandedStateChanged Callback for expanded state change.
   */
  constructor(params = {}, callbacks = {}) {
    this.#params = params;
    this.#params.l10n = this.#params.l10n ?? {};
    this.#params.l10n.expandAllMessages = this.#params.l10n.expandAllMessages ?? 'Expand all messages';
    this.#params.l10n.collapseAllMessages = this.#params.l10n.collapseAllMessages ?? 'Collapse all messages';

    this.#callbacks = callbacks;
    this.#callbacks.expandedStateChanged = this.#callbacks.expandedStateChanged ?? (() => {});

    this.#dom = document.createElement('button');
    this.#dom.classList.add('expand-button');
    this.#dom.addEventListener('click', () => {
      this.toggle();
    });
    this.#collapse();
  }

  /**
   * Get the DOM element of the button.
   * @returns {HTMLElement} The DOM element of the button.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Toggle the button's expanded state.
   * @param {boolean} [state] The desired expanded state of the button.
   * @param {boolean} [silent] Whether to suppress the expandedStateChanged callback
   */
  toggle(state, silent = false) {
    const targetState = (typeof state === 'boolean') ?
      state :
      !this.#isExpanded;

    if (targetState) {
      this.#expand(silent);
    }
    else {
      this.#collapse(silent);
    }
  }

  /**
   * Collapse the button.
   * @param {boolean} [silent] Whether to suppress the expandedStateChanged callback.
   */
  #collapse(silent = false) {
    this.#dom.innerHTML = this.#params.l10n.expandAllMessages;
    this.#dom.classList.remove('expanded');
    this.#isExpanded = false;

    if (!silent) {
      this.#callbacks.expandedStateChanged(this.#isExpanded);
    }
  }

  /**
   * Expand the button.
   * @param {boolean} [silent] Whether to suppress the expandedStateChanged callback.
   */
  #expand(silent = false) {
    this.#dom.innerHTML = this.#params.l10n.collapseAllMessages;
    this.#dom.classList.add('expanded');
    this.#isExpanded = true;

    if (!silent) {
      this.#callbacks.expandedStateChanged(this.#isExpanded);
    }
  }

  /**
   * Set width of collapse button.
   *
   * The width of the button should not change when the label is changed,
   * so the button is rendered offsite with both labels and the longest one
   * is used to determine the button width.
   */
  setWidth = () => {
    if (this.#wasButtonWidthSet) {
      return;
    }

    const offsiteDOM = document.createElement('div');
    offsiteDOM.classList.add('offsite');

    const offsiteButton1 = document.createElement('button');
    offsiteButton1.classList.add('expand-button');
    offsiteButton1.innerHTML = this.#params.l10n.expandAllMessages;
    offsiteDOM.append(offsiteButton1);

    const offsiteButton2 = document.createElement('button');
    offsiteButton2.classList.add('expand-button');
    offsiteButton2.classList.add('expanded');
    offsiteButton2.innerHTML = this.#params.l10n.collapseAllMessages;
    offsiteDOM.append(offsiteButton2);

    document.body.append(offsiteDOM);

    // FontFaceSet API is used to ensure font of icon is loaded
    document.fonts.ready.then(() => {
      const width1 = offsiteButton1.getBoundingClientRect().width;
      const width2 = offsiteButton2.getBoundingClientRect().width;

      this.fixedButtonWidth = Math.ceil(Math.max(width1, width2));

      this.#dom.style.width = `${this.fixedButtonWidth}px`;
      this.#wasButtonWidthSet = true;

      offsiteDOM?.remove();
    });
  };
}

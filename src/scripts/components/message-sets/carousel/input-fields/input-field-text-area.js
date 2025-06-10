import InputField from './input-field.js';
import './input-field-text-area.css';

export default class InputFieldTextArea extends InputField {

  #domTextarea;

  /**
   * Constructor for the InputFieldText class.
   * @class
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @param {object} factory The factory for creating input fields (for compound fields).
   */
  constructor(params = {}, callbacks = {}, factory = {}) {
    super(params, callbacks, factory);

    this.getDOM().append(this.#createDOM(params, callbacks));
  }

  /**
   * Get the current value of the input field.
   * @returns {string} The current value of the input field.
   */
  getValue() {
    return this.#domTextarea.value;
  }

  /**
   * Set the value of the input field.
   * @param {string[]} uuids The UUID of the input field.
   * @param {string|number} value The value to set.
   */
  setValue(uuids, value) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return;
    }

    if (!this.getUUIDs().some((uuid) => uuids.includes(uuid))) {
      return;
    }

    this.#domTextarea.innerText = value;
  }

  /**
   * Create the DOM element for the input field.
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @returns {HTMLElement} The DOM element for the input field.
   */
  #createDOM(params, callbacks) {
    this.#domTextarea = document.createElement('textarea');
    this.#domTextarea.classList.add('message-content-item-input-text-area');
    this.#domTextarea.setAttribute('type', 'text');

    if (params.pattern) {
      // Guessing max value from pattern by regexp (\d+) and using the last match
      const matches = params.pattern.match(/(\d+)/g);
      const maxValue = matches ? Math.max(...matches.map(Number)) : 0;
      if (maxValue > 0) {
        this.#domTextarea.setAttribute('maxlength', maxValue);
      }
    }

    if (params.placeholder) {
      this.#domTextarea.setAttribute('placeholder', params.placeholder);
    }

    if (callbacks.onEdit) {
      this.#domTextarea.addEventListener('input', () => {
        callbacks.onEdit(this.getUUIDs(), this.getValue());
      });
    }

    this.setValue(this.getUUIDs()[0], params.initialValue);

    return this.#domTextarea;
  }

  /**
   * Toggle the validity of the textarea.
   * @param {boolean} shouldBeValid Whether the textarea should be valid or invalid.
   */
  toggleValidity(shouldBeValid) {
    if (shouldBeValid) {
      this.#domTextarea.classList.remove('invalid');
    }
    else {
      this.#domTextarea.classList.add('invalid');
    }
  }
}

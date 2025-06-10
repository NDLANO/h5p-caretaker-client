import InputField from './input-field.js';
import './input-field-text.css';

export default class InputFieldText extends InputField {

  #domInput;

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
    return this.#domInput.value;
  }

  /**
   * Set the value of the input field.
   * @param {string[]} uuids The UUIDs of the input field.
   * @param {string|number} value The value to set.
   */
  setValue(uuids, value) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return;
    }

    if (!this.getUUIDs().some((uuid) => uuids.includes(uuid))) {
      return;
    }

    this.#domInput.value = value;
  }

  /**
   * Create the DOM element for the input field.
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @returns {HTMLElement} The DOM element for the input field.
   */
  #createDOM(params, callbacks) {
    this.#domInput = document.createElement('input');
    this.#domInput.classList.add('message-content-item-input-text');
    this.#domInput.setAttribute('type', 'text');

    if (params.pattern) {
      this.#domInput.setAttribute('pattern', JSON.parse(`"${params.pattern}"`));
    }

    if (params.placeholder) {
      this.#domInput.setAttribute('placeholder', params.placeholder);
    }

    if (callbacks.onEdit) {
      this.#domInput.addEventListener('input', () => {
        callbacks.onEdit(this.getUUIDs(), this.getValue());
      });
    }

    return this.#domInput;
  }

  /**
   * Toggle the validity of the input field.
   * @param {boolean} shouldBeValid Whether the input field should be valid or invalid.
   */
  toggleValidity(shouldBeValid) {
    if (shouldBeValid) {
      this.#domInput.classList.remove('invalid');
    }
    else {
      this.#domInput.classList.add('invalid');
    }
  }
}

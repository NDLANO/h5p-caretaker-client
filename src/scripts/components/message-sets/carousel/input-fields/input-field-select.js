import InputField from './input-field.js';
import './input-field-select.css';

export default class InputFieldSelect extends InputField {

  #options = [];
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

    this.#options = params.options || [];

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

    if (!this.#options.some((option) => option.value === value)) {
      return; // Invalid value
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
    this.#domInput = document.createElement('select');
    this.#domInput.classList.add('message-content-item-input-select');

    params.options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      this.#domInput.appendChild(optionElement);
    });

    if (callbacks.onEdit) {
      this.#domInput.addEventListener('change', () => {
        callbacks.onEdit(this.getUUIDs(), this.getValue());
      });
    }

    if (params.options.some((option) => option.value === this.getInitialValue())) {
      this.#domInput.value = this.getInitialValue();
    }

    return this.#domInput;
  }

  /**
   * Toggle the enabled state of the input field.
   * @param {boolean} shouldBeEnabled Whether the input field should be enabled or disabled.
   */
  toggleEnabled(shouldBeEnabled) {
    if (shouldBeEnabled) {
      this.#domInput.removeAttribute('disabled');
    }
    else {
      this.#domInput.setAttribute('disabled', 'true');
    }
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

import InputField from './input-field.js';
import './input-field-boolean.css';

export default class InputFieldBoolean extends InputField {

  #domInput;
  #valueTrue;
  #valueFalse;

  /**
   * Constructor for the InputFieldText class.
   * @class
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @param {object} factory The factory for creating input fields (for compound fields).
   */
  constructor(params = {}, callbacks = {}, factory = {}) {
    super(params, callbacks, factory);

    this.#valueTrue = params.valueTrue ?? true;
    this.#valueFalse = params.valueFalse ?? false;

    this.getDOM().append(this.#createDOM(params, callbacks));
  }

  /**
   * Get the current value of the input field.
   * @returns {string} The current value of the input field.
   */
  getValue() {
    return (this.#domInput.checked) ? this.#valueTrue : this.#valueFalse;
  }

  /**
   * Set the value of the input field.
   * @param {string[]} uuids The UUIDs of the input field.
   * @param {string|number} value The value to set.
   */
  setValue(uuids, value) {
    if (typeof value !== 'boolean') {
      return;
    }

    if (!this.getUUIDs().some((uuid) => uuids.includes(uuid))) {
      return;
    }

    this.#domInput.checked = value;
  }

  /**
   * Create the DOM element for the input field.
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @returns {HTMLElement} The DOM element for the input field.
   */
  #createDOM(params, callbacks) {
    const dom = document.createElement('fieldset');
    dom.classList.add('message-content-item-input-boolean-fieldset');

    this.#domInput = document.createElement('input');
    this.#domInput.classList.add('message-content-item-input-boolean');
    this.#domInput.setAttribute('type', 'checkbox');
    this.#domInput.setAttribute('id', this.getUUIDs()[0]);
    dom.append(this.#domInput);

    const label = document.createElement('label');
    label.classList.add('message-content-item-input-boolean-label');
    label.setAttribute('for', this.getUUIDs()[0]);
    label.innerText = params.checkboxLabel ?? '';
    dom.append(label);

    if (callbacks.onEdit) {
      this.#domInput.addEventListener('input', () => {
        callbacks.onEdit(this.getUUIDs(), this.getValue());
      });
    }

    return dom;
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

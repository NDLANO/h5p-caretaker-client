import InputField from './input-field.js';
import './input-field-date.css';

/** @constant {number} PADDING General padding. */
const PADDING = 2;

/** @constant {number} ISO_TIMESTAMP_SLICE_INDEX The index to slice the ISO timestamp. */
const ISO_TIMESTAMP_SLICE_INDEX = 16;

export default class InputFieldDate extends InputField {

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
    if (!this.#domInput.value) {
      return this.getInitialValue();
    }

    // Value is formatted as YYYY-MM-DDTHH:mm, but H5P uses DD-MM-YY HH:mm:SS
    const date = new Date(this.#domInput.value);

    const day = String(date.getDate()).padStart(PADDING, '0');
    const month = String(date.getMonth() + 1).padStart(PADDING, '0');
    const year = date.getFullYear().toString().slice(-1 * PADDING);
    const hours = String(date.getHours()).padStart(PADDING, '0');
    const minutes = String(date.getMinutes()).padStart(PADDING, '0');
    const seconds = String(date.getSeconds()).padStart(PADDING, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
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

    if (value === '') {
      return;
    }

    // Convert value to Date object
    const dateParts = value.split(' ')[0].split('-');
    const timeParts = value.split(' ')[1].split(':');
    const date = new Date(
      dateParts[2], // year
      dateParts[1] - 1, // month (0-indexed)
      dateParts[0], // day
      timeParts[0], // hours
      timeParts[1], // minutes
      timeParts[2] || 0 // seconds (default to 0 if not provided)
    );
    const formattedDate = date.toISOString().slice(0, ISO_TIMESTAMP_SLICE_INDEX);

    this.#domInput.value = formattedDate;
  }

  /**
   * Create the DOM element for the input field.
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @returns {HTMLElement} The DOM element for the input field.
   */
  #createDOM(params, callbacks) {
    this.#domInput = document.createElement('input');
    this.#domInput.classList.add('message-content-item-input-date');
    this.#domInput.setAttribute('type', 'datetime-local');

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

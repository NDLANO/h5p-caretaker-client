export default class InputField {

  #dom;
  #factory;
  #uuid;
  #initialValue;
  #semanticsPath;
  #filePath;

  /**
   * Constructor for the InputFieldText class.
   * @class
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @param {object} factory The factory for creating input fields (for compound fields).
   */
  constructor(params = {}, callbacks = {}, factory = {}) {
    this.#factory = factory;
    this.#uuid = params.uuid;
    this.#semanticsPath = params.semanticsPath || '';
    this.#filePath = params.filePath || '';
    this.#initialValue = params.initialValue;

    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-content-input-field');
  }

  /**
   * Get the DOM element for the input field.
   * @returns {HTMLElement} The DOM element for the input field.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Get the UUIDs of this input field, could be multiple for compound fields.
   * Can be overridden by compound fields.
   * @returns {string[]} The UUIDs of the input field.
   */
  getUUIDs() {
    return [this.#uuid];
  }

  /**
   * Get the factory for creating input fields.
   * @returns {object} The factory for creating input fields.
   */
  getFactory() {
    return this.#factory;
  }

  /**
   * Get the initial value of the input field.
   * @returns {string|undefined} The initial value of the input field.
   */
  getInitialValue() {
    return this.#initialValue;
  }

  /**
   * Get the current value of the input field.
   * Needs to be overridden by subclasses.
   * @returns {string|undefined} The current value of the input field.
   */
  getValue() {
    return;
  }

  /**
   * Set the value of the input field.
   * Needs to be overridden by subclasses.
   * @param {string} uuid The UUID of the input field.
   * @param {string|number} value The value to set.
   */
  setValue(uuid, value = '') {}

  /**
   * Get edits.
   * @returns {object[]} The edits for the input field.
   */
  getEdits() {
    if (!this.hasEdits()) {
      return [];
    }

    return [{
      uuid: this.#uuid,
      semanticsPath: this.#semanticsPath,
      ...(this.#filePath && { filePath: this.#filePath }),
      value: this.getValue()
    }];
  }

  /*
   * Determine if the input field has edits.
   * @returns {boolean} True if the input field has edits, false otherwise.
   */
  hasEdits() {
    return this.getValue() !== this.#initialValue;
  }

  makeCurrentValuesInitial() {
    this.#initialValue = this.getValue();
  }
}

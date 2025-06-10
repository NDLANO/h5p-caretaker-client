import InputField from './input-field.js';
import './input-field-group.css';

export default class InputFieldGroup extends InputField {

  #domGroup;
  #children = [];
  #specialType = null;

  /**
   * Constructor for the InputFieldGroup class.
   * @class
   * @param {object} params The parameters for the group field.
   * @param {object} callbacks The callbacks for the group field.
   * @param {object} factory The factory for creating input fields.
   */
  constructor(params = {}, callbacks = {}, factory = {}) {
    super(params, callbacks, factory);

    this.getDOM().append(this.#createDOM(params, callbacks));

    if (this.#isLicenseFieldGroup(params.fields)) {
      this.#specialType = 'license';
      this.#updateLicenseFields();
    }
    else if (this.#isChangeLogFieldGroup(params.fields)) {
      this.#specialType = 'change';
    }
  }

  /**
   * Get all UUIDs of children.
   * @returns {string[]} The UUIDs of the children.
   */
  getUUIDs() {
    return this.#children.map((child) => child.getUUIDs()).flat();
  }

  /**
   * Get the current value of the group field.
   * @returns {string[]} The current value of the group field.
   */
  getValue() {
    return this.#children.map((child) => child.getValue());
  }

  /**
   * Set the value of the group field.
   * @param {string[]} uuids The UUID of the group field.
   * @param {string|number} value The value to set.
   */
  setValue(uuids, value) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return;
    }

    if (!this.getUUIDs().some((uuid) => uuids.includes(uuid))) {
      return;
    }

    this.#children.forEach((child) => {
      child.setValue(uuids, value);
    });
  }

  getEdits() {
    if (!this.hasEdits()) {
      return [];
    }

    return this.#children.map((child) => child.getEdits()).flat();
  }

  hasEdits() {
    return this.#children.some((child) => child.hasEdits());
  }

  /**
   * Create the DOM element for the input field.
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @returns {HTMLElement} The DOM element for the input field.
   */
  #createDOM(params = {}, callbacks = {}) {
    this.#domGroup = document.createElement('div');
    this.#domGroup.classList.add('message-content-item-input-group');

    params.fields.forEach((fieldParams) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('message-content-item-input-group-wrapper');
      this.#domGroup.append(wrapper);

      const label = document.createElement('label');
      label.classList.add('message-content-item-input-group-label');
      label.innerText = fieldParams.label;
      wrapper.append(label);

      const factory = this.getFactory();
      const field = factory.produce(fieldParams, { onEdit: (uuids, value) => {
        if (this.#specialType === 'license') {
          this.#updateLicenseFields(uuids, value);
        }
        else if (this.#specialType === 'change') {
          this.#updateChangeLogFields(uuids, value);
        }

        callbacks.onEdit?.(uuids, value);
      } }, factory);
      this.#children.push(field);
      wrapper.append(field.getDOM());
    });

    return this.#domGroup;
  }

  /**
   * Update license fields. Special handler for metadata license fields.
   * Not worth generalizing this currently.
   */
  #updateLicenseFields() {
    const licensesWithVersionNumber = ['CC BY', 'CC BY-SA', 'CC BY-NC', 'CC BY-NC-SA', 'CC BY-ND', 'CC BY-NC-ND'];

    const licenseChildValue = this.#children[0].getValue();
    if (licensesWithVersionNumber.includes(licenseChildValue)) {
      this.#children[1].toggleEnabled(true);
      this.#children[1].toggleValidity(this.#children[1].getValue() !== '');
    }
    else {
      this.#children[1].toggleEnabled(false);
      this.#children[1].setValue(this.#children[1].getUUIDs(), '');
      this.#children[1].toggleValidity(true);
    }
  }

  #updateChangeLogFields(uuids, value) {
    const areAllChildrenUnset = this.#children.every((child) => (child.getValue() ?? '') === '');
    const areAllChildrenSet = this.#children.every((child) => (child.getValue() ?? '') !== '');

    if (areAllChildrenUnset || areAllChildrenSet) {
      this.#children.forEach((child) => {
        child.toggleValidity(true);
      });

      return;
    }

    this.#children.forEach((child) => {
      const isSet = (child.getValue() ?? '') !== '';
      child.toggleValidity(isSet);
    });
  }

  /**
   * Ensure that the current values of the input fields are set to their initial values.
   */
  makeCurrentValuesInitial() {
    this.#children.forEach((child) => {
      child.makeCurrentValuesInitial();
    });
  }

  /**
   * Check if a field is of a specific type and has a semanticsPath ending with a specific string
   * @param {object} field Field to check
   * @param {string} type Expected field type
   * @param {string} semanticsPathEnd Expected semanticsPath ending
   * @returns {boolean} True if field matches criteria
   */
  #isFieldOfType(field, type, semanticsPathEnd) {
    return field?.type === type && field?.semanticsPath?.endsWith(semanticsPathEnd);
  }

  /**
   * Check if fields form a license field group
   * @param {Array} fields Fields to check
   * @returns {boolean} True if fields form a license field group
   */
  #isLicenseFieldGroup(fields) {
    return this.#isFieldOfType(fields[0], 'select', 'license') &&
           this.#isFieldOfType(fields[1], 'select', 'licenseVersion');
  }

  /**
   * Check if fields form a change log field group
   * @param {Array} fields Fields to check
   * @returns {boolean} True if fields form a change log field group
   */
  #isChangeLogFieldGroup(fields) {
    return this.#isFieldOfType(fields[0], 'date', 'date') &&
           this.#isFieldOfType(fields[1], 'text', 'author') &&
           this.#isFieldOfType(fields[2], 'textarea', 'log');
  }
}

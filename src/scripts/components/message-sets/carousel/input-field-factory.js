import InputField from './input-fields/input-field.js';
import InputFieldText from './input-fields/input-field-text.js';
import InputFieldTextArea from './input-fields/input-field-text-area.js';
import InputFieldGroup from './input-fields/input-field-group.js';
import InputFieldSelect from './input-fields/input-field-select.js';
import InputFieldDate from './input-fields/input-field-date.js';
import InputFieldBoolean from './input-fields/input-field-boolean.js';

export default class InputFieldFactory {

  /**
   * Create an input field of the specified type.
   * @param {object} params The parameters for the input field.
   * @param {object} callbacks The callbacks for the input field.
   * @returns {InputField} An instance of the specified input field type.
   * @throws {Error} If the input field type is unknown.
   */
  static produce(params = {}, callbacks = {}) {
    switch (params.type) {
      case 'text':
        return new InputFieldText(params, callbacks, this);
      case 'textarea':
        return new InputFieldTextArea(params, callbacks, this);
      case 'group':
        return new InputFieldGroup(params, callbacks, this);
      case 'select':
        return new InputFieldSelect(params, callbacks, this);
      case 'date':
        return new InputFieldDate(params, callbacks, this);
      case 'boolean':
        return new InputFieldBoolean(params, callbacks, this);
      default:
        throw new Error(`Unknown input field type: ${params.type}`);
    }
  }
}

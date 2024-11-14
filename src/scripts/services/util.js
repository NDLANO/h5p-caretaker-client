/** @constant {number} HEX_BASE Hex base. */
const HEX_BASE = 16;

/** @constant {number} MASK Mask to keep last two bits. */
const MASK = 0x3;

/** @constant {number} OFFSET Offset to set 4th bit to 1. */
const OFFSET = 0x8;

/**
 * Create a UUID.
 * @returns {string} A UUID.
 */
export const createUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.random() * HEX_BASE | 0;
    const value = char === 'x' ? random : (random & MASK | OFFSET);
    return value.toString(HEX_BASE);
  });

/**
 * Capitalize a string.
 * @param {string} string to be capitalized.
 * @returns {string} Capitalized string.
 */
export const capitalize = (string) => {
  if (typeof string !== 'string') {
    return '';
  }

  return `${string[0].toUpperCase()}${string.slice(1)}`;
};

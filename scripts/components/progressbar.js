export class Progressbar {

  #progress = 0;

  // DOM elements
  #dom;
  #barBackground;
  #bar;
  #value;

  /**
   * @constructor
   * @param {object} params Parameters for the progress bar.
   */
  constructor(params = {}) {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('progressbar-wrapper');

    this.#barBackground = document.createElement('div');
    this.#barBackground.setAttribute('role', 'progressbar');
    this.#barBackground.setAttribute('aria-label', params.l10n.uploadProgress);
    this.#barBackground.classList.add('progressbar-background');
    this.#dom.appendChild(this.#barBackground);

    this.#bar = document.createElement('div');
    this.#bar.classList.add('progressbar-fill');
    this.#barBackground.appendChild(this.#bar);

    this.#value = document.createElement('span');
    this.#value.classList.add('progress-value');
    this.#dom.appendChild(this.#value);

    this.setProgress(0);
  }

  /**
   * Get DOM element of the progress bar.
   * @returns {HTMLElement} The DOM element of the progress bar.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Show the progress bar.
   */
  show() {
    this.#dom.classList.remove('display-none');
  }

  /**
   * Hide the progress bar.
   */
  hide() {
    this.#dom.classList.add('display-none');
  }

  /**
   * Set the progress of the progress bar.
   * @param {number} progress Progress of the progress bar in percentage.
   */
  setProgress(progress) {
    if (typeof progress !== 'number') {
      return;
    }

    progress = Math.max(0, Math.min(progress, 100));
    this.#progress = progress;
    this.#dom.setAttribute('aria-valuenow', this.#progress);
    this.#bar.style.width = `${this.#progress}%`;
    this.#value.innerText = `${Math.floor(this.#progress)}%`;
  }

  /**
   * Get the progress of the progress bar.
   * @returns {number} Progress of the progress bar in percentage.
   */
  getProgress() {
    return this.#progress;
  }
}

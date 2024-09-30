export class Progressbar {

  #progress = 0;

  #dom;
  #barBackground;
  #bar;
  #value;

  constructor() {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('progressbar-wrapper');

    this.#barBackground = document.createElement('div');
    this.#barBackground.setAttribute('role', 'progressbar');
    this.#barBackground.setAttribute('aria-label', 'Upload progress');
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

  getDOM() {
    return this.#dom;
  }

  show() {
    this.#dom.classList.remove('display-none');
  }

  hide() {
    this.#dom.classList.add('display-none');
  }

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

  getProgress() {
    return this.#progress;
  }
}

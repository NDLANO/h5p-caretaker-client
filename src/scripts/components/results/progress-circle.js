const DEFAULT_SIZE = '5rem';
const DEFAULT_STROKE_WIDTH = '0.5rem';

const MAX_PERCENTAGE = 100;

const STATUS_RANGES = {
  5: 'good',
  10: 'neutral',
  100: 'bad'
};

export class ProgressCircle {

  #dom;
  #valueText;
  #label;

  #params;

  /**
   * @class ProgressCircle
   * @param {object} params Parameters for the progress circle.
   */
  constructor(params = {}) {
    this.#params = params;
    if (typeof params.size === 'number') {
      params.size = `${params.size}px`;
    }
    this.#params.size = params.size ?? DEFAULT_SIZE;
    this.#params.strokeWidth = params.strokeWidth ?? DEFAULT_STROKE_WIDTH;
    this.#params.max = params.max ?? MAX_PERCENTAGE;

    this.#dom = document.createElement('div');
    this.#dom.classList.add('progress-circle-wrapper');
    this.#dom.style.setProperty('--size', this.#params.size);
    this.#dom.style.setProperty('--stroke-width', this.#params.strokeWidth);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    circle.classList.add('progress-circle');
    circle.setAttribute('width', '100%');
    circle.setAttribute('height', '100%');
    this.#dom.append(circle);

    const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    backgroundCircle.setAttribute('class', 'progress-circle-background');
    circle.append(backgroundCircle);

    const foregroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    foregroundCircle.setAttribute('class', 'progress-circle-foreground');
    circle.append(foregroundCircle);

    this.setColor(this.#params.color);

    this.#valueText = document.createElement('span');
    this.#valueText.classList.add('progress-circle-value');
    this.setValue(this.#params.value, this.#params.max, this.#params.percentage);
    this.#dom.append(this.#valueText);

    this.#label = document.createElement('span');
    this.#label.classList.add('progress-circle-label');
    this.setLabel(this.#params.label, this.#params.link);
    this.#dom.append(this.#label);
  }

  getDOM() {
    return this.#dom;
  }

  setValue(value, max = MAX_PERCENTAGE, percentage = true) {
    if (typeof value !== 'number') {
      return;
    }

    if (typeof max !== 'number' || max < 0) {
      max = MAX_PERCENTAGE;
    }

    if (typeof percentage !== 'boolean') {
      percentage = true;
    }

    value = Math.max(0, Math.min(max, value));
    if (percentage) {
      value = value / max * MAX_PERCENTAGE;
    }
    value = Math.round(value);

    this.#params.value = value;

    if (percentage) {
      this.#dom.style.setProperty('--progress', value);
    }
    else {
      this.#dom.style.setProperty('--progress', value / max * MAX_PERCENTAGE);
    }

    this.#dom.classList.toggle('empty', value === 0);

    if (!percentage) {
      this.#valueText.innerText = `${value}`;
    }
    else {
      this.#valueText.innerText = `${value}%`;
    }

    if (value === 0) {
      this.setColor('transparent');
    }
    else {
      this.setColor(this.#params.color);
    }
  }

  setLabel(label, link) {
    if (typeof label !== 'string') {
      return;
    }

    if (!link) {
      this.#label.innerText = label;
    }

    this.#label.innerHTML = `<a href="${link}">${label}</a>`;
  }

  setColor(color) {
    if (typeof color !== 'string') {
      return;
    }

    this.#dom.style.setProperty('--stroke-color', color);

    if (color !== 'transparent' && color !== 'status') {
      this.#params.color = color;
    }

    if (color === 'status') {
      const percentage = this.#params.value / this.#params.max * MAX_PERCENTAGE;
      for (const range in STATUS_RANGES) {
        if (percentage <= range) {
          this.#dom.style.setProperty('--stroke-color', `var(--color-status-${STATUS_RANGES[range]})`);
          break;
        }
      }
    }
  }
}

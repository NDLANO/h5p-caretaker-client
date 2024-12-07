import { ProgressCircle } from './progress-circle.js';

export class ResultsRow {

  #dom;
  #messageCount;
  #progressCircles = {};

  /**
   * @class
   * @param {object} params Parameters for the results row.
   * @param {string} params.header Header.
   * @param {string} params.value Value.
   * @param {object[]} params.items Items.
   * @param {number} params.items[].value Value.
   * @param {number} params.items[].max Max value.
   * @param {number} params.items[].percentage Percentage.
   * @param {string} params.items[].label Label.
   * @param {string} params.items[].color Color.
   * @returns {HTMLElement} Results row.
   */
  constructor(params = {}) {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('results-row');

    const overview = document.createElement('div');
    overview.classList.add('overview');
    this.#dom.append(overview);

    const overviewHeader = document.createElement('div');
    overviewHeader.classList.add('overview-header');
    overviewHeader.textContent = params.header;
    overview.append(overviewHeader);

    this.#messageCount = document.createElement('div');
    this.#messageCount.classList.add('overview-value');
    this.#messageCount.textContent = params.value;
    overview.append(this.#messageCount);

    const progressCirclesDOM = document.createElement('div');
    progressCirclesDOM.classList.add('progress-circles');
    this.#dom.append(progressCirclesDOM);

    params.items.forEach((item) => {
      const progressCircle = new ProgressCircle({
        id: item.id,
        value: item.value,
        max: item.max,
        percentage: item.percentage,
        label: item.label,
        link: item.link,
        color: item.color
      });
      progressCirclesDOM.append(progressCircle.getDOM());

      this.#progressCircles[item.id] = progressCircle;
    });
  }

  /**
   * Get the DOM element.
   * @returns {HTMLElement} DOM element.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Update the results row.
   * @param {object} params Parameters for the results row.
   * @param {number} params.messageCount Message count.
   * @param {object[]} params.items Items or progress circles.
   * @param {number} params.items[].value Value for the progress circle.
   * @param {number} params.items[].max Max value for the progress circle.
   * @param {boolean} params.items[].percentage If true, use percentage.
   */
  update(params = {}) {
    if (typeof params.messageCount !== 'number' || !params.items) {
      return;
    }

    this.#messageCount.textContent = params.messageCount;

    Object.keys(this.#progressCircles).forEach((key) => {
      const item = params.items.find((item) => item.id === key);
      if (!item) {
        this.#progressCircles[key].setValue(0, params.messageCount, false);
      }
      else {
        this.#progressCircles[key].setValue(item.value, item.max, item.percentage);
      }
    });
  }
}

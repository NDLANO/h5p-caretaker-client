import { ProgressCircle } from '@components/progress-circle.js';
import { capitalize } from '@services/util.js';

export class Results {

  #dom;
  #resultsBox;

  #params;
  #callbacks;
  #resultsRows;

  /**
   * @class Results
   * @param {object} params Parameters for the results box.
   * @param {object} params.results Results.
   * @param {object} params.l10n Localization.
   * @param {object} [callbacks] Callbacks.
   */
  constructor(params = {}, callbacks = {}) {
    this.#params = params;
    this.#callbacks = callbacks;
    this.#callbacks.onGroupingChanged = this.#callbacks.onGroupingChanged ?? (() => {});

    this.#resultsRows = this.#buildResultsRows(this.#params.results);

    this.#dom = document.createElement('div');
    this.#dom.classList.add('results');

    const resultsHeader = document.createElement('div');
    resultsHeader.classList.add('results-header');
    resultsHeader.textContent = 'Results';
    this.#dom.append(resultsHeader);

    this.#resultsBox = document.createElement('div');
    this.#resultsBox.classList.add('results-box');
    this.#dom.append(this.#resultsBox);

    this.#resultsBox.append(this.#resultsRows.level);
    this.#resultsBox.append(this.#buildNavigationRow());
  }

  /**
   * Get the DOM element.
   * @returns {Element} DOM element.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Build the results rows.
   * @param {object} results Results.
   * @returns {object} Results rows.
   */
  #buildResultsRows(results) {
    const resultsRows = {};

    for (const key in results) {
      resultsRows[key] = this.#buildResultsRow(results[key]);
    }

    return resultsRows;
  }

  /**
   * Build a results row.
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
  #buildResultsRow(params = {}) {
    const resultsRow = document.createElement('div');
    resultsRow.classList.add('results-row');

    const overview = document.createElement('div');
    overview.classList.add('overview');
    resultsRow.append(overview);

    const overviewHeader = document.createElement('div');
    overviewHeader.classList.add('overview-header');
    overviewHeader.textContent = params.header;
    overview.append(overviewHeader);

    const overviewValue = document.createElement('div');
    overviewValue.classList.add('overview-value');
    overviewValue.textContent = params.value;
    overview.append(overviewValue);

    const progressCirclesDOM = document.createElement('div');
    progressCirclesDOM.classList.add('progress-circles');
    resultsRow.append(progressCirclesDOM);

    params.items.forEach((item) => {
      const progressCircle = new ProgressCircle({
        value: item.value,
        max: item.max,
        percentage: item.percentage,
        label: item.label,
        color: item.color
      });
      progressCirclesDOM.append(progressCircle.getDOM());
    });

    return resultsRow;
  }

  /**
   * Build the navigation row.
   * @returns {HTMLElement} Navigation row.
   */
  #buildNavigationRow() {
    const navigationRow = document.createElement('div');
    navigationRow.classList.add('navigation-row');

    const selectGrouping = document.createElement('select');
    selectGrouping.classList.add('select-grouping');
    selectGrouping.addEventListener('change', (event) => {
      this.#handleGroupingChanged(event);
    });
    navigationRow.append(selectGrouping);

    for (const key in this.#params.results) {
      const option = document.createElement('option');
      option.value = key;

      const groupBy = this.#params.l10n.groupBy;
      const label = capitalize(this.#params.results[key].label ?? key);
      option.textContent = `${groupBy}: ${label}`;

      selectGrouping.append(option);
    }

    const buttonDownload = document.createElement('button');
    buttonDownload.classList.add('button-download');
    buttonDownload.textContent = this.#params.l10n.download;
    navigationRow.append(buttonDownload);

    return navigationRow;
  }

  #handleGroupingChanged(event) {
    this.#resultsBox.querySelector('.results-row').remove();
    this.#resultsBox.prepend(this.#resultsRows[event.target.value]);

    this.#callbacks.onGroupingChanged(event.target.value);
  }
}

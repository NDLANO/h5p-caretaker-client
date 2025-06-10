import { ResultsRow } from './results-row.js';
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
   * @param {function} [callbacks.onResultsTypeChanged] Callback for when the results type is changed.
   * @param {function} [callbacks.onDownload] Callback for when the download button is clicked.
   */
  constructor(params = {}, callbacks = {}) {
    this.#params = params;
    this.#callbacks = callbacks;
    this.#callbacks.onResultsTypeChanged = this.#callbacks.onResultsTypeChanged ?? (() => {});
    this.#callbacks.onDownload = this.#callbacks.onDownload ?? (() => {});

    this.#resultsRows = this.#buildResultsRows(this.#params.results);

    this.#dom = document.createElement('div');
    this.#dom.classList.add('results');
    this.#dom.classList.add('block-visible');

    const resultsHeader = document.createElement('div');
    resultsHeader.classList.add('results-header');
    resultsHeader.textContent = params.l10n.results;
    this.#dom.append(resultsHeader);

    this.#resultsBox = document.createElement('div');
    this.#resultsBox.classList.add('results-box');
    this.#dom.append(this.#resultsBox);

    this.#resultsBox.append(this.#resultsRows[Object.keys(this.#params.results)[0]].getDOM());
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
   * Update the results.
   * @param {object} results Results.
   */
  update(results) {
    for (const key in results) {
      this.#resultsRows[key].update({
        messageCount: results[key].value,
        items: results[key].items
      });
    }
  }

  /**
   * Toggle the disabled state of the download button.
   * @param {boolean} shouldBeEnabled Whether the button should be enabled or disabled.
   */
  toggleDownloadButton(shouldBeEnabled) {
    if (typeof shouldBeEnabled !== 'boolean') {
      shouldBeEnabled = this.downloadButton.disabled === true;
    }

    this.buttonDownload.disabled = !shouldBeEnabled;
  }

  /**
   * Build the results rows.
   * @param {object} results Results.
   * @returns {object} Results rows.
   */
  #buildResultsRows(results) {
    const resultsRows = {};

    for (const key in results) {
      resultsRows[key] = new ResultsRow(results[key]);
    }

    return resultsRows;
  }

  /**
   * Build the navigation row.
   * @returns {HTMLElement} Navigation row.
   */
  #buildNavigationRow() {
    const navigationRow = document.createElement('div');
    navigationRow.classList.add('navigation-row');

    const selectResultsType = document.createElement('select');
    selectResultsType.name = 'select-results-type';
    selectResultsType.setAttribute('aria-label', this.#params.l10n.changeSortingGrouping);
    selectResultsType.classList.add('select-results-type');
    selectResultsType.addEventListener('change', (event) => {
      this.#handleResultsTypeChanged(event);
    });
    navigationRow.append(selectResultsType);

    for (const key in this.#params.results) {
      const option = document.createElement('option');
      option.value = key;

      const resultsType = this.#params.results[key].type;
      const label = capitalize(this.#params.results[key].label ?? key);

      if (resultsType === 'filter') {
        option.textContent = `${this.#params.l10n.filterBy}: ${label}`;
      }
      else if (resultsType === 'group') {
        option.textContent = `${this.#params.l10n.groupBy}: ${label}`;
      }
      else {
        option.textContent = label;
      }

      selectResultsType.append(option);
    }

    this.buttonDownload = document.createElement('button');
    this.buttonDownload.classList.add('button-download');
    this.buttonDownload.textContent = this.#params.l10n.download;
    this.buttonDownload.addEventListener('click', () => {
      this.#callbacks.onDownload();
    });
    navigationRow.append(this.buttonDownload);

    this.toggleDownloadButton(false);

    return navigationRow;
  }

  /**
   * Handle results type changed.
   * @param {Event} event Event.
   */
  #handleResultsTypeChanged(event) {
    this.#resultsBox.querySelector('.results-row').remove();
    this.#resultsBox.prepend(this.#resultsRows[event.target.value].getDOM());

    this.#callbacks.onResultsTypeChanged(event.target.value);
  }
}

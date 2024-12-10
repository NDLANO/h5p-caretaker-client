import { capitalize } from '@services/util.js';
import { Dropzone } from '@components/dropzone/dropzone.js';
import { Results } from '@components/results/results.js';
import { MessageSets } from '@components/message-sets/message-sets.js';
import { Report } from '@models/report.js';
import '@styles/main.css';
import { ContentFilter } from '@components/content-filter/content-filter.js';

/** @constant {string} DEFAULT_UPLOAD_ENDPOINT Default upload endpoint. */
const DEFAULT_UPLOAD_ENDPOINT = './upload';

/** @constant {string} DEFAULT_LOCALE_KEY Default locale key for GET parameters. */
const DEFAULT_LOCALE_KEY = 'locale';

/** @constant {object} DEFAULT_L10N Default localization. */
const DEFAULT_L10N = {
  orDragTheFileHere: 'or drag the file here', // Dropzone: call to action
  removeFile: 'Remove file', // Dropzone: remove file button
  selectYourLanguage: 'Select your language', // Language select field
  uploadProgress: 'Upload progress', // Dropzone: upload progress
  uploadYourH5Pfile: 'Upload your H5P file', // Dropzone: upload call to action
  yourFileIsBeingChecked: 'Your file is being checked', // Dropzone: file is being checked
  yourFileWasCheckedSuccessfully: 'Your file was checked successfully', // Dropzone: file was checked successfully
  totalMessages: 'Total messages', // Results: total messages
  issues: 'issues', // Results: issues
  results: 'results', // Results: results
  filterBy: 'Filter by', // Results: group by
  groupBy: 'Group by', // Results: group by
  download: 'Download', // Results: download
  expandAllMessages: 'Expand all messages', // MessageAccordion: expand all messages
  collapseAllMessages: 'Collapse all messages', // MessageAccordion: collapse all messages
  allFilteredOut: 'All messages have been filtered out by content.', // MessageAccordion
  reportTitleTemplate: 'H5P Caretaker report for @title', // Report: report title template
  contentFilter: 'Content filter', // ContentFilter: filter by content
  showAll: 'Show all', // ContentFilter: show all
  showSelected: 'Various selected contents', // ContentFilter: show selected
  showNone: 'Show none', // ContentFilter: show none
  filterByContent: 'Filter by content:', // ContentFilter: filter by content
  reset: 'Reset', // ContentFilter: reset
};

/** @constant {object} XHR status codes */
const XHR_STATUS_CODES = {
  OK: 200,
  MULTIPLE_CHOICES: 300
};

class Main {
  #dropzone;
  #results;
  #messageSets;
  #endpoint;
  #l10n;

  /**
   * @class
   */
  constructor() {
    this.#l10n = { ...DEFAULT_L10N, ...window.H5P_CARETAKER_L10N };

    const mainDOMElement = document.querySelector('main');
    this.#endpoint = mainDOMElement?.dataset.uploadEndpoint ?? DEFAULT_UPLOAD_ENDPOINT;

    document.addEventListener('DOMContentLoaded', () => {
      this.#initialize();
    });
  }

  /**
   * Initialize the main class.
   */
  #initialize() {
    // Language select field
    const languageSelect = document.querySelector('.h5p-caretaker .select-language');
    languageSelect?.setAttribute('aria-label', DEFAULT_L10N.selectYourLanguage);
    languageSelect?.addEventListener('change', (event) => {
      this.#handleLanguageChanged(event);
    });

    // Dropzone
    this.#dropzone = new Dropzone(
      {
        selectorDropzone: '.h5p-caretaker .dropzone',
        l10n: {
          orDragTheFileHere: this.#l10n.orDragTheFileHere,
          removeFile: this.#l10n.removeFile,
          uploadProgress: this.#l10n.uploadProgress,
          uploadYourH5Pfile: this.#l10n.uploadYourH5Pfile
        }
      },
      {
        upload: async (file) => {
          this.#upload(file);
        },
        reset: () => {
          this.#reset();
        }
      }
    );
  }

  /**
   * Handle file upload via dropzone.
   * @param {File} file File to upload.
   */
  #upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.set('locale', document.querySelector('.select-language')?.value ?? 'en');

    this.#dropzone.setStatus('');
    this.#dropzone.showProgress();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.#endpoint, true);

    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable) {
        return;
      }

      // eslint-disable-next-line no-magic-numbers
      this.#updateProgress((event.loaded / event.total) * 100);
    });

    xhr.addEventListener('load', () => {
      this.#handleFileUploaded(xhr);
    });

    xhr.addEventListener('error', () => {
      this.#setErrorMessage(xhr.statusText);
    });

    // Send the request
    xhr.send(formData);
  }

  /**
   * Handle reset.
   */
  #reset() {
    document.querySelector('.filter-tree').innerHTML = '';
    document.querySelector('.output').innerHTML = '';
  }

  /**
   * Handle language changed.
   * @param {Event} event ChangeEvent.
   */
  #handleLanguageChanged(event) {
    // Don't mess with parameters that are set already, but keep them
    const params = new URLSearchParams(window.location.search);
    params.set(event.target.dataset.localeKey ?? DEFAULT_LOCALE_KEY, event.target.value);

    window.location.href = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  }

  /**
   * Update the progress of the upload.
   * @param {number} percentage Percentage of the upload.
   */
  #updateProgress(percentage) {
    this.#dropzone.setProgress(percentage);

    // eslint-disable-next-line no-magic-numbers
    if (percentage === 100) {
      this.#dropzone.hideProgress();
      this.#dropzone.setStatus(this.#l10n.yourFileIsBeingChecked, 'pulse');
    }
  }

  /**
   * Handle file uploaded.
   * @param {XMLHttpRequest} xhr XMLHttpRequest object.
   */
  #handleFileUploaded(xhr) {
    this.#dropzone.hideProgress();
    if (xhr.status >= XHR_STATUS_CODES.OK && xhr.status < XHR_STATUS_CODES.MULTIPLE_CHOICES) {
      const data = JSON.parse(xhr.responseText);

      // TODO: This is a general debug output, remove this once done
      // eslint-disable-next-line no-console
      console.log(data);

      this.#l10n = { ...this.#l10n, ...data.client.translations };

      this.#dropzone.setStatus(this.#l10n.yourFileWasCheckedSuccessfully);

      // Map content tree to the format expected by the content filter
      const mapContentTree = (input) => {
        const mapped = {
          label: input.label,
          subcontentId: input.subContentId
        };

        if (Array.isArray(input.children)) {
          mapped.items = input.children.map((child) => mapContentTree(child));
        }

        return mapped;
      };

      const contentFilter = new ContentFilter(
        {
          item: mapContentTree(data.contentTree),
          l10n: {
            contentFilter: this.#l10n.contentFilter,
            showAll: this.#l10n.showAll,
            showSelected: this.#l10n.showSelected,
            showNone: this.#l10n.showNone,
            filterByContent: this.#l10n.filterByContent,
            reset: this.#l10n.reset
          }
        },
        {
          onFilterChange: (subContentIds) => {
            const filteredResults = this.#computeResults(data.messages.filter((message) => {
              return subContentIds.includes(message.subContentId);
            }));

            this.#results.update(filteredResults);
            this.#messageSets.filter(subContentIds);
          }
        }
      );
      document.querySelector('.filter-tree').append(contentFilter.getDOM());

      data.messages = data.messages.map((message) => {
        // Custom client requirement to have this property
        message.issues = (message.level === 'error' || message.level === 'warning') ? 'issues' : false;

        const path = message.details?.path;
        if (!path || !path.startsWith('images/')) {
          return message;
        }

        if (message.details?.path && message.details?.path.startsWith('images/')) {
          message.details.base64 = data.raw.media.images[path.split('/').pop()].base64;
        }

        return message;
      });

      this.#results = new Results(
        {
          results: this.#computeResults(data.messages),
          l10n: {
            results: this.#l10n.results,
            filterBy: this.#l10n.filterBy,
            groupBy: this.#l10n.groupBy,
            download: this.#l10n.download
          }
        },
        {
          onResultsTypeChanged: (id) => {
            this.#messageSets.show(id);
          },
          onDownload: () => {
            const title = this.#l10n.reportTitleTemplate
              .replace('@title', `${data.raw.h5pJson.title} (${data.raw.h5pJson.mainLibrary})`);

            const report = new Report({
              title: title,
              messages: data.messages,
              l10n: this.#l10n,
              translations: data.client.translations
            });
            report.download();
          }
        }
      );
      document.querySelector('.output').append(this.#results.getDOM());

      const categoryNames = [...new Set(data.messages.map((message) => message.category))];
      this.#messageSets = new MessageSets({
        sets: {
          issues: [{ id: 'issues', header: this.#l10n.issues }],
          level: ['error', 'warning', 'info'],
          category: categoryNames
        },
        messages: data.messages,
        translations: data.client.translations,
        l10n: {
          expandAllMessages: this.#l10n.expandAllMessages,
          collapseAllMessages: this.#l10n.collapseAllMessages,
          allFilteredOut: this.#l10n.allFilteredOut
        }
      });
      document.querySelector('.output').append(this.#messageSets.getDOM());
    }
    else {
      this.#setErrorMessage(xhr.responseText);
    }
  }

  #computeResults(messages) {
    const typeItems = [
      {
        id: 'error',
        value: messages.filter((message) => message.level === 'error').length,
        max: messages.length,
        label: capitalize(this.#l10n.errors),
        link: 'error',
        color: 'var(--color-error)',
        percentage: false
      },
      {
        id: 'warning',
        value: messages.filter((message) => message.level === 'warning').length,
        max: messages.length,
        label: capitalize(this.#l10n.warnings),
        link: 'warning',
        color: 'var(--color-warning)',
        percentage: false
      },
      {
        id: 'info',
        value: messages.filter((message) => message.level === 'info').length,
        max: messages.length,
        label: capitalize(this.#l10n.infos),
        link: 'info',
        color: 'var(--color-info)',
        percentage: false
      }
    ];

    const categoryNames = [...new Set(messages.map((message) => message.category))];
    const categoryItems = categoryNames.map((category) => {
      return {
        id: category,
        value: messages.filter((message) => message.category === category).length,
        max: messages.length,
        label: capitalize(this.#l10n[category]),
        link: `#${category}`,
        color: 'var(--color-primary)',
        percentage: false
      };
    });

    const issueItems = [{
      id: 'issues',
      value: messages.filter((message) => message.issues).length,
      max: messages.length,
      label: capitalize(this.#l10n.issues),
      link: `#${this.#l10n.issues}`,
      color: 'status',
      percentage: false
    }];

    return {
      issues: {
        label: this.#l10n.issues,
        header: this.#l10n.totalMessages,
        value: messages.length,
        items: issueItems,
        type: 'filter'
      },
      level: {
        label: this.#l10n.level,
        header:this.#l10n.totalMessages,
        value: messages.length,
        items: typeItems,
        type: 'group'
      },
      category: {
        label: this.#l10n.category,
        header: this.#l10n.totalMessages,
        value: messages.length,
        items: categoryItems,
        type: 'group'
      }
    };
  }

  /**
   * Set error message.
   * @param {string} message Message to display.
   */
  #setErrorMessage(message) {
    this.#dropzone.setStatus(message, 'error');
  }
}

new Main();

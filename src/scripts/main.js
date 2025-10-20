import { capitalize, containsHtmlTags, createUUID } from '@services/util.js';
import { Dropzone } from '@components/dropzone/dropzone.js';
import { Results } from '@components/results/results.js';
import { MessageSets } from '@components/message-sets/message-sets.js';
import { Report } from '@models/report.js';
import { ContentFilter } from '@components/content-filter/content-filter.js';
import '@styles/main.css';

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
  yourFileIsBeingChecked: 'Your file is being checked ...', // Dropzone: file is being checked
  yourFileWasCheckedSuccessfully: 'Your file check was completed.', // Dropzone: file was checked successfully
  // eslint-disable-next-line max-len
  instructions: 'Now do all the changes that you deem necessary and download the edited version of your file.', // Dropzone: instructions after check
  totalMessages: 'Total messages', // Results: total messages
  issues: 'issues', // Results: issues
  results: 'results', // Results: results
  filterBy: 'Filter by', // Results: group by
  groupBy: 'Group by', // Results: group by
  download: 'Download', // Results: download
  downloadEditedH5P: 'Download edited H5P', // Results: download edited H5P
  allFilteredOut: 'All messages have been filtered out by content.', // MessageAccordion
  contentFilter: 'Content filter', // ContentFilter: filter by content
  showAll: 'Show all', // ContentFilter: show all
  showSelected: 'Various selected contents', // ContentFilter: show selected
  showNone: 'Show none', // ContentFilter: show none
  filterByContent: 'Filter by content:', // ContentFilter: filter by content
  reset: 'Reset', // ContentFilter: reset,
  showDetails: 'Show details', // MessageContent: show details
  hideDetails: 'Hide details', // MessageContent: hide details
  unknownError: 'Something went wrong, but I dunno what, sorry!', // General error message
  checkServerLog: 'Please check the server log.', // Ask for help
  expandList: 'Expand list', // Expand list
  collapseList: 'Collapse list', // Collapse list
  changeSortingGrouping: 'Change sorting/grouping', // Select results type
  nextMessage: 'Next message', // Carousel: next message
  previousMessage: 'Previous message', // Carousel: previous message
};

/** @constant {object} XHR_STATUS_CODES XHR status codes */
const XHR_STATUS_CODES = {
  OK: 200,
  MULTIPLE_CHOICES: 300
};

class H5PCaretaker {
  #dropzone;
  #results;
  #messageSets;
  #endpoint;
  #sessionKeyName;
  #sessionKeyValue;
  #l10n;
  #callbacks = {};

  /**
   * @class
   * @param {object} params Parameters.
   * @param {string} params.endpoint Endpoint for the upload.
   * @param {string} [params.sessionKeyName] Session key name.
   * @param {string} [params.sessionKeyValue] Session key value.
   * @param {object} params.l10n Localization.
   * @param {object} callbacks Callbacks.
   * @param {function} callbacks.onInitialized Callback when initialized.
   * @param {function} callbacks.onUploadStarted Callback when upload started.
   * @param {function} callbacks.onUploadEnded Callback when upload ended.
   * @param {function} callbacks.onReset Callback when reset.
   */
  constructor(params = {}, callbacks = {}) {
    this.#l10n = { ...DEFAULT_L10N, ...window.H5P_CARETAKER_L10N, ...params.l10n };

    this.#endpoint = params.endpoint;
    this.#sessionKeyName = params.sessionKeyName;
    this.#sessionKeyValue = params.sessionKeyValue;

    if (!this.#endpoint) {
      const mainDOMElement = document.querySelector('.h5p-caretaker');
      this.#endpoint = mainDOMElement?.dataset.uploadEndpoint ?? DEFAULT_UPLOAD_ENDPOINT;
    }

    this.#callbacks = callbacks;
    this.#callbacks.onInitialized = this.#callbacks.onInitialized ?? (() => {});
    this.#callbacks.onUploadStarted = this.#callbacks.onUploadStarted ?? (() => {});
    this.#callbacks.onUploadEnded = this.#callbacks.onUploadEnded ?? (() => {});
    this.#callbacks.onReset = this.#callbacks.onReset ?? (() => {});

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.#initialize();
      });
    }
    else {
      this.#initialize();
    }
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
        ...(this.#sessionKeyName && { sessionKeyName: this.#sessionKeyName }),
        ...(this.#sessionKeyValue && { sessionKeyValue: this.#sessionKeyValue }),
        l10n: {
          orDragTheFileHere: this.#l10n.orDragTheFileHere,
          removeFile: this.#l10n.removeFile,
          uploadProgress: this.#l10n.uploadProgress,
          uploadYourH5Pfile: this.#l10n.uploadYourH5Pfile
        }
      },
      {
        upload: async (params) => {
          this.#uploadForAnalysis(params);
        },
        reset: () => {
          this.#reset();
        }
      }
    );

    window.setTimeout(() => {
      this.#callbacks.onInitialized();
    }, 0);
  }

  /**
   * Upload an H5P file to be checked by the library.
   * @param {string} url URL to upload from.
   */
  async uploadByURL(url) {
    this.#reset();

    if (typeof url !== 'string') {
      this.#callbacks.onUploadEnded(false);
      return;
    }

    url = encodeURI(url);

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();

      const binary = new Uint8Array(arrayBuffer);
      const name = url.split('/').pop();
      const file = new File([binary], name, { type: 'application/zip' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      this.#dropzone.upload(dataTransfer.files);
    }
    catch (error) {
      this.#callbacks.onUploadEnded(false);
    }
  }

  /**
   * Upload a file for changes.
   * @param {object} params Parameters.
   * @param {File} params.file File to upload.
   * @param {object} [params.session] Session object.
   * @param {string} params.session.key Session key.
   * @param {string} params.session.value Session value.
   * @param {object[]} [params.changes] Changes to apply.
   */
  #uploadForChanges(params = {}) {
    params.changes = params.changes ?? [];

    const formData = new FormData();
    formData.append('file', params.file);
    if (params.session?.key && params.session?.value) {
      formData.append(params.session.key, params.session.value);
    }
    formData.append('sessionKeyName', this.#sessionKeyName);
    formData.set('locale', document.querySelector('.select-language')?.value ?? 'en');
    formData.set('changes', JSON.stringify(params.changes));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.#endpoint, true);
    xhr.responseType = 'arraybuffer';

    xhr.addEventListener('load', () => {
      this.#handleFileUploadedForChanges(xhr);
    });

    xhr.send(formData);
  }

  /**
   * Handle file upload via dropzone.
   * @param {object} params Parameters.
   * @param {File} params.file File to upload.
   */
  #uploadForAnalysis(params = {}) {
    this.#callbacks.onUploadStarted();

    const formData = new FormData();
    formData.append('file', params.file);
    if (params.session?.key && params.session?.value) {
      formData.append(params.session.key, params.session.value);
    }
    formData.append('sessionKeyName', this.#sessionKeyName);
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
      this.#handleFileUploadedForAnalysis(xhr);
      this.#callbacks.onUploadEnded(true);
    });

    xhr.addEventListener('error', () => {
      this.#setErrorMessage(xhr.statusText);
    });

    if (params.signal) {
      params.signal.addEventListener('abort', () => {
        xhr.abort();
        this.#callbacks.onUploadEnded(false);
      });

      if (params.signal.aborted) {
        xhr.abort();
        this.#callbacks.onUploadEnded(false);
        return;
      }
    }

    // Send the request
    xhr.send(formData);
  }

  /**
   * Handle reset.
   */
  #reset() {
    // Remove id query parameter from URL in browser bar without reloading the page
    const queryParams = new URLSearchParams(window.location.search);
    // delete everything but not `locale`
    for (const key of queryParams.keys()) {
      if (key !== DEFAULT_LOCALE_KEY) {
        queryParams.delete(key);
      }
    }

    window.history.replaceState(
      {}, document.title, `${window.location.pathname}?${queryParams.toString()}${window.location.hash}`
    );

    document.querySelector('.filter-tree').innerHTML = '';
    document.querySelector('.output').innerHTML = '';

    this.#results?.toggleDownloadButton(false);

    this.#callbacks.onReset();
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

  #handleFileUploadedForChanges(xhr) {
    const isXHROK = xhr.status >= XHR_STATUS_CODES.OK && xhr.status < XHR_STATUS_CODES.MULTIPLE_CHOICES;
    if (!isXHROK) {
      this.#setErrorMessage(xhr.status);
      return;
    }

    this.#messageSets.clearPendingState();
    this.#messageSets.makeCurrentValuesInitial();
    this.#results.toggleDownloadButton(false);

    const blob = new Blob([xhr.response], { type: 'application/zip' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'file.h5p'; // Specify the name for the downloaded file
    downloadLink.style.display = 'none';

    // Append the link to the body (not necessary for the download to work)
    document.body.appendChild(downloadLink);

    // Programmatically click the link to trigger the download
    downloadLink.click();

    // Clean up and remove the link
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url); // Free up memory
  }

  /**
   * Handle file uploaded.
   * @param {XMLHttpRequest} xhr XMLHttpRequest object.
   */
  #handleFileUploadedForAnalysis(xhr) {
    this.#dropzone.hideProgress();

    const isXHROK = xhr.status >= XHR_STATUS_CODES.OK && xhr.status < XHR_STATUS_CODES.MULTIPLE_CHOICES;

    let data, errorMessage;
    [data, errorMessage] = this.parseAnalysisResponse(xhr);

    if (!isXHROK || errorMessage) {
      this.#setErrorMessage(errorMessage);
      return;
    }

    // TODO: This is a general debug output, remove this once done
    // eslint-disable-next-line no-console
    console.log(data);

    this.#l10n = { ...this.#l10n, ...data.client.translations };

    this.#dropzone.setStatus([this.#l10n.yourFileWasCheckedSuccessfully, this.#l10n.instructions]);

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
          reset: this.#l10n.reset,
          expandList: this.#l10n.expandList,
          collapseList: this.#l10n.collapseList
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
      message.issues = (message.level === 'error' || message.level === 'caution') ? 'issues' : false;

      const path = message.details?.path;
      if (!path || !path.startsWith('images/')) {
        return message;
      }

      if (message.details?.path && message.details?.path.startsWith('images/')) {
        message.details.base64 = data.raw.media.images[path.split('/').pop()]?.base64;
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
          downloadEditedH5P: this.#l10n.downloadEditedH5P,
          changeSortingGrouping: this.#l10n.changeSortingGrouping
        }
      },
      {
        onResultsTypeChanged: (id) => {
          this.#messageSets.show(id);
        },
        onDownload: () => {
          const uploadParams = {
            file: this.#dropzone.getFile()
          };

          if (this.#sessionKeyName && this.#sessionKeyValue) {
            uploadParams.session = {
              key: this.#sessionKeyName,
              value: this.#sessionKeyValue,
            };
          }

          uploadParams.changes = this.#messageSets.getEdits().flat();
          this.#uploadForChanges(uploadParams);
        }
      }
    );
    document.querySelector('.output').append(this.#results.getDOM());

    const categoryNames = [...new Set(data.messages.map((message) => message.category))];

    this.#messageSets = new MessageSets(
      {
        sets: {
          level: ['error', 'caution', 'info'],
          category: categoryNames,
          issues: [{ id: 'issues', header: this.#l10n.issues }], // Custom filter option
        },
        messages: data.messages,
        translations: data.client.translations,
        l10n: {
          allFilteredOut: this.#l10n.allFilteredOut,
          nextMessage: this.#l10n.nextMessage,
          previousMessage: this.#l10n.previousMessage,
          showDetails: this.#l10n.showDetails,
          hideDetails: this.#l10n.hideDetails
        }
      },
      {
        onFieldEdit: () => {
          const hasEdits = this.#messageSets.getEdits().length > 0;
          this.#results.toggleDownloadButton(hasEdits);
        }
      }
    );
    document.querySelector('.output').append(this.#messageSets.getDOM());
  }

  parseAnalysisResponse(xhr) {
    let data;
    let errorMessage = null;

    try {
      data = JSON.parse(xhr.responseText);
    }
    catch (error) {
      data = false;
      errorMessage = this.#handleNonJsonResponse(xhr.responseText);
    }

    if (data.error) {
      errorMessage = data.error;
    }

    return [data, errorMessage];
  }

  /**
   * Clean non-JSON response.
   * @param {string} responseText Response text.
   * @returns {string} Cleaned response text.
   */
  #handleNonJsonResponse(responseText) {
    // If HTML is present, it's likely a server error with formatting that might give away sensitive information
    if (!responseText || containsHtmlTags(responseText)) {
      return `${this.#l10n.unknownError} ${this.#l10n.checkServerLog}`;
    }

    return responseText;
  }

  /**
   * Compute the results.
   * @param {object[]} messages Messages received from the server.
   * @returns {object} Results.
   */
  #computeResults(messages) {
    const typeItems = [
      {
        id: 'error',
        value: messages.filter((message) => message.level === 'error').length,
        max: messages.length,
        label: capitalize(this.#l10n.error),
        link: '#error',
        color: 'var(--color-error)',
        percentage: false
      },
      {
        id: 'caution',
        value: messages.filter((message) => message.level === 'caution').length,
        max: messages.length,
        label: capitalize(this.#l10n.caution),
        link: '#caution',
        color: 'var(--color-caution)',
        percentage: false
      },
      {
        id: 'info',
        value: messages.filter((message) => message.level === 'info').length,
        max: messages.length,
        label: capitalize(this.#l10n.info),
        link: '#info',
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

    // This way filtering would be possible, but not needed for now
    // const issueItems = [{
    //   id: 'issues',
    //   value: messages.filter((message) => message.issues).length,
    //   max: messages.length,
    //   label: capitalize(this.#l10n.issues),
    //   link: '#issues',
    //   color: 'status',
    //   percentage: false
    // }];

    return {
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
      },
      // This way filtering would be possible, but not needed for now
      // issues: {
      //   label: this.#l10n.issues,
      //   header: this.#l10n.totalMessages,
      //   value: messages.length,
      //   items: issueItems,
      //   type: 'filter'
      // }
    };
  }

  /**
   * Set error message.
   * @param {string} message Message to display.
   */
  #setErrorMessage(message) {
    this.#dropzone.setStatus(message, 'error');

    this.#callbacks.onUploadEnded(false);
  }
}

window.H5PCaretaker = H5PCaretaker;
// new H5PCaretaker();

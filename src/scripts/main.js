import { capitalize } from '@services/util.js';
import { Dropzone } from '@components/dropzone/dropzone.js';
import { Results } from '@components/results/results.js';
import { MessageSets } from '@components/message-sets/message-sets.js';
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
  yourFileIsBeingChecked: 'Your file is being checked', // Dropzone: file is being checked
  yourFileWasCheckedSuccessfully: 'Your file was checked successfully', // Dropzone: file was checked successfully
  totalMessages: 'Total messages', // Results: total messages
  groupBy: 'Group by', // Results: group by
  download: 'Download', // Results: download
  expandAllMessages: 'Expand all messages', // MessageAccordion: expand all messages
  collapseAllMessages: 'Collapse all messages', // MessageAccordion: collapse all messages
};

/** @constant {object} XHR status codes */
const XHR_STATUS_CODES = {
  OK: 200,
  MULTIPLE_CHOICES: 300
};

class Main {

  #dropzone;
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

      data.messages = data.messages.map((message) => {
        // TODO: Media should be optional in messages? Add a parameter to the constructor?
        const path = message.details?.path;
        if (!path || !path.startsWith('images/')) {
          return message;
        }

        if (message.details?.path && message.details?.path.startsWith('images/')) {
          message.details.base64 = data.raw.media.images[path.split('/').pop()].base64;
        }

        return message;
      });

      const typeItems = [
        {
          value: data.messages.filter((message) => message.level === 'error').length,
          max: data.messages.length,
          label: capitalize(this.#l10n.errors),
          color: 'var(--color-error)',
          percentage: false
        },
        {
          value: data.messages.filter((message) => message.level === 'warning').length,
          max: data.messages.length,
          label: capitalize(this.#l10n.warnings),
          color: 'var(--color-warning)',
          percentage: false
        },
        {
          value: data.messages.filter((message) => message.level === 'info').length,
          max: data.messages.length,
          label: capitalize(this.#l10n.infos),
          color: 'var(--color-info)',
          percentage: false
        }
      ];

      const categoryNames = [...new Set(data.messages.map((message) => message.category))];
      const categoryItems = categoryNames.map((category) => {
        return {
          value: data.messages.filter((message) => message.category === category).length,
          max: data.messages.length,
          label: capitalize(this.#l10n[category]),
          color: 'var(--color-primary)',
          percentage: false
        };
      });

      const resultsData = {
        level: {
          label: this.#l10n.level,
          header:this.#l10n.totalMessages,
          value: data.messages.length,
          items: typeItems
        },
        category: {
          label: this.#l10n.category,
          header: this.#l10n.totalMessages,
          value: data.messages.length,
          items: categoryItems
        }
      };

      const results = new Results(
        {
          results: resultsData,
          l10n: {
            groupBy: this.#l10n.groupBy,
            download: this.#l10n.download
          }
        },
        {
          onGroupingChanged: (id) => {
            messageSets.show(id);
          }
        }
      );
      document.querySelector('.output').append(results.getDOM());

      const messageSets = new MessageSets({
        sets: {
          level: ['error', 'warning', 'info'],
          category: categoryNames
        },
        messages: data.messages,
        translations: data.client.translations,
        l10n: {
          expandAllMessages: this.#l10n.expandAllMessages,
          collapseAllMessages: this.#l10n.collapseAllMessages
        }
      });
      document.querySelector('.output').append(messageSets.getDOM());
    }
    else {
      this.#setErrorMessage(xhr.responseText);
    }
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

import { Dropzone } from './components/dropzone.js';
import { MessageAccordion } from './components/message-accordion.js';

/** @constant {string} DEFAULT_UPLOAD_ENDPOINT Default upload endpoint. */
const DEFAULT_UPLOAD_ENDPOINT = './upload';

/** @constant {string} DEFAULT_LOCALE_KEY Default locale key for GET parameters. */
const DEFAULT_LOCALE_KEY = 'locale';

/** @constant {object} DEFAULT_L10N Default localization. */
const DEFAULT_L10N = {
  orDragTheFileHere: 'or drag the file here',
  removeFile: 'Remove file',
  selectYourLanguage: 'Select your language',
  uploadProgress: 'Upload progress',
  uploadYourH5Pfile: 'Upload your H5P file',
  yourFileIsBeingChecked: 'Your file is being checked',
  yourFileWasCheckedSuccessfully: 'Your file was checked successfully'
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

      this.#dropzone.setStatus(this.#l10n.yourFileWasCheckedSuccessfully);

      ['error', 'warning', 'info'].forEach((type) => {
        const messages = data.messages
          .filter((message) => message.level === type)
          .map((message) => {
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

        if (messages.length) {
          const accordion = new MessageAccordion({
            type: type,
            messages: messages,
            translations: data.client.translations
          });
          document.querySelector('.output').append(accordion.getDOM());
        }
      });

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

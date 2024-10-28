import { Dropzone } from './dropzone.js';

/** @constant {string} DEFAULT_UPLOAD_ENDPOINT Default upload endpoint. */
const DEFAULT_UPLOAD_ENDPOINT = './upload';

class Main {

  #dropzone;
  #endpoint;

  /**
   * @constructor
   */
  constructor() {
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
    this.#dropzone = new Dropzone(
      {
        selectorDropzone: '.h5p-caretaker .dropzone'
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
   * Update the progress of the upload.
   * @param {number} percentage Percentage of the upload.
   */
  #updateProgress(percentage) {
    this.#dropzone.setProgress(percentage);

    if (percentage === 100) {
      this.#dropzone.hideProgress();
      this.#dropzone.setStatus('Your file is being checked', 'pulse');
    }
  }

  /**
   * Handle file uploaded.
   * @param {XMLHttpRequest} xhr XMLHttpRequest object.
   */
  #handleFileUploaded(xhr) {
    this.#dropzone.hideProgress();
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);

      this.#dropzone.setStatus('Your file was checked successfully');

      console.log(data);
      const output = this.#createOutput(data);
      document.querySelector('.output').innerHTML = '';
      document.querySelector('.output').append(output);
    } else {
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

  /*
   * Just a hack from the proof-of-concept. Will be replaced with a proper implementation.
   */
  #createOutput(data) {
    const output = document.createElement('div');

    data.client = data.client ?? {};
    data.client.translations = data.client.translations ?? {};

    if (data.messages) {
      const list = document.createElement('ul');
      list.classList.add('messages');

      data.messages.forEach((message) => {
        const li = document.createElement('li');

        const summary = document.createElement('p');
        summary.classList.add('summary');
        summary.innerText = message.summary ?? 'No summary';
        li.appendChild(summary);

        if (message.description) {
          const description = document.createElement('p');
          description.innerText = message.description;
          li.appendChild(description);
        }

        if (message.recommendation) {
          const recommendation = document.createElement('p');
          recommendation.classList.add('recommendation', 'capitalize');
          recommendation.innerText =
            `${data.client.translations.recommendation ?? 'recommendation'}: ${message.recommendation}`;
          li.appendChild(recommendation);
        }

        const category = document.createElement('p');
        category.classList.add('capitalize');
        category.innerText =
          `${data.client.translations.category ?? 'category'}: ${data.client.translations[message.category] ?? message.category}`;
        li.appendChild(category);

        const type = document.createElement('p');
        type.classList.add('capitalize');
        type.innerText = `${data.client.translations.type ?? 'type'}: ${data.client.translations[message.type] ?? message.type}`;
        li.appendChild(type);

        if (message.level) {
          li.classList.add(message.level);
        }

        const level = document.createElement('p');
        level.classList.add('capitalize');
        level.innerText = `${data.client.translations.level ?? 'level'}: ${data.client.translations[message.level] ?? message.level}`;
        li.appendChild(level);

        const details = document.createElement('ul');
        Object.keys(message.details ?? {}).forEach((key) => {
          const detail = document.createElement('li');
          if (key === 'base64') {
            const img = document.createElement('img');
            img.src = message.details[key];
            detail.appendChild(img);
          }
          if (key === 'reference') {
            detail.classList.add('capitalize');
            detail.innerHTML = `${data.client.translations[key] ?? key}: <a href="${message.details[key]}" target="_blank">${message.details[key]}</a>`;
          }
          else {
            detail.classList.add('capitalize');
            detail.innerHTML = `${data.client.translations[key] ?? key}: ${message.details[key]}`;
          }
          details.appendChild(detail);
        });
        li.appendChild(details);
        list.appendChild(li);
      });
      output.appendChild(list);
    }

    return output;
  };
}

new Main();

import { Progressbar } from './progressbar.js';

export class Dropzone {

  // State
  #isUploadDisabled = false;

  // Params
  #params;
  #callbacks;

  // DOM elements
  #dropzone;
  #uploadWrapper;
  #fileInput;
  #fileInfo;
  #fileName;
  #fileValue;

  // Classes
  #progressbar;

  /**
   * @constructor
   * @param {object} params Parameters for the dropzone.
   * @param {string} params.selectorDropzone CSS selector for the dropzone.
   * @param {object} callbacks Callbacks for the dropzone.
   * @param {Function} callbacks.upload Callback for the upload event.
   * @param {Function} callbacks.reset Callback for the reset event.
   */
  constructor(params = {}, callbacks = {}) {
    this.#params = params;
    if (!this.#params.selectorDropzone) {
      return;
    }

    this.#callbacks = callbacks ?? {};
    this.#callbacks.upload = this.#callbacks.upload ?? (() => {});
    this.#callbacks.reset = this.#callbacks.reset ?? (() => {});

    this.#buildDOM();
  }

  /**
   * Build dropzone DOM.
   */
  #buildDOM() {
    this.#dropzone = document.querySelector(this.#params.selectorDropzone);
    if (!this.#dropzone) {
      return;
    }

    this.#dropzone.innerHTML = '';
    this.#dropzone.addEventListener('click',  (event) => {
      this.#handleClick(event);
    });
    this.#dropzone.addEventListener('dragover', (event) => {
      this.#handleDragOver(event);
    });
    this.#dropzone.addEventListener('dragleave', () => {
      this.#handleDragLeave();
    });
    this.#dropzone.addEventListener('drop', (event) => {
      this.#handleDrop(event);
    });

    this.#uploadWrapper = document.createElement('div');
    this.#uploadWrapper.classList.add('upload-wrapper');

    this.#fileInput = document.createElement('input');
    this.#fileInput.classList.add('file-input');
    this.#fileInput.id = 'file-input';
    this.#fileInput.type = 'file';
    this.#fileInput.accept = '.h5p';
    this.#fileInput.addEventListener('change', (event) => {
      this.#handleFileChange(event);
    });
    this.#uploadWrapper.append(this.#fileInput);

    const fileInputLabel = document.createElement('label');
    fileInputLabel.classList.add('upload-button');
    fileInputLabel.htmlFor = 'file-input';
    fileInputLabel.innerText = 'Upload your H5P file';
    this.#uploadWrapper.append(fileInputLabel);

    this.#dropzone.append(this.#uploadWrapper);

    this.#fileInfo = document.createElement('div');
    this.#fileInfo.classList.add('file-info');
    this.#fileInfo.classList.add('display-none');

    const fileData = document.createElement('div');
    fileData.classList.add('file-data');
    this.#fileInfo.append(fileData);

    this.#fileName = document.createElement('div');
    this.#fileName.classList.add('file-name');
    fileData.append(this.#fileName);

    this.#fileValue = document.createElement('div');
    this.#fileValue.classList.add('file-value');
    fileData.append(this.#fileValue);

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-button');
    removeButton.setAttribute('aria-label', 'Remove file');
    removeButton.addEventListener('click', () => {
      this.reset();
    });
    this.#fileInfo.append(removeButton);

    this.#dropzone.append(this.#fileInfo);

    this.#progressbar = new Progressbar();
    this.hideProgress();
    this.#dropzone.append(this.#progressbar.getDOM());

    this.status = document.createElement('p');
    this.status.classList.add('status');
    this.status.innerText = 'or drag the file here';
    this.#dropzone.append(this.status);
  }

  /**
   * Set file.
   * @param {File} file File to set.
   */
  #setFile(file = {}) {
    if (!file.name) {
      return;
    }

    this.#disableUpload();

    this.#fileName.innerText = file.name;

    if (file.size) {
      this.#fileValue.innerText = `${(file.size / 1024).toFixed(2)} KB`;
    }

    this.#uploadWrapper.classList.add('display-none');
    this.#fileInfo.classList.remove('display-none');
  }

  /**
   * Enable upload.
   */
  #enableUpload() {
    this.#isUploadDisabled = false;
    this.#dropzone.removeAttribute('disabled');
  }

  /**
   * Disable upload.
   */
  #disableUpload() {
    this.#isUploadDisabled = true;
    this.#dropzone.setAttribute('disabled', 'disabled');
  }

  /**
   * Reset dropzone.
   */
  reset() {
    this.#fileInfo.classList.add('display-none');
    this.#uploadWrapper.classList.remove('display-none');

    this.setStatus('or drag the file here')

    this.#enableUpload();
    this.#callbacks.reset();
  }

  /**
   * Set status message.
   * @param {string} status Status message.
   * @param {string} className Class name for the status message.
   */
  setStatus(status = '', className = '') {
    this.status.classList.toggle('display-none', !status);
    this.status.classList.toggle('error', className === 'error');
    this.status.classList.toggle('pulse', className === 'pulse');
    this.status.innerText = status;
  }

  /**
   * Show progress bar.
   */
  showProgress() {
    this.#progressbar.show();
  }

  /**
   * Hide progress bar.
   */
  hideProgress() {
    this.#progressbar.hide();
  }

  /**
   * Set progress of the progress bar.
   * @param {number} progress Progress of the progress bar in percentage.
   */
  setProgress(progress) {
    this.#progressbar.setProgress(progress);
  }

  /**
   * Handle click event on dropzone.
   * @param {MouseEvent} event Click event.
   */
  #handleClick(event) {
    if (this.#isUploadDisabled) {
      return;
    }

    if (event.target !== this.#dropzone) {
      return; // Ignore clicks on children
    }

    this.#fileInput.click();
    this.#dropzone.classList.add('active');
  }

  /**
   * Handle drag over event on dropzone.
   * @param {DragEvent} event Drag event.
   */
  #handleDragOver(event) {
    event?.preventDefault();
    this.#dropzone.classList.add('dragging');
  }

  /**
   * Handle drag leave event on dropzone.
   */
  #handleDragLeave() {
    this.#dropzone.classList.remove('dragging');
  }

  /**
   * Handle file dropped on dropzone.
   * @param {DragEvent} event Drag event.
   */
  #handleDrop(event) {
    event.preventDefault();
    if (!event?.dataTransfer.files.length) {
      return;
    }

    this.#dropzone.classList.remove('dragging');
    this.#fileInput.files = event.dataTransfer.files;
    this.#upload(this.#fileInput.files[0]);
  }

  /**
   * Handle file change event on file input.
   * @param {Event} event Change event.
   */
  #handleFileChange(event) {
    this.#upload(event.target.files[0]);
  }

  /**
   * Upload file.
   * @param {File} file
   */
  #upload(file) {
    if (!file) {
      return;
    }

    this.#setFile(file);
    this.#fileInput.value = '';

    this.#dropzone.classList.remove('active');
    this.#callbacks.upload(file);
  }
}

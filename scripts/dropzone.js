import { Progressbar } from './progressbar.js';

export class Dropzone {

  #isUploadDisabled = false;

  constructor(params = {}, callbacks = {}) {
    this.params = params ?? {};
    this.params.selectorDropzone = this.params.selectorDropzone ?? '';

    if (this.params.selectorDropzone === '') {
      return;
    }

    this.callbacks = callbacks ?? {};
    this.callbacks.upload = this.callbacks.upload ?? (() => {});
    this.callbacks.reset = this.callbacks.reset ?? (() => {});

    this.dropzone = document.querySelector(this.params.selectorDropzone);
    if (!this.dropzone) {
      return;
    }

    this.#buildDOM();
    this.#addEventListeners();
  }

  #buildDOM() {
    this.dropzone.innerHTML = '';

    this.uploadWrapper = document.createElement('div');
    this.uploadWrapper.classList.add('upload-wrapper');

    this.fileInput = document.createElement('input');
    this.fileInput.classList.add('file-input');
    this.fileInput.id = 'file-input';
    this.fileInput.type = 'file';
    this.fileInput.accept = '.h5p';
    this.uploadWrapper.append(this.fileInput);

    this.fileInputLabel = document.createElement('label');
    this.fileInputLabel.classList.add('upload-button');
    this.fileInputLabel.htmlFor = 'file-input';
    this.fileInputLabel.innerText = 'Upload your H5P file';
    this.uploadWrapper.append(this.fileInputLabel);

    this.dropzone.append(this.uploadWrapper);

    this.fileInfo = document.createElement('div');
    this.fileInfo.classList.add('file-info');
    this.fileInfo.classList.add('display-none');

    const fileData = document.createElement('div');
    fileData.classList.add('file-data');
    this.fileInfo.append(fileData);

    this.fileName = document.createElement('div');
    this.fileName.classList.add('file-name');
    fileData.append(this.fileName);

    this.fileValue = document.createElement('div');
    this.fileValue.classList.add('file-value');
    fileData.append(this.fileValue);

    this.removeButton = document.createElement('button');
    this.removeButton.classList.add('remove-button');
    this.removeButton.setAttribute('aria-label', 'Remove file');
    this.fileInfo.append(this.removeButton);

    this.dropzone.append(this.fileInfo);

    this.progressbar = new Progressbar();
    this.hideProgress();
    this.dropzone.append(this.progressbar.getDOM());

    this.status = document.createElement('p');
    this.status.classList.add('status');
    this.status.innerText = 'or drag the file here';
    this.dropzone.append(this.status);
  }

  #addEventListeners() {
    this.dropzone.addEventListener('click',  (event) => {
      this.#handleClick(event);
    });

    this.dropzone.addEventListener('dragover', (event) => {
      this.#handleDragOver(event);
    });

    this.dropzone.addEventListener('dragleave', () => {
      this.#handleDragLeave();
    });

    this.dropzone.addEventListener('drop', (event) => {
      this.#handleDrop(event);
    });

    this.fileInput.addEventListener('change', (event) => {
      this.#handleFileChange(event);
    });

    this.removeButton.addEventListener('click', () => {
      this.reset();
    });
  }

  #setFile(file = {}) {
    if (!file.name) {
      return;
    }

    this.#disableUpload();

    this.fileName.innerText = file.name;

    if (file.size) {
      this.fileValue.innerText = `${(file.size / 1024).toFixed(2)} KB`;
    }

    this.uploadWrapper.classList.add('display-none');
    this.fileInfo.classList.remove('display-none');
  }

  #enableUpload() {
    this.#isUploadDisabled = false;
    this.dropzone.removeAttribute('disabled');
  }

  #disableUpload() {
    this.#isUploadDisabled = true;
    this.dropzone.setAttribute('disabled', 'disabled');
  }

  reset() {
    this.fileInfo.classList.add('display-none');
    this.uploadWrapper.classList.remove('display-none');

    this.setStatus('or drag the file here')

    this.#enableUpload();
    this.callbacks.reset();
  }

  setStatus(status, isError = false) {
    this.status.classList.toggle('display-none', !status);
    this.status.innerText = status;
    this.status.classList.toggle('error', isError);
  }

  showProgress() {
    this.progressbar.show();
  }

  hideProgress() {
    this.progressbar.hide();
  }

  setProgress(progress) {
    this.progressbar.setProgress(progress);
  }

  #handleClick(event) {
    if (this.#isUploadDisabled) {
      return;
    }

    if (event.target !== this.dropzone) {
      return;
    }

    this.fileInput.click();
    this.dropzone.classList.add('active');
  }

  #handleDragOver(event) {
    event?.preventDefault();
    this.dropzone.classList.add('dragging');
  }

  #handleDragLeave() {
    this.dropzone.classList.remove('dragging');
  }

  #handleDrop(event) {
    event.preventDefault();
    if (!event?.dataTransfer.files.length) {
      return;
    }

    this.dropzone.classList.remove('dragging');
    this.fileInput.files = event.dataTransfer.files;
    this.#upload(this.fileInput.files[0]);
  }

  #handleFileChange(event) {
    this.#upload(event.target.files[0]);
  }

  #upload(file) {
    if (!file) {
      return;
    }
    this.#setFile(file);
    this.fileInput.value = '';

    this.dropzone.classList.remove('active');
    this.callbacks.upload(file);
  }
}

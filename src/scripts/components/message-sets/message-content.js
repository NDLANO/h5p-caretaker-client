export class MessageContent {
  #dom;
  #subContentId;
  #params;
  #detailsButton;
  #details;

  /**
   * @class MessageContent
   * @param {object} params Parameters for the message content.
   * @param {object} params.message Message object.
   * @param {object} params.translations Translations object.
   */
  constructor(params = {}) {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-content');

    this.#subContentId = params.message.subContentId;

    // Prevent changing the original object
    this.#params = JSON.parse(JSON.stringify(params));

    if (this.#params.message.description) {
      const descriptionItem = document.createElement('div');
      descriptionItem.classList.add('message-content-item');

      const descriptionItemLabel = document.createElement('p');
      descriptionItemLabel.classList.add('message-content-item-label');
      descriptionItemLabel.innerText = this.#params.translations.description;
      descriptionItem.append(descriptionItemLabel);

      const descriptionItemText = document.createElement('p');
      descriptionItemText.classList.add('message-content-item-text');
      descriptionItemText.innerText = this.#params.message.description;
      descriptionItem.append(descriptionItemText);

      this.#dom.append(descriptionItem);
    }

    if (this.#params.message.category) {
      const categoryItem = document.createElement('div');
      categoryItem.classList.add('message-content-item');

      const categoryItemLabel = document.createElement('p');
      categoryItemLabel.classList.add('message-content-item-label');
      categoryItemLabel.innerText = this.#params.translations.category;
      categoryItem.append(categoryItemLabel);

      const categoryType = document.createElement('p');
      categoryType.classList.add('message-content-item-text');
      let categoryTypeText = this.#params.translations[this.#params.message.category];
      if (this.#params.message.type) {
        categoryTypeText = `${categoryTypeText} > ${this.#params.translations[this.#params.message.type]}`;
      }
      categoryType.innerText = categoryTypeText;
      categoryItem.append(categoryType);

      this.#dom.append(categoryItem);
    }

    if (this.#params.message.recommendation) {
      const recommendationItem = document.createElement('div');
      recommendationItem.classList.add('message-content-item');

      const recommendationItemLabel = document.createElement('p');
      recommendationItemLabel.classList.add('message-content-item-label');
      recommendationItemLabel.innerText = this.#params.translations.recommendation;
      recommendationItem.append(recommendationItemLabel);

      const recommendationItemText = document.createElement('p');
      recommendationItemText.classList.add('message-content-item-text');
      recommendationItemText.innerText = this.#params.message.recommendation;
      recommendationItem.append(recommendationItemText);

      this.#dom.append(recommendationItem);
    }

    if (this.#params.message.type === 'libreText') {
      const status = `<h3>${this.#params.translations.status}</h3><p>${this.#params.message.details.status}</p>`;
      this.#params.message.details.description = `${this.#params.message.details.description}${status}`;
      const licenseNote =
        `<h3>${this.#params.translations.licenseNote}</h3><p>${this.#params.message.details.licenseNote}</p>`;
      this.#params.message.details.description = `${this.#params.message.details.description}${licenseNote}`;

      const items = this.#parseLibreTextToArray(this.#params.message.details.description);
      items.forEach((item) => {
        const detailsItem = document.createElement('div');
        detailsItem.classList.add('message-content-item');

        const detailsItemLabel = document.createElement('p');
        detailsItemLabel.classList.add('message-content-item-label');
        detailsItemLabel.innerText = item.headline;
        detailsItem.append(detailsItemLabel);

        const details = document.createElement('div');
        details.classList.add('message-content-details');
        details.innerHTML = item.html;
        detailsItem.append(details);

        this.#dom.append(detailsItem);
      });
    }

    if (this.#params.message.details?.base64) {
      const detailsItem = document.createElement('div');
      detailsItem.classList.add('message-content-item');

      const detailsItemLabel = document.createElement('p');
      detailsItemLabel.classList.add('message-content-item-label');
      detailsItemLabel.innerText = this.#params.translations.image;
      detailsItem.append(detailsItemLabel);

      const base64 = document.createElement('img');
      base64.classList.add('message-content-image');
      base64.src = this.#params.message.details.base64;
      detailsItem.append(base64);

      this.#dom.append(detailsItem);
    }

    if (this.#params.message.type !== 'libreText' && this.#params.message.details) {
      const detailsItem = document.createElement('div');
      detailsItem.classList.add('message-content-item');

      this.#detailsButton = document.createElement('button');
      this.#detailsButton.classList.add('message-content-details-button');
      this.#detailsButton.addEventListener('click', (event) => {
        this.#handleDetailsButtonClick(event);
      });

      detailsItem.append(this.#detailsButton);

      this.#details = document.createElement('ul');
      this.#details.classList.add('message-content-details');
      this.#details.classList.add('display-none');

      Object.keys(this.#params.message.details).forEach((key) => {
        if (key === 'reference' || key === 'base64') {
          return; // Will be handled separately
        }

        const detail = document.createElement('li');
        detail.classList.add('message-content-detail');
        detail.innerText = `${key}: ${this.#params.message.details[key]}`;
        this.#details.append(detail);
      });
      detailsItem.append(this.#details);

      this.#toggleDetailsVisibility(false);

      this.#dom.append(detailsItem);
    }

    if (this.#params.message.details?.reference) {
      const reference = document.createElement('a');
      reference.classList.add('message-content-reference');
      reference.href = this.#params.message.details.reference;
      reference.target = '_blank';
      reference.innerText = this.#params.translations.learnMore;
      this.#dom.append(reference);
    }
  }

  /**
   * Get the DOM element of the message content.
   * @returns {HTMLElement} The DOM element of the message content.
   */
  getDOM() {
    return this.#dom;
  }

  /**
   * Get subContentId.
   * @returns {string|undefined} Subcontent id.
   */
  getSubContentId() {
    return this.#subContentId;
  }

  /**
   * Handle click on details button.
   * @param {MouseEvent} event Mouse event.
   */
  #handleDetailsButtonClick(event) {
    event.stopPropagation();
    this.#toggleDetailsVisibility();
  }

  /**
   * Toggle visibility of details.
   * @param {boolean} [isVisible] State to set visibility to.
   */
  #toggleDetailsVisibility(isVisible) {
    isVisible =
      !this.#details.classList.toggle('display-none', typeof isVisible === 'boolean' ? !isVisible : undefined);

    this.#detailsButton.innerText = isVisible ? this.#params.l10n.hideDetails : this.#params.l10n.showDetails;
  }

  /**
   * Parse LibreText HTML to an array of objects that can be handled further.
   * TODO: LibreText should change their output. And: Move this to server?
   * @param {string} inputHTML Input HTML to parse.
   * @returns {object[]} Array of objects with headline and HTML content.
   */
  #parseLibreTextToArray(inputHTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(inputHTML, 'text/html');

    const headings = doc.querySelectorAll('h2, h3, h4, h5, h6');
    const result = [];

    headings.forEach((heading, index) => {
      const headline = heading.textContent.trim();

      let htmlContent = '';
      let nextSibling = heading.nextElementSibling;

      while (nextSibling && !nextSibling.matches('h2, h3, h4, h5, h6')) {
        htmlContent += nextSibling.outerHTML;
        nextSibling = nextSibling.nextElementSibling;
      }

      result.push({ headline, html: htmlContent.trim() });
    });

    return result;
  }
}

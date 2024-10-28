export class MessageContent {
  #dom;

  /**
   * @constructor
   * @param {object} params Parameters for the message content.
   * @param {object} params.message Message object.
   * @param {object} params.translations Translations object.
   */
  constructor(params = {}) {
    this.#dom = document.createElement('div');
    this.#dom.classList.add('message-content');

    if (params.message.category) {
      const categoryItem = document.createElement('div');
      categoryItem.classList.add('message-content-item');

      const categoryItemLabel = document.createElement('p');
      categoryItemLabel.classList.add('message-content-item-label');
      categoryItemLabel.innerText = params.translations.category;
      categoryItem.append(categoryItemLabel);

      const categoryType = document.createElement('p');
      categoryType.classList.add('message-content-item-text');
      let categoryTypeText = params.translations[params.message.category];
      if (params.message.type) {
        categoryTypeText = `${categoryTypeText} > ${params.translations[params.message.type]}`;
      }
      categoryType.innerText = categoryTypeText;
      categoryItem.append(categoryType);

      this.#dom.append(categoryItem);
    }

    if (params.message.recommendation) {
      const recommendationItem = document.createElement('div');
      recommendationItem.classList.add('message-content-item');

      const recommendationItemLabel = document.createElement('p');
      recommendationItemLabel.classList.add('message-content-item-label');
      recommendationItemLabel.innerText = params.translations.recommendation;
      recommendationItem.append(recommendationItemLabel);

      const recommendationItemText = document.createElement('p');
      recommendationItemText.classList.add('message-content-item-text');
      recommendationItemText.innerText = params.message.recommendation;
      recommendationItem.append(recommendationItemText);

      this.#dom.append(recommendationItem);
    }

    if (params.message.type === 'libreText') {
      const status = `<h3>Status</h3><p>${params.message.details.status}</p>`;
      params.message.details.description = `${params.message.details.description}${status}`;

      const items = this.#parseLibreTextToArray(params.message.details.description);
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
    else if (params.message.details) {
      const detailsItem = document.createElement('div');
      detailsItem.classList.add('message-content-item');

      const detailsItemLabel = document.createElement('p');
      detailsItemLabel.classList.add('message-content-item-label');
      detailsItemLabel.innerText = params.translations.details;
      detailsItem.append(detailsItemLabel);

      const details = document.createElement('ul');
      details.classList.add('message-content-details');

      Object.keys(params.message.details).forEach((key) => {
        if (key === 'reference' || key === 'base64') {
          return; // Will be handled separately
        }

        const detail = document.createElement('li');
        detail.classList.add('message-content-detail');
        detail.innerText = `${key}: ${params.message.details[key]}`;
        details.append(detail);
      });
      detailsItem.append(details);

      this.#dom.append(detailsItem);
    }

    if (params.message.details?.base64) {
      const detailsItem = document.createElement('div');
      detailsItem.classList.add('message-content-item');

      const detailsItemLabel = document.createElement('p');
      detailsItemLabel.classList.add('message-content-item-label');
      detailsItemLabel.innerText = params.translations.image;
      detailsItem.append(detailsItemLabel);

      const base64 = document.createElement('img');
      base64.classList.add('message-content-image');
      base64.src = params.message.details.base64;
      detailsItem.append(base64);

      this.#dom.append(detailsItem);
    }

    if (params.message.details?.reference) {
      const reference = document.createElement('a');
      reference.classList.add('message-content-reference');
      reference.href = params.message.details.reference;
      reference.target = '_blank';
      reference.innerText = params.translations.learnMore
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

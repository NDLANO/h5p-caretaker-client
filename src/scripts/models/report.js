import { capitalize } from '@services/util.js';

export class Report {
  #messages;
  #l10n;
  #translations;
  #title;

  /**
   * @class Report
   * @param {object} params Parameters for the report.
   * @param {Array} params.messages Messages.
   * @param {object} params.l10n Localization.
   * @param {object} params.translations Translations.
   * @param {string} params.title Title of the report.
   */
  constructor(params = {}) {
    this.#messages = params.messages;
    this.#l10n = params.l10n;
    this.#translations = params.translations;
    this.#title = params.title;
  }

  /**
   * Get the report.
   * @param {object} [params] Parameters.
   * @param {string} [params.type] Type of report to download. Default is 'markdown'.
   * @returns {string} Report.
   */
  get(params = {}) {
    params.type = params.type ?? 'markdown';

    if (params.type === 'markdown') {
      return this.#getMarkdown();
    }

    return '';
  }

  /**
   * Download the report.
   * @param {object} [params] Parameters.
   * @param {string} [params.type] Type of report to download. Default is 'markdown'.
   */
  download(params = {}) {
    params.type = params.type ?? 'markdown';

    const anchor = document.createElement('a');

    if (params.type === 'markdown') {
      anchor.href = `data:text/plain;charset=utf-8,${encodeURIComponent(this.#getMarkdown())}`;
      if (typeof params.filename === 'string' && params.filename.length > 0) {
        anchor.download = params.filename;
      }
      else {
        const dateString = (new Date()).toISOString().split('.')[0].replace(/[-T:]/g, '');
        anchor.download = `h5p-caretaker-report-${dateString}.md`;
      }
    }
    else {
      return;
    }

    anchor.style.display = 'none';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  }

  /**
   * Get the report in markdown format.
   * @returns {string} Report in markdown format.
   */
  #getMarkdown() {
    let markdown = `# ${this.#title}\n\n`;

    const report = ['error', 'warning', 'info']
      .filter((level) => this.#messages.some((message) => message.level === level))
      .map((level) => {
        return {
          headline: capitalize(this.#translations[level]),
          messages: this.#messages.filter((message) => message.level === level),
        };
      })
      .reduce((markdown, levelData) => {
        const headline = `## ${levelData.headline}\n\n`;
        const messages = levelData.messages.map((message) => {
          return this.#generateMessageTextMarkdown(message);
        }).join('\n');

        return `${markdown}${headline}${messages}\n\n`;
      }, '');

    return `${markdown}${report}`;
  }

  /**
   * Generate text for a message in markdown format.
   * @param {object} message Message object.
   * @returns {string} Message text in markdown format.
   */
  #generateMessageTextMarkdown(message) {
    let text = `### ${message.summary}\n\n`;

    // eslint-disable-next-line max-len
    const category = `#### ${capitalize(this.#translations.category)}\n${this.#translations[message.category]} > ${this.#translations[message.type]}\n`;
    text = `${text}${category}\n`;

    if (message.recommendation) {
      const recommendation = `#### ${capitalize(this.#translations.recommendation)}\n${message.recommendation}\n`;
      text = `${text}${recommendation}\n`;
    }

    if (message.details) {
      let details = `#### ${capitalize(this.#translations.details)}\n`;

      for (const key in message.details) {
        if (key === 'base64') {
          continue; // Don't show base64 data in markdown.
        }

        if (message.type === 'libreText' && key === 'description') {
          details = `${details}* ${this.#translations[key]}: ${this.#libreTextToPlain(message.details[key])}\n`;
          continue;
        }
        details = `${details}* ${key}: ${message.details[key]}\n`;
      }

      text = `${text}${details}`;
    }

    return text;
  }

  /**
   * Quick and dirty function to convert LibreText HTML to plain text.
   * @param {string} html LibreText HTML.
   * @returns {string} Plain text.
   */
  #libreTextToPlain(html) {
    html = html
      .replace(/<\/h[1-6]>/g, ': ')
      .replace(/<\/li>\n*<\/ul>/g, ' ')
      .replace(/<\/li>/g, ', ')
      .replace(/\r?\n|\r/g, ' ');

    const temp = document.createElement('div');
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ');
  }
}

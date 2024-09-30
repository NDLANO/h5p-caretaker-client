import { Dropzone } from './dropzone.js';

let dropzone;

// Just a hack from the proof-of-concept
const createOutput = (data) => {
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

const handleUpload = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.set('locale', document.querySelector('.select-language')?.value ?? 'en');

  dropzone.setStatus('');
  dropzone.showProgress();

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/h5p-caretaker/upload.php', true);


  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      dropzone.setProgress(percentComplete);
      if (percentComplete === 100) {
        dropzone.hideProgress();
        dropzone.setStatus('Your file is being checked', 'pulse');
      }

    }
  });

  xhr.addEventListener('load', () => {
    dropzone.hideProgress();
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      dropzone.setStatus('Your file was checked successfully');
      console.log(data);

      const output = createOutput(data);
      document.querySelector('.output').innerHTML = '';
      document.querySelector('.output').append(output);
    } else {
      dropzone.setStatus(xhr.responseText, 'error');
    }
  });

  xhr.addEventListener('error', () => {
    dropzone.setStatus(xhr.statusText, 'error');
  });

  // Send the request
  xhr.send(formData);
};

const initialize = () => {
  dropzone = new Dropzone(
    {
      selectorDropzone: '.h5p-caretaker .dropzone'
    },
    {
      upload: async (file) => {
        handleUpload(file);
      },
      reset: () => {
        document.querySelector('.output').innerHTML = '';
      }
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initialize();
});

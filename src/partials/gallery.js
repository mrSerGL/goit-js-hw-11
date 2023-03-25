// import debounce from 'debounce';
// import normalize from 'normalize.css/normalize';

import GalleryService from './service';
const galleryService = new GalleryService();

// const DEBOUNCE_DELAY = 300;

// some defaults definitions
let firstPageOfImages = [];

const markup = `
<div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>
`;

const refs = {
  inputField: document.querySelector('input'),
  submitBtn: document.querySelector('button'),
  galleryDiv: document.querySelector('.gallery'),
  moreButton: document.querySelector('.moreButton'),
};

refs.inputField.addEventListener('input', validateInput);
refs.submitBtn.addEventListener('click', getImages);
refs.moreButton.addEventListener('click', onLoadMore);

function validateInput() {
  const inputValue = refs.inputField.value;

  const regex = /^\s/;
  if (regex.test(inputValue)) {
    refs.inputField.value = '';
  }
}

function getImages(event) {
  event.preventDefault();

  galleryService.query = refs.inputField.value.trim();
  galleryService.page = 1;
  firstPageOfImages = [];

  galleryService.getImages().then(response => {
    console.log(response);

    if (response.length < 1) {
      refs.galleryDiv.innerHTML = '';
      return;
    }
    firstPageOfImages = response;
    createMarkup(response);
  });
}

function createMarkup(response) {
  refs.galleryDiv.innerHTML = '';

  const markup = response
    .map((image, index) => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = response[index];

      return ` <div class="photo-card">
          <img width="300px" height="225px"src="${webformatURL}" alt="" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
            </p>
            <p class="info-item">
              <b>Views</b>
            </p>
            <p class="info-item">
              <b>Comments</b>
            </p>
            <p class="info-item">
              <b>Downloads</b>
            </p>
          </div>
        </div>
        `;
    })
    .join('');

  refs.galleryDiv.innerHTML = markup;
}


function infinityLoading() {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        console.log(entry.isIntersecting);
        if (entry.isIntersecting) {
          onLoadMore();
        }
      }
    }, {});
    //* observer.observe(refs.moreButton);
  
    //* refs.moreButton.classList.add('hidden_on');
  }

  function onLoadMore() {
    //* refs.moreButton.classList.add('loading');
  
    galleryService.page += 1;
  
    galleryService
      .getImages( galleryService.name)
      .then(articles => {
        firstPageOfImages = [...firstPageOfImages, ...articles];
        createMarkup(firstPageOfImages);
        // toggleMoreButton(articles);
      });
  }

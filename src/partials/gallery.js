// import debounce from 'debounce';
// import normalize from 'normalize.css/normalize';


import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

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
//   galleryDiv: document.querySelector('.gallery'),
  moreButton: document.querySelector('.moreButton'),
  galleryContainer: document.querySelector('.gallery'),
};



refs.inputField.addEventListener('input', validateInput);
refs.submitBtn.addEventListener('click', getImages);
refs.moreButton.addEventListener('click', onLoadMore);
refs.galleryContainer.addEventListener("click", onGalleryContainerClick);

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
      refs.galleryContainer.innerHTML = '';
      return;
    }
    firstPageOfImages = response;
    createMarkup(response);
  });
}

function createMarkup(response) {
  refs.galleryContainer.innerHTML = '';

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

      return `<div class="photo-card">
 
        <a class="gallery__item" href="${largeImageURL}">
            <img class="gallery__image" width="300px" height="225px" src="${webformatURL}" alt="" loading="lazy" />
        </a>

        <div class="info">
            <p class="info-item">
                <span class="infoTitle"><b>Likes</b></span><span class="infoField">${likes}</span>
            </p>
            <p class="info-item">
                <span class="infoTitle"><b>Views</b></span><span class="infoField">${views}</span>
            </p>
            <p class="info-item">
                <span class="infoTitle"><b>Comments</b></span><span class="infoField">${comments}</span>
            </p>
            <p class="info-item">
                <span class="infoTitle"><b>Downloads</b></span><span class="infoField">${downloads}</span>
            </p>
        </div>
       
    </div>
        `;
    })
    .join('');


    

  refs.galleryContainer.innerHTML = markup;
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

  galleryService.getImages(galleryService.name).then(articles => {
    firstPageOfImages = [...firstPageOfImages, ...articles];
    createMarkup(firstPageOfImages);
    // toggleMoreButton(articles);
  });
}

function onGalleryContainerClick(event) {
    event.preventDefault();
  
    const isGallryItem = event.target.classList.contains("gallery__image");
  
    if (!isGallryItem) {
      return;
    }
    
    var lightbox = new SimpleLightbox(".gallery a", {
      /* options */
      captionsData: 'alt', captionDelay: 250, 
  
    });

    var gallery = ('.gallery a').simpleLightbox();
    gallery.refresh(); 
  }

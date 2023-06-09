'use strict'
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import GalleryService from './service';
const galleryService = new GalleryService();

const refs = {
  inputField: document.querySelector('input'),
  submitBtn: document.querySelector('button'),
  moreButton: document.querySelector('.moreButton'),
  galleryContainer: document.querySelector('.gallery'),
};

// some default definitions
let firstPageOfImages = [];
refs.moreButton.classList.add('hidden');

refs.inputField.addEventListener('input', validateInput);
refs.inputField.addEventListener('keypress', onKeyGetImages);
refs.submitBtn.addEventListener('click', getImages);
refs.moreButton.addEventListener('click', onLoadMore);
refs.galleryContainer.addEventListener('click', onGalleryContainerClick);

function validateInput() {
  const inputValue = refs.inputField.value;

  const regex = /^\s/;
  if (regex.test(inputValue)) {
    refs.inputField.value = '';
  }
}

async function getImages(event) {
  try {
    event.preventDefault();
    observer.unobserve(refs.moreButton);

    // galleryService.query = refs.inputField.value.trim();
    galleryService.name = refs.inputField.value.trim();
    galleryService.page = 1;
    firstPageOfImages = [];

    const response = await galleryService.getImages().then(response => {
      firstPageOfImages = response.hits;

      createMarkup(response.hits);
      checkReceivedData(response);
    });
  } catch (error) {
    console.log('getImages say:', error.message);
  }
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

      return ` <a class="gallery__item" href="${largeImageURL}">
       <div class="photo-card">
            <img class="gallery__image" width="300px" height="225px" src="${webformatURL}" alt="" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <span class="infoTitle">Likes</span><span class="infoField">${likes}</span>
            </p>
            <p class="info-item">
                <span class="infoTitle">Views</span><span class="infoField">${views}</span>
            </p>
            <p class="info-item">
                <span class="infoTitle">Comments</span><span class="infoField">${comments}</span>
            </p>
            <p class="info-item">
                <span class="infoTitle">Downloads</span><span class="infoField">${downloads}</span>
            </p>
        </div>
    </div>
    </a>
        `;
    })
    .join('');

  refs.galleryContainer.innerHTML = markup;
}

function infinityLoading(response) {
  const showedImages = galleryService.page * galleryService.per_page;

  if (showedImages >= response.total) {
    Notify.info(`We showed all ${response.total} images`);
    return;
  }
  
  observer.observe(refs.moreButton);
  refs.moreButton.classList.add('hidden');
}

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    // console.log(entry.isIntersecting);
    if (entry.isIntersecting) {
      onLoadMore();
    }
  }
}, {});

async function onLoadMore() {
  try {
    //* refs.moreButton.classList.add('loading');

    galleryService.page += 1;

    const response = await galleryService.getImages(galleryService.name);
    firstPageOfImages = [...firstPageOfImages, ...response.hits];

    createMarkup(firstPageOfImages);
    infinityLoading(response);
  } catch (error) {
    console.log('onLoadMore say:', error.message);
  }
}

function onGalleryContainerClick(event) {
  event.preventDefault();

  const isGallryItem = event.target.classList.contains('gallery__image');

  if (!isGallryItem) {
    return;
  }

  const lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

function checkReceivedData(response) {
  if (response.hits.length < 1) {
    refs.galleryContainer.innerHTML = '';

    refs.moreButton.classList.add('hidden');
    Notify.failure("We're sorry, not found such image");
    return;
  }

  Notify.success(`Hooray! We found ${response.total} images.`);
  refs.moreButton.classList.remove('hidden');
}

function onKeyGetImages(event) {
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
    getImages(event);
  }
}


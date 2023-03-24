// import debounce from 'debounce';
import GalleryService from './service';
const galleryService = new GalleryService();

// const DEBOUNCE_DELAY = 300;

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
};

refs.inputField.addEventListener('input', validateInput);
refs.submitBtn.addEventListener('click', getImages);

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

  galleryService.getImages().then(response => {

    console.log(response);
    

    if (response.length < 1) {
      refs.galleryDiv.innerHTML = '';
      return;
    }
    createMarkup(response)

  });
}

function createMarkup(response) {
    refs.galleryDiv.innerHTML = '';
  
    const markup = response
      .map((image, index) => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = response[index];
  
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
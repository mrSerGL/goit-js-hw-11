import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '34696430-6b2d422f51ccceb24da3a2678';

const searchParams = new URLSearchParams({
  key: API_KEY,
  // q: '',
  image_type: 'photo',
  orientation: 'horisontal',
  safesearch: 'false',
});

export default class GalleryService {
  constructor() {
    this.name = '';
    this.page = 1;
    this.per_page = 20;
  }

  async getImages(name) {
    const url = `${BASE_URL}q=${this.name}&page=${this.page}&per_page=${this.per_page}&${searchParams}`;

    const response = await axios.get(url);

    const images = response.data;
    return images;
  }

  get query() {
    return this.name;
  }

  set query(newQuery) {
    this.name = newQuery;
  }
}

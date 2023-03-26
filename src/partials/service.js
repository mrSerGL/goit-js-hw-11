import axios from 'axios';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL =
  'https://pixabay.com/api/?key=34696430-6b2d422f51ccceb24da3a2678';

const options = {
  key: '34696430-6b2d422f51ccceb24da3a2678',
  q: '',
  image_type: 'photo',
  orientation: 'horisontal',
  safesearch: 'false',
  per_page: 4,
};

export default class GalleryService {
  constructor() {
    this.name = '';
    this.page = 1;
  }

  async getImages(name) {
    // return axios
    //   .get(
    //     `${BASE_URL}&q=${this.name}&page=${this.page}&per_page=${options.per_page}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}`
    //   )
    //   .then(({ data }) => data.hits);

    const response = await axios.get(
      `${BASE_URL}&q=${this.name}&page=${this.page}&per_page=${options.per_page}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}`
    );

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

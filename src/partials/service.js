import axios from 'axios';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/?key=34696430-6b2d422f51ccceb24da3a2678';

// Your API key: 34696430-6b2d422f51ccceb24da3a2678
// https://pixabay.com/api/?key=34696430-6b2d422f51ccceb24da3a2678&q=yellow+flowers&image_type=photo

export default class GalleryService {
    constructor() {
        this.name = '';  
    }

getImages(name) {
    console.log(this.name);
    return axios.get(`${BASE_URL}`).then(({ data }) => data);
 
    // return 
  }


  get query() {
    return this.name;
  }

  set query(newQuery) {
    this.name = newQuery;
  }
}



  


//   export default new GalleryService();


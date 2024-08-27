import axios from 'axios';

export default class ApiService {
  constructor() {
    this.query = '';
    this.page = 1;
    this.url = 'https://pixabay.com/api/';
  }

  async fetchCard() {
    const params = {
      key: '39155276-6bb78cfc3029a8ff9cc1c0e7d',
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    };

    const response = await axios.get(this.url, { params });

    return response.data;
  }
}

import axios from 'axios';

export default class ApiService {
  constructor(query = '', page = 1) {
    this.query = query;
    this.page = page;
    this.per_page = 40;
    this.url = 'https://pixabay.com/api/';
  }

  resetPage() {
    this.page = 1;
  }

  // Метод для формирования параметров запроса
  getParams() {
    return {
      key: '45501935-0911994d2592de4efac5f061b',
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.per_page,
      page: this.page,
    };
  }

  async fetchCard() {
    try {
      const params = this.getParams();
      const response = await axios.get(this.url, { params });
      this.page += 1;
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data from API');
    }
  }
}

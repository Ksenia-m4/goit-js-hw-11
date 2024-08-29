import Notiflix from 'notiflix';
import ApiService from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

const apiService = new ApiService();

loadMore.classList.add('is-hidden'); // спрятали кнопку load more при загрузке страницы

formEl.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadmore);

async function onSearch(evt) {
  evt.preventDefault(); // убираем действия по умолчанию

  // let { searchQuery } = formEl; // Получаем значение input
  // apiService.query = searchQuery.value;

  const searchQuery = formEl.elements.searchQuery.value;

  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  apiService.query = searchQuery;

  apiService.resetPage();
  clearContainer();
  loadMore.classList.add('is-hidden'); // Прячем loadmore перед новым поиском

  try {
    const cards = await apiService.fetchCard();

    if (cards.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    createMarkup(cards.hits);
    Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
    loadMore.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something went wrong. Please try again.');
  }
}

async function onLoadmore() {
  try {
    const cards = await apiService.fetchCard(); // Загружаем дополнительные результаты
    createMarkup(cards.hits); // Добавляем новые результаты в галерею

    if (cards.hits.length === 0) {
      loadMore.classList.add('is-hidden'); // Скрываем кнопку, если больше нечего загружать
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }

    smoothScroll(); // Плавная прокрутка после добавления новых изображений
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}" class="link simplelightbox">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
    
  </div>
  </a>
</div>`;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function clearContainer() {
  galleryEl.innerHTML = '';
}

let gallery = new SimpleLightbox('.simplelightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});

function smoothScroll() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

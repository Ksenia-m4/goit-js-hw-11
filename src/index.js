import Notiflix from 'notiflix';
import ApiService from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Элементы DOM
const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');

// Инициализация ApiService
const apiService = new ApiService();

// Настройка SimpleLightbox
let gallery = new SimpleLightbox('.simplelightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Настройка  IntersectionObserver
let options = {
  root: null, // Будет использоваться видимая область
  rootMargin: '500px', // Зона срабатывания раньше
  threshold: 1.0,
};

let observer = new IntersectionObserver(onIntersection, options);

// Событие отправки формы
formEl.addEventListener('submit', onSearch);

// Функция обработки запроса
async function onSearch(evt) {
  evt.preventDefault(); // убираем действия по умолчанию

  const searchQuery = formEl.elements.searchQuery.value;

  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  apiService.query = searchQuery;

  apiService.resetPage();
  clearContainer();

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

    observer.observe(target); // Наблюдаем за элементом для бесконечной прокрутки
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something went wrong. Please try again.');
  }
}

// Функция IntersectionObserver
function onIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadmore();
    }
  });
}

// Функция создания разметки для галереи
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
  gallery.refresh(); // Обновляем галерею SimpleLightbox
}

// Функция очистки контейнера галереи
function clearContainer() {
  galleryEl.innerHTML = '';
}

// Функция для загрузки дополнительных результатов
async function onLoadmore() {
  try {
    const cards = await apiService.fetchCard(); // Загружаем дополнительные результаты
    createMarkup(cards.hits); // Добавляем новые результаты в галерею

    if (apiService.page !== 0 && cards.hits.length === 0) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      observer.disconnect(); // Отключаем Observer, если больше нечего загружать
    }

    // smoothScroll(); // Плавная прокрутка после добавления новых изображений
  } catch (error) {
    console.log(error);
  }
}

// Функция для плавной прокрутки
// function smoothScroll() {
//   const { height: cardHeight } =
//     galleryEl.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

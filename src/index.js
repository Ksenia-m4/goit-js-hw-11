// Создай фронтенд часть приложения поиска и просмотра изображений по ключевому слову.
// Добавь оформление элементов интерфейса.

// Шаблон разметки карточки одного изображения для галереи.

// <div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>

import Notiflix from 'notiflix';
import ApiService from './api';

const formEl = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');

const apiService = new ApiService();

loadMore.classList.add('is-hidden'); // спрятали кнопку load more при загрузке страницы

formEl.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadmore);

function onSearch(evt) {
  evt.preventDefault(); // убираем действия по умолчанию

  let { searchQuery } = formEl;
  console.log(searchQuery.value);

  apiService.query = searchQuery.value;
  console.log(apiService.fetchCard()); // возвращается промис
}

function onLoadmore(e) {
  console.log(e);
}

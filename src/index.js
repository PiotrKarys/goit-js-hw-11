import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const input = form.querySelector('[name="searchQuery"]');
const gallery = document.getElementById('gallery');

let currentPage = 1;

form.addEventListener('submit', async function (ev) {
  ev.preventDefault();
  const searchQuery = input.value.trim();
  if (searchQuery) {
    currentPage = 1;
    await fetchImages(searchQuery);
  } else {
    Notiflix.Notify.info('Please fill the form');
  }
});

async function fetchImages(query) {
  const apiUrl = 'https://pixabay.com/api/';
  const perPage = 40;
  const params = {
    key: '43728085-c2fe2d16d23a402329bbec6f8',
    q: query,
    image_type: 'photo',
    safesearch: true,
    page: currentPage,
    per_page: perPage,
  };

  try {
    const response = await axios.get(apiUrl, { params });
    const images = response.data.hits;
    displayImages(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
}

function displayImages(images) {
  if (currentPage === 1) {
    gallery.innerHTML = '';
  }

  images.forEach(image => {
    const imageElement = document.createElement('img');
    imageElement.src = image.webformatURL;
    imageElement.alt = image.tags;
    gallery.appendChild(imageElement);
  });
}

window.addEventListener('scroll', function () {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    currentPage++;
    fetchImages(input.value.trim());
  }
});

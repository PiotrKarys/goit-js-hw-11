import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const input = form.querySelector('[name="searchQuery"]');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');
loadMoreBtn.classList.add('hidden');

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

loadMoreBtn.addEventListener('click', async function () {
  currentPage++;
  await fetchImages(input.value.trim());
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
    const totalHits = response.data.totalHits;
    const ImageData = response.data.hits.map(image => ({
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      tags: image.tags,
      likes: image.likes,
      views: image.views,
      comments: image.comments,
      downloads: image.downloads,
    }));
    if (ImageData.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      displayImages(ImageData);
      if (currentPage === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    }

    if (currentPage * perPage >= totalHits) {
      loadMoreBtn.classList.remove('hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.classList.add('hidden');
    }
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

  images.forEach((image, index) => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';
    photoCard.appendChild(img);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info', `info-${index}`);
    infoDiv.innerHTML = `
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    `;
    photoCard.appendChild(infoDiv);

    gallery.appendChild(photoCard);
  });
}
window.addEventListener('scroll', function () {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const bottomOffset = 250;

  if (scrollTop + clientHeight >= scrollHeight - bottomOffset) {
    loadMoreBtn.classList.remove('hidden');
  } else {
    loadMoreBtn.classList.add('hidden');
  }
});


import config from "./config.js";
import galleryStore from "./GalleryStore.js";

import {
  photoData,
  viewedPhotos
} from "./photo.js";

import {
  createViewObserver,
  createInfiniteScrollObserver
} from "./observers.js";

import {
  filterByCategory,
  debounce,
  throttle,
  searchPhotos,
  getPhotoId
} from "./utils.js";

const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const photoCount = document.getElementById("photoCount");
const emptyMessage = document.getElementById("emptyMessage");
const loadingMessage = document.getElementById("loadingMessage");
const sentinel = document.getElementById("sentinel");
const locationBtn = document.getElementById("locationBtn");
const locationResult = document.getElementById("locationResult");

let isLoading = false;
let searchQuery = "";
let selectedCategory = "all";

console.log(`${config.appName} v${config.version}`);

galleryStore.initialize(photoData);

const viewObserver = createViewObserver((card) => {
  const photo = galleryStore.getPhotos().find(
    (item) => getPhotoId(item) === Number(card.dataset.id)
  );

  if (photo && !viewedPhotos.has(photo)) {
    viewedPhotos.set(photo, true);
    card.dataset.viewed = "true";
    console.log("Photo viewed:", photo.title);
  }

  viewObserver?.unobserve(card);
});

const infiniteObserver = createInfiniteScrollObserver(() => {
  loadMorePhotos();
});

function getFilteredPhotos() {
  const photos = galleryStore.getPhotos();

  const categoryFiltered = filterByCategory(selectedCategory)(photos);

  return searchPhotos(searchQuery, categoryFiltered);
}

function renderGallery() {
  const photos = getFilteredPhotos();

  gallery.innerHTML = "";

  emptyMessage.hidden = photos.length !== 0;

  photoCount.textContent =
    `Showing ${photos.length} of ${galleryStore.getPhotos().length} loaded photos`;

  photos.forEach((photo) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.dataset.id = String(getPhotoId(photo));

    const img = document.createElement("img");
    img.src = photo.url;
    img.alt = photo.title;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "photo-info";

    const title = document.createElement("h2");
    title.textContent = photo.title;

    const category = document.createElement("p");
    category.textContent = `Category: ${photo.category}`;

    const description = document.createElement("p");
    description.textContent = photo.describe();

    const actions = document.createElement("div");
    actions.className = "photo-actions";

    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.className = "like-button";

    if (photo.liked) {
      likeButton.classList.add("liked");
    }

    likeButton.textContent =
      `${photo.liked ? "♥ Liked" : "♡ Like"} (${photo.likes})`;

    likeButton.setAttribute(
      "aria-pressed",
      String(Boolean(photo.liked))
    );

    likeButton.addEventListener("click", () => {
      galleryStore.toggleLike(getPhotoId(photo));
    });

    actions.append(likeButton);
    info.append(title, category, description, actions);
    card.append(img, info);
    gallery.append(card);

    if (viewObserver) {
      viewObserver.observe(card);
    } else if (!viewedPhotos.has(photo)) {
      viewedPhotos.set(photo, true);
      console.log("Photo viewed:", photo.title);
    }
  });
}

galleryStore.subscribe(() => {
  renderGallery();
});

function loadMorePhotos() {
  if (isLoading || !galleryStore.hasMore) {
    if (!galleryStore.hasMore) {
      loadingMessage.textContent = "All photos loaded.";
    }
    return;
  }

  isLoading = true;
  loadingMessage.textContent = "Loading photos...";

  try {
    const batchSize =
      galleryStore.getPhotos().length === 0
        ? config.initialPhotos
        : config.photosPerLoad;

    const newPhotos = galleryStore.getNextPhotos(batchSize);

    if (newPhotos.length === 0 || !galleryStore.hasMore) {
      loadingMessage.textContent = "All photos loaded.";
    } else {
      loadingMessage.textContent = "Scroll down to load more.";
    }
  } catch (error) {
    console.error("Unable to load photos:", error);
    loadingMessage.textContent = "Error loading photos. Check Console.";
  } finally {
    isLoading = false;
  }
}

searchInput.addEventListener(
  "input",
  debounce((event) => {
    searchQuery = event.target.value;
    renderGallery();
  }, 300)
);

categoryFilter.addEventListener("change", (event) => {
  selectedCategory = event.target.value;
  renderGallery();
});

window.addEventListener(
  "scroll",
  throttle(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 250;

    if (nearBottom) {
      loadMorePhotos();
    }
  }, 200),
  { passive: true }
);

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    locationResult.textContent =
      "Geolocation is not supported by this browser.";
    return;
  }
  locationResult.textContent =
    "Getting your location... Please allow location access.";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      locationResult.textContent =
        `Latitude: ${latitude.toFixed(5)}, ` +
        `Longitude: ${longitude.toFixed(5)}`;
    },
    (error) => {
      const messages = {
        1: "Location permission denied. Please allow access in browser settings.",
        2: "Your location is currently unavailable.",
        3: "Location request timed out. Please try again."
      };

      locationResult.textContent =
        messages[error.code] || "Unable to get your location.";
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000
    }
  );
});

loadMorePhotos();

if (infiniteObserver) {
  infiniteObserver.observe(sentinel);
}
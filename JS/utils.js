
import { PHOTO_ID } from "./photo.js";

export const filterByCategory = (category) => (photos) => {
  if (category === "all") {
    return photos;
  }

  return photos.filter(
    (photo) => photo.category === category
  );
};

export function debounce(callback, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function throttle(callback, delay = 200) {
  let lastCall = 0;

  return (...args) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
}

export function searchPhotos(query, photos) {
  const text = query.trim().toLowerCase();

  if (!text) {
    return photos;
  }

  return photos.filter((photo) => {
    const searchableText = [
      photo.title,
      photo.category,
      photo.description,
      ...(photo.tags || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(text);
  });
}
export function getPhotoId(photo) {
  return photo[PHOTO_ID];
}

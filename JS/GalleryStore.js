
import { Observable } from "./observers.js";
import { photoGenerator, PHOTO_ID } from "./photo.js";

class GalleryStore extends Observable {
  constructor() {
    super();

    this.photos = [];
    this.generator = null;
    this.totalPhotos = 0;
    this.initialized = false;
  }

  initialize(photoData) {
    if (this.initialized) return;

    this.totalPhotos = photoData.length;
    this.generator = photoGenerator(photoData);
    this.initialized = true;
  }
 
  getNextPhotos(count = 3) {
  const newPhotos = [];

  if (!this.generator) {
    return newPhotos;
  }

  for (let i = 0; i < count; i++) {
    const result = this.generator.next();

    if (result.done) {
      break;
    }

    this.photos.push(result.value);
    newPhotos.push(result.value);
  }

  this.notify({
    type: "photos-loaded",
    photos: this.photos
  });

  return newPhotos;
}

  
toggleLike(id) {
  const photo = this.photos.find(
    (item) => item[PHOTO_ID] === Number(id)
  );

  if (!photo) return;

  if (photo.liked) {
    photo.likes = Math.max(0, photo.likes - 1);
    photo.liked = false;
  } else {
    photo.likes += 1;
    photo.liked = true;
  }
  this.notify({
    type: "like-updated",
    photo
  });
}
 
getPhotos() {
    return [...this.photos];
  }

  get hasMore() {
    return this.photos.length < this.totalPhotos;
  }
}

const galleryStore = new GalleryStore();

export default galleryStore;

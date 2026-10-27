
export const PHOTO_ID = Symbol("photoId");

export const viewedPhotos = new WeakMap();

let nextId = 1;

const photoPrototype = {
  describe() {
    return `${this.title} (${this.category})`;
  }
};

export const photoData = [
  {
    title: "Mountains view",
    category: "nature",
  url: "https://i.pinimg.com/1200x/e4/2a/01/e42a01ad62fcdef9d536175883e28d9e.jpg",
    likes: 0
  },
  {
    title: "Forest Tree",
    category: "nature",
    url: "https://i.pinimg.com/1200x/7f/e4/20/7fe42026a9f21b53bd5e6df4303423bb.jpg",
    likes: 0
  },
  {
    title: "Cat",
    category: "animals",
    url: "https://i.pinimg.com/1200x/11/f6/6c/11f66c7b0d52e0c577d64d2aee5ffcf6.jpg",
    likes: 0
  },
   {
    title: "Meow",
    category: "animals",
    url: "https://i.pinimg.com/736x/d7/30/fa/d730fab8aee2570ab8e9d5994e05cd9a.jpg",
    likes: 0
  },
  {
    title: "Eclectus parrots",
    category: "animals",
    url: "https://i.pinimg.com/1200x/78/18/3c/78183ce93d360143775dd9e33298370a.jpg",
    likes: 0
  },
  {
    title: "Modern House",
    category: "architecture",
    url: "https://i.pinimg.com/736x/37/82/1e/37821ea32fb2e4643973a65bd4dfa584.jpg",
    likes: 0
  },
  {
    title: "Turkey Street",
    category: "Street",
    url: "https://i.pinimg.com/736x/6f/50/2d/6f502d788cdaf7a2642297fb6b210da0.jpg",
    likes: 0
  },
  {
    title: "Yoo Enjoy",
    category: "travel",
    url: "https://i.pinimg.com/736x/27/d5/d5/27d5d5179e4328b9eef1dddbce4fb3ec.jpg",
    likes: 0
  },
  {
    title: "Egypt",
    category: "travel",
    url: "https://i.pinimg.com/736x/2c/ba/f4/2cbaf4b26543a083bebbaf02a32ff5d2.jpg",
    likes: 0
  },
  {
    title: "Sunset Landscape",
    category: "nature",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
    likes: 0
  },
  {
    title: "Beautiful Journey",
    category: "travel",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
    likes: 0
  },
  {
    title: "Colorful Bird",
    category: "animals",
    url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800",
    likes: 0
  },
  {
    title: "City Design",
    category: "architecture",
    url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800",
    likes: 0
  },
  {
    title: "Beautiful House",
  category: "architecture",
  url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800",
  likes: 0
}
];
const dummyPhotos = Array.from({ length: 200 }, (_, index) => ({
  title: `Photo ${index + 1}`,
  category: ["nature", "animals", "architecture", "travel"][
    index % 4
  ],
  url: `https://picsum.photos/seed/smartgallery${index + 1}/800/600`,
  likes: 0
}));
photoData.push(...dummyPhotos);
export function createPhoto(data) {
  const photo = Object.create(photoPrototype);

  Object.assign(photo, data);

  photo[PHOTO_ID] = nextId++;

  return new Proxy(photo, {
    set(target, property, value) {
      const oldValue = Reflect.get(target, property);

      const success = Reflect.set(target, property, value);

      if (success && !Object.is(oldValue, value)) {
        console.log(
          `[Proxy] ${String(property)} changed:`,
          oldValue,
          "→",
          value
        );
      }

      return success;
    }
  });
}

export function* photoGenerator(data) {
  for (const item of data) {
    yield createPhoto(item);
  }
}

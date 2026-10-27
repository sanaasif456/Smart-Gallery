
export class Observable {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);

    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach((callback) => callback(data));
  }
}

export function createViewObserver(onViewed) {
  if (!("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onViewed(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });
}

export function createInfiniteScrollObserver(onReachEnd) {
  if (!("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onReachEnd();
      }
    });
  }, {
    rootMargin: "300px",
    threshold: 0
  });
}

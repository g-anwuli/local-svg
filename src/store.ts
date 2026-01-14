interface Store {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, content:string): Promise<void>;
}

class LocalStorageStore implements Store {
  async getItem(key: string): Promise<string | null> {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as string) : null;
  }

  async setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}

class IndexedDBStore implements Store {
  private dbName = "LOCAL_SVG_DB";
  private storeName = "svgs";
  private dbPromise: Promise<IDBDatabase>;
  private version = 1;

  constructor() {
    this.dbPromise = this.openDB();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const idb: IDBFactory | null =
        window.indexedDB ||
        (window as any).mozIndexedDB ||
        (window as any).webkitIndexedDB ||
        (window as any).msIndexedDB;
      if (!idb) {
        reject(new Error("IndexedDB is not supported in this environment."));
        return;
      }
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getItem(key: string): Promise<string | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => {
        resolve((request.result as string) || null);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async setItem(key: string, value: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const createStore = (storage?: "localstorage" | "indexdb"): Store => {
  if (typeof window === "undefined") {
    console.warn("Store can only be created in a browser environment.");
    return null;
  }
  try {
    if (storage === "localstorage") {
      return new LocalStorageStore();
    }
    return new IndexedDBStore();
  } catch (error) {
    return new LocalStorageStore();
  }
};

export class PromiseCache<T> {
  private cache: Map<string, Promise<T>>;

  constructor() {
    this.cache = new Map();
  }

  get(key: string): Promise<T> | undefined {
    return this.cache.get(key);
  }

  set(key: string, promise: Promise<T>): void {
    this.cache.set(key, promise);
  }
}
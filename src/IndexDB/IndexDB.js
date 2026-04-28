// DB config
const DB_NAME = 'RouletteDB';
const STORE_NAME = 'counts';
const DB_VERSION = 2;

// open DB
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = event.target.result;

      // create object store if not exists
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('history')) {
        const historyStore = db.createObjectStore('history', { keyPath: 'id' });

        // optional: index for sorting by time
        historyStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// save counts data (overwrites existing)
export const saveCounts = async data => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // we use fixed id so only one record exists
    store.put({
      id: 'countsData',
      ...data
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const getCounts = async () => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const request = store.get('countsData');

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => reject(request.error);
  });
};

export const clearCounts = async () => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.delete('countsData');

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const saveHistory = async ({ numbers, winningNumber, count1, count2, count3, count4 }) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');

    const data = {
      id: Date.now(), // unique id
      numbers,
      winningNumber,
      count1,
      count2,
      count3,
      count4,
      createdAt: new Date().toISOString()
    };

    store.add(data);

    tx.oncomplete = () => resolve(data);
    tx.onerror = () => reject(tx.error);
  });
};

export const getHistory = async () => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('history', 'readonly');
    const store = tx.objectStore('history');

    const request = store.getAll();

    request.onsuccess = () => {
      // latest first
      const result = request.result.sort((a, b) => b.id - a.id);
      resolve(result);
    };

    request.onerror = () => reject(request.error);
  });
};

export const clearHistory = async () => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');

    store.clear();

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

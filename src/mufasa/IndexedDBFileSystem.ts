export function openDatabase(dbName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("files", { keyPath: "fileName" });
    };
  });
}

export function writeFileToIndexedDB(
  dbName: string,
  fileName: string,
  content: string,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase(dbName);

      const transaction = db.transaction(["files"], "readwrite");
      const store = transaction.objectStore("files");

      const request = store.put({ fileName, content });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    } catch (error) {
      reject(error);
    }
  });
}

export function readFileFromIndexedDB(
  dbName: string,
  fileName: string,
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase(dbName);

      const transaction = db.transaction(["files"], "readonly");
      const store = transaction.objectStore("files");

      const request = store.get(fileName);

      request.onsuccess = () => {
        const file = request.result;
        if (file) {
          resolve(file.content);
        } else {
          reject(new Error("File not found in IndexedDB."));
        }
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    } catch (error) {
      reject(error);
    }
  });
}

export function deleteFileFromIndexedDB(
  dbName: string,
  fileName: string,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase(dbName);

      const transaction = db.transaction(["files"], "readwrite");
      const store = transaction.objectStore("files");

      const request = store.delete(fileName);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    } catch (error) {
      reject(error);
    }
  });
}

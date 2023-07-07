// export function createFileDB(request: {
//   makeDirectory: (path: string) => Promise<void>;
//   deleteDirectoryAndContents: (path: string) => Promise<void>;
//   writeFile: (path: string, content: string) => Promise<void>;
//   readFile: (path: string) => Promise<string>;
//   deleteFile: (path: string) => Promise<void>;
// }): IDBFactory {
//   return {
//     /**
//      * Compares two values as keys. Returns -1 if key1 precedes key2, 1 if key2 precedes key1, and 0 if the keys are equal.
//      *
//      * Throws a "DataError" DOMException if either input is not a valid key.
//      *
//      * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBFactory/cmp)
//      */
//     cmp(first: any, second: any): number;
//     /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBFactory/databases) */
//     databases(): Promise<IDBDatabaseInfo[]>;
//     /**
//      * Attempts to delete the named database. If the database already exists and there are open connections that don't close in response to a versionchange event, the request will be blocked until all they close. If the request is successful request's result will be null.
//      *
//      * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBFactory/deleteDatabase)
//      */
//     deleteDatabase(name: string): IDBOpenDBRequest;
//     /**
//      * Attempts to open a connection to the named database with the current version, or 1 if it does not already exist. If the request is successful request's result will be the connection.
//      *
//      * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBFactory/open)
//      */
//     open(name: string, version?: number): IDBOpenDBRequest;
//   }
// }
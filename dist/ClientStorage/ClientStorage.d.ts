export type Json = number | string | boolean | null | undefined | JsonObject;
export type JsonObject = {
    [propName: string]: Json;
};
export type GetClientStorage = <T extends JsonObject>(fileName: string, init: T) => Promise<ClientStorage<T>>;
type DeepReadonlyJsonObject<T> = T extends object ? {
    readonly [K in keyof T]: DeepReadonlyJsonObject<T[K]>;
} : T;
type SpecificJsonObject<T extends JsonObject> = DeepReadonlyJsonObject<Partial<T>>;
export type ClientStorage<T extends JsonObject> = {
    /** Adds and updates the given data */
    updateData(updates: SpecificJsonObject<T>): void;
    /** Readonly access to the data. */
    data: SpecificJsonObject<T>;
    readFile: (path: string) => Promise<string | undefined>;
    writeFile: (path: string, data: string) => Promise<void>;
    deleteFile: (path: string) => Promise<void>;
    getFilePath: (path: string) => string;
};
export {};

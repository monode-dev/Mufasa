import { GetClientStorage } from "./ClientStorage";
export declare function capacitorStorage(fileSystem: {
    readFile: (path: string) => Promise<string | undefined>;
    writeFile: (path: string, data: string) => Promise<void>;
    deleteFile: (path: string) => Promise<void>;
}): GetClientStorage;

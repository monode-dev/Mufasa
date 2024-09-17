export declare function compressImage(config: {
    webPath: string;
    maxSize?: number | {
        width: number;
        height: number;
    };
    format?: `png` | `jpeg`;
}): Promise<string | null>;

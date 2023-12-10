export interface ChunkLargeFileDownloader {
    index: number;
    startByte: number;
    endByte: number;
    name: string;
}
export interface InputLargeFileDownloader {
    fileUrl: string;
    chunkSizeInBytes?: number;
    destinationFolder?: string;
    cleanTempFiles?: boolean;
    logger?: boolean;
}
export interface OutLargeFileDownloader {
    pathFile: string;
    size: number;
    time: number;
}
export declare function largeFileDownloader(data: InputLargeFileDownloader): Promise<OutLargeFileDownloader>;
export declare function getFileMetadata(fileUrl: string): Promise<{
    size: number;
    [key: string]: any;
}>;
export declare function getFileExt(contentTypeHeader: string): string;
export declare function getFileNameFromUrl(url: string): string;
export declare function formatBytes(bytes: number, decimals?: number): string;

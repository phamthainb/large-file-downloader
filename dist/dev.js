"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const _1 = require(".");
//
const fileUrl = "http://localhost:3300/1_2GB.mp4";
// const fileUrl = "http://localhost:3300/10MB.mp4";
const options = {
    chunkSizeInBytes: 10 * 1024 * 1024, // 10 MB chunks
    destinationFolder: (0, path_1.join)(__dirname, "..", "sample", "temp"), // Destination folder path
    cleanTempFiles: true, // Clean temporary files after combining
    logger: true, // Enable logging
};
(0, _1.largeFileDownloader)(Object.assign({ fileUrl }, options))
    .then((result) => {
    console.log("File downloaded successfully:", result.pathFile);
    console.log("Download time:", result.time, "ms");
    console.log("File size:", result.size, "bytes");
})
    .catch((error) => {
    console.error("Error:", error);
});

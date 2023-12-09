"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileNameFromUrl = exports.getFileExt = exports.getFileMetadata = exports.largeFileDownloader = void 0;
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
const util_1 = require("util");
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = require("path");
let isLog = true;
const logger = (...optionalParams) => {
    if (isLog) {
        console.log(optionalParams);
    }
};
function largeFileDownloader(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const start = Date.now();
        const { fileUrl } = data;
        // default options
        let chunkSizeInBytes = (data === null || data === void 0 ? void 0 : data.chunkSizeInBytes) || 5 * 1024 * 1024; // 5MB
        let destinationFolder = (data === null || data === void 0 ? void 0 : data.destinationFolder) || (0, path_1.join)(__dirname, "temp"); // temp
        let cleanTempFiles = (data === null || data === void 0 ? void 0 : data.cleanTempFiles) || true; // true
        let fileNameFromUrl = getFileNameFromUrl(fileUrl) || randomStr();
        let fileName = fileNameFromUrl;
        // check logger enable
        if ((data === null || data === void 0 ? void 0 : data.logger) != undefined) {
            isLog = data === null || data === void 0 ? void 0 : data.logger;
        }
        // check destinationFolder is exist
        if (!fs.existsSync(destinationFolder)) {
            fs.mkdirSync(destinationFolder, { recursive: true });
        }
        try {
            const metadata = yield getFileMetadata(fileUrl);
            // check file name extension
            if ((fileName === null || fileName === void 0 ? void 0 : fileName.split(".").length) < 2) {
                fileName = `${fileName}.${getFileExt(metadata["content-type"])}`;
            }
            // start downloader
            logger({
                chunkSizeInBytes,
                destinationFolder,
                cleanTempFiles,
                fileName,
            });
            const fileSize = metadata.size;
            const chunks = splitFileIntoChunks(fileSize, chunkSizeInBytes);
            logger({ chunks });
            const downloadPromises = [];
            chunks.forEach((chunk, index) => {
                downloadPromises.push(downloadChunk(fileUrl, chunk, destinationFolder, index + 1));
            });
            yield Promise.all(downloadPromises);
            logger("All chunks downloaded successfully!");
            const combinedFilePath = `${destinationFolder}/${fileName}`;
            yield combineChunks(destinationFolder, chunks, combinedFilePath);
            logger("File chunks combined successfully!");
            // unlink all temp file
            if (cleanTempFiles) {
                for (let index = 0; index < chunks.length; index++) {
                    const fileChuck = `${destinationFolder}/${chunks[index].name}`;
                    fs.unlinkSync(fileChuck);
                    logger(`unlinkSync ${fileChuck} successfully`);
                }
            }
            return {
                pathFile: combinedFilePath,
                time: Date.now() - start, // ms
                size: fileSize,
            };
        }
        catch (error) {
            logger("Error:", error);
            throw error;
        }
    });
}
exports.largeFileDownloader = largeFileDownloader;
function getFileMetadata(fileUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            https
                .get(fileUrl, (response) => {
                resolve(Object.assign(Object.assign({}, response.headers), { size: parseInt(response.headers["content-length"] || "0", 10) }));
            })
                .on("error", (error) => {
                reject(error);
            });
        });
    });
}
exports.getFileMetadata = getFileMetadata;
function splitFileIntoChunks(fileSize, chunkSizeInBytes) {
    const chunks = [];
    let startByte = 0;
    let count = 0;
    while (startByte < fileSize) {
        const endByte = Math.min(startByte + chunkSizeInBytes - 1, fileSize - 1);
        chunks.push({
            startByte,
            endByte,
            name: `chuck_${padIndex(count, 5)}`,
            index: count,
        });
        startByte = endByte + 1;
        count += 1;
    }
    return chunks;
}
function downloadChunk(fileUrl, chunk, destinationFolder, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startByte, endByte } = chunk;
        const rangeHeader = `bytes=${startByte}-${endByte}`;
        return new Promise((resolve, reject) => {
            https
                .get(fileUrl, { headers: { Range: rangeHeader } }, (response) => {
                const file = fs.createWriteStream(`${destinationFolder}/${chunk === null || chunk === void 0 ? void 0 : chunk.name}`);
                response.pipe(file);
                file.on("finish", () => {
                    file.close(() => {
                        logger(`${chunk === null || chunk === void 0 ? void 0 : chunk.name} downloaded`);
                        resolve();
                    });
                });
            })
                .on("error", (error) => {
                reject(error);
            });
        });
    });
}
function padIndex(index, length) {
    return index.toString().padStart(length, "0");
}
function combineChunks(destinationFolder, chuck, combinedFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const writeStream = fs.createWriteStream(combinedFilePath);
        for (let i = 0; i < chuck.length; i++) {
            const chunkFilePath = `${destinationFolder}/${chuck[i].name}`;
            const chunkData = yield (0, util_1.promisify)(fs.readFile)(chunkFilePath);
            writeStream.write(chunkData);
        }
        writeStream.end();
        yield new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        });
    });
}
function randomStr(len) {
    let length = len || 10; // default is 10 char
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let randomString = "";
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomString;
}
function getFileExt(contentTypeHeader) {
    const mimeType = contentTypeHeader.split(";")[0].trim(); // Extract MIME type (ignore any parameters)
    const extension = mime_types_1.default.extension(mimeType);
    if (extension) {
        return extension;
    }
    // If the MIME type is not recognized or mapped, return an empty string or handle it as needed
    return "";
}
exports.getFileExt = getFileExt;
function getFileNameFromUrl(url) {
    // Split the URL by '/', then get the last segment (which should represent the file name)
    const segments = url.split("/");
    const fileName = segments.pop(); // Get the last segment (file name) from the URL
    if (fileName) {
        // Check if the file name contains a query string and remove it if present
        const queryStringIndex = fileName.indexOf("?");
        if (queryStringIndex !== -1) {
            return fileName.substring(0, queryStringIndex);
        }
        return fileName;
    }
    // If no valid file name is found, return a default name or throw an error
    return "";
}
exports.getFileNameFromUrl = getFileNameFromUrl;

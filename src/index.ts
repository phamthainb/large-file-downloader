import * as fs from "fs";
import * as https from "https";
import { promisify } from "util";
import mimeTypes from "mime-types";
import { join } from "path";

export interface ChunkLargeFileDownloader {
  index: number;
  startByte: number;
  endByte: number;
  name: string;
}

export interface InputLargeFileDownloader {
  fileUrl: string;
  chunkSizeInBytes?: number; // byte
  destinationFolder?: string;
  cleanTempFiles?: boolean;
  logger?: boolean;
}

export interface OutLargeFileDownloader {
  pathFile: string;
  size: number; // byte
  time: number; // ms
}

let isLog = true;
const logger = (...optionalParams: any[]) => {
  if (isLog) {
    console.log(...optionalParams);
  }
};

export async function largeFileDownloader(
  data: InputLargeFileDownloader
): Promise<OutLargeFileDownloader> {
  const start = Date.now();
  const { fileUrl } = data;

  if (!isValidUrl(fileUrl)) {
    throw Error("Invalid file URL");
  }

  // default options
  let chunkSizeInBytes = data?.chunkSizeInBytes || 5 * 1024 * 1024; // 5MB
  let destinationFolder = data?.destinationFolder || join(__dirname, "temp"); // temp
  let cleanTempFiles =
    data?.cleanTempFiles !== undefined ? data?.cleanTempFiles : true; // true
  let fileNameFromUrl = getFileNameFromUrl(fileUrl) || randomStr();
  let fileName = fileNameFromUrl;

  // check logger enable
  if (data?.logger != undefined) {
    isLog = data?.logger;
  }

  // check destinationFolder is exist
  destinationFolder = `${destinationFolder}/${randomStr(6)}_${Date.now()}`;
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
  }

  try {
    const metadata = await getFileMetadata(fileUrl);
    logger({ metadata });
    // check file name extension
    if (fileName?.split(".").length < 2) {
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
    if (fileSize < 1) {
      throw Error(
        `Url is not has any file or It not support chunking download. Got fileSize: ${fileSize}bytes`
      );
    }
    const chunks = splitFileIntoChunks(fileSize, chunkSizeInBytes);
    // logger({ chunks });
    const downloadPromises: Promise<void>[] = [];

    chunks.forEach((chunk, index) => {
      downloadPromises.push(downloadChunk(fileUrl, chunk, destinationFolder));
    });

    await Promise.all(downloadPromises);
    logger("All chunks downloaded successfully!");

    const combinedFilePath = `${destinationFolder}/${fileName}`;
    await combineChunks(destinationFolder, chunks, combinedFilePath);
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
  } catch (error) {
    logger("Error:", error);
    throw error;
  }
}

export async function getFileMetadata(
  fileUrl: string
): Promise<{ size: number; [key: string]: any }> {
  return new Promise((resolve, reject) => {
    https
      .get(fileUrl, (response) => {
        resolve({
          ...response.headers,
          size: parseInt(response.headers["content-length"] || "0", 10),
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function splitFileIntoChunks(
  fileSize: number,
  chunkSizeInBytes: number
): ChunkLargeFileDownloader[] {
  const chunks: ChunkLargeFileDownloader[] = [];
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

async function downloadChunk(
  fileUrl: string,
  chunk: ChunkLargeFileDownloader,
  destinationFolder: string
): Promise<void> {
  const { startByte, endByte } = chunk;
  const rangeHeader = `bytes=${startByte}-${endByte}`;

  logger(`${chunk?.name} started`);

  return new Promise((resolve, reject) => {
    https
      .get(fileUrl, { headers: { Range: rangeHeader } }, (response) => {
        const file = fs.createWriteStream(
          `${destinationFolder}/${chunk?.name}`
        );
        response.pipe(file);

        file.on("finish", () => {
          file.close(() => {
            logger(`${chunk?.name} downloaded`);
            resolve();
          });
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function padIndex(index: number, length: number): string {
  return index.toString().padStart(length, "0");
}

async function combineChunks(
  destinationFolder: string,
  chuck: ChunkLargeFileDownloader[],
  combinedFilePath: string
): Promise<void> {
  const writeStream = fs.createWriteStream(combinedFilePath);

  for (let i = 0; i < chuck.length; i++) {
    const chunkFilePath = `${destinationFolder}/${chuck[i].name}`;
    const chunkData = await promisify(fs.readFile)(chunkFilePath);
    writeStream.write(chunkData);
  }

  writeStream.end();
  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}

function randomStr(len?: number): string {
  let length = len || 10; // default is 10 char
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return randomString;
}

function isValidUrl(url: string): boolean {
  const urlRegex = new RegExp(
    "^((https?|ftp):\\/\\/)?" + // Protocol (optional)
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // Domain names
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // Port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // Query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  return urlRegex.test(url);
}

export function getFileExt(contentTypeHeader: string): string {
  const mimeType = contentTypeHeader.split(";")[0].trim(); // Extract MIME type (ignore any parameters)
  const extension = mimeTypes.extension(mimeType);

  if (extension) {
    return extension;
  }

  // If the MIME type is not recognized or mapped, return an empty string or handle it as needed
  return "";
}

export function getFileNameFromUrl(url: string): string {
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

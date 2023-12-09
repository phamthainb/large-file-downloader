# large-file-downloader

Large File Downloader is a Node.js package that facilitates efficient downloading of large files by splitting them into smaller, manageable chunks and enabling parallel downloads.

## Installation

You can install the `large-file-downloader` package via npm: `bash npm install large-file-downloader`

## Usage

The `largeFileDownloader` function can be used to download large files with options to specify chunk size, destination folder, and more.

### Example

```typescript
import { largeFileDownloader } from "large-file-downloader";
const fileUrl = "https://example.com/largefile.zip";
const options = {
  chunkSizeInBytes: 10 * 1024 * 1024, // 10 MB chunks
  destinationFolder: "./downloads", // Destination folder path
  cleanTempFiles: true, // Clean temporary files after combining
  logger: true, // Enable logging
};

largeFileDownloader({ fileUrl, ...options })
  .then((result) => {
    console.log("File downloaded successfully:", result.pathFile);
    console.log("Download time:", result.time, "ms");
    console.log("File size:", result.size, "bytes");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## Features

- **Chunked Downloading:** Download large files in smaller, more manageable chunks.
- **Parallel Downloads:** Perform simultaneous downloads of file chunks for faster download speeds.
- **Flexible Options:** Customize chunk size, destination folder, and more.
- **Automatic Cleanup:** Option to automatically clean up temporary files after combining.

## Functionality

The `largeFileDownloader` function orchestrates the download process using the following steps:

1.  Fetches metadata of the file from the provided URL.
2.  Splits the file into smaller chunks based on the specified chunk size.
3.  Downloads individual file chunks in parallel from the URL.
4.  Combines downloaded chunks into a single file at the destination folder.
5.  Optionally cleans up temporary files if specified.

## API

### `largeFileDownloader(data: InputLargeFileDownloader): Promise<OutLargeFileDownloader>`

- `data`: An object containing the following optional parameters:
  - `fileUrl` (string): The URL of the file to be downloaded (required).
  - `chunkSizeInBytes` (number): Size of each file chunk in bytes (default: 5 MB).
  - `destinationFolder` (string): Destination folder to save downloaded chunks (default: './temp').
  - `cleanTempFiles` (boolean): Option to clean up temporary files after combining (default: true).
  - `logger` (boolean): Option to enable or disable logging (default: true).

## Benchmark

```js
// 300MB = 300918835 bytes
// chunkSizeInBytes: 5242880 bytes, time: 15979 ms, total: 300918835 bytes, avg: 18832144.376994807 bytes/s
// chunkSizeInBytes: 10485760 bytes, time: 15698 ms, total: 300918835 bytes, avg: 19169246.7193273 bytes/s
// chunkSizeInBytes: 15728640 bytes, time: 75321 ms, total: 300918835 bytes, avg: 3995151.8832729254 bytes/s
// chunkSizeInBytes: 20971520 bytes, time: 100089 ms, total: 300918835 bytes, avg: 3006512.553827094 bytes/s
// chunkSizeInBytes: 26214400 bytes, time: 125043 ms, total: 300918835 bytes, avg: 2406522.8361443663 bytes/s
// chunkSizeInBytes: 31457280 bytes, time: 149948 ms, total: 300918835 bytes, avg: 2006821.2647050978 bytes/s
// chunkSizeInBytes: 36700160 bytes, time: 174927 ms, total: 300918835 bytes, avg: 1720253.7915816312 bytes/s
// chunkSizeInBytes: 41943040 bytes, time: 200261 ms, total: 300918835 bytes, avg: 1502633.2386235963 bytes/s
// chunkSizeInBytes: 47185920 bytes, time: 225124 ms, total: 300918835 bytes, avg: 1336680.385032249 bytes/s
// chunkSizeInBytes: 52428800 bytes, time: 250117 ms, total: 300918835 bytes, avg: 1203112.2834513448 bytes/s
```

## Contributions

Contributions and feedback are welcome! Feel free to submit issues or pull requests.

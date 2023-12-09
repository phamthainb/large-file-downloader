import { join } from "path";
import { largeFileDownloader } from ".";

// values
const vid10MB = `https://github.com/phamthainb/large-file-downloader/raw/master/sample/10MB.mp4`;
const vid18MB = `https://github.com/phamthainb/large-file-downloader/raw/master/sample/18MB.mp4`;

(async () => {
  const out = await largeFileDownloader({
    fileUrl: vid10MB,
    chunkSizeInBytes: 50 * 1024 * 1024,
    logger: true,
    destinationFolder: join(__dirname, "temp"),
  });

  console.log(out);
})();

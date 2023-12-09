import { join } from "path";
import { largeFileDownloader } from ".";

// values

(async () => {
  const out = await largeFileDownloader({
    fileUrl: ``,
    chunkSizeInBytes: 50 * 1024 * 1024,
    logger: true,
    destinationFolder: join(__dirname, "temp"),
  });

  console.log(out);
})();

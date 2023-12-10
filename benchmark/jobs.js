const { join } = require("path");
const { largeFileDownloader, formatBytes } = require("../dist/index");
const { unlinkSync, appendFileSync } = require("fs");

// 1.2GB
const fileUrl = `http://localhost:3300/1_2GB.mp4`;

(async () => {
  for (let index = 1; index <= 50; index++) {
    try {
      const chuckSize = index * 1024 * 1024; // MB 5 - 50MB
      console.log("started", chuckSize);

      const out = await largeFileDownloader({
        fileUrl,
        chunkSizeInBytes: chuckSize,
        cleanTempFiles: true,
        logger: false,
        destinationFolder: join(__dirname, "..", "sample", "temp"),
      });

      const d = {
        chuckSize: formatBytes(chuckSize), // bytes
        size: formatBytes(out.size), // bytes
        time: `${(out?.time / 1000).toFixed(3)}s`, // s
        avg: `${formatBytes((out.size / (out?.time / 1000)).toFixed(3))}/s`, // bytes/s
      };
      console.log(d);
      appendFileSync(
        join(__dirname, "data.log"),
        `${new Date().toISOString()}: ${JSON.stringify(d)}\n`
      );

      // for clean disk :)
      unlinkSync(out.pathFile);
    } catch (error) {
      appendFileSync(
        join(__dirname, "error.log"),
        `${new Date().toISOString()}: ${JSON.stringify(error)}\n`
      );

      appendFileSync(
        join(__dirname, "data.log"),
        `${new Date().toISOString()}: Error\n`
      );
    }

    console.log("sleep...");
    await new Promise((resolve) => setTimeout(resolve, 10 * 1000)); // sleep for rest
  }
})();

// HTTP/1.1 200 OK
// X-Powered-By: Express
// Accept-Ranges: bytes
// Cache-Control: public, max-age=0
// Last-Modified: Sun, 10 Dec 2023 08:23:39 GMT
// ETag: W/"4d32188a-18c52d32876"
// Content-Type: video/mp4
// Content-Length: 1295128714 -> 1.2GB
// Date: Sun, 10 Dec 2023 08:40:35 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5

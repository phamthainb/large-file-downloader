import { join } from "path";
import { largeFileDownloader } from ".";

// values
const vid = `https://rr8---sn-8pxuuxa-i5oed.googlevideo.com/videoplayback?expire=1702137782&ei=Vjt0Zar5GuPv7OsP-qm08A0&ip=2402%3A800%3A61c5%3A4fd1%3Ab51b%3A916a%3A305a%3A9075&id=o-AHAkplvWsJMg5Hspvw-ReIjJzKIfk-x8YCfvioTiwOVY&itag=137&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278%2C394%2C395%2C396%2C397%2C398%2C399&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Ty&mm=31%2C29&mn=sn-8pxuuxa-i5oed%2Csn-8pxuuxa-i5o6d&ms=au%2Crdu&mv=m&mvi=8&pl=54&gcr=vn&initcwndbps=1935000&spc=UWF9f9oo8w2fbGeKdaToLNLnhmN3c7EcGegaWFaNIA&vprv=1&svpuc=1&mime=video%2Fmp4&ns=tixbzaANSycFqX9As3XWa68P&gir=yes&clen=300918835&dur=2858.120&lmt=1696388277124783&mt=1702115803&fvip=8&keepalive=yes&fexp=24007246&c=WEB&txp=4535434&n=21-JUe4-HIQqRg&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=ANLwegAwRQIgLcV8ipzwmoXFEqRhfiWP93RA_zC0FGwtPnOklR7VSnYCIQCK8NFngmYwALcFDDhbm6DccJk3_rddc2Gvv3xMeehK-Q%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AM8Gb2swRgIhAPxYHo34kfbosEbt4lolpR45SdJqAiJHJSfSFoH30jMNAiEAvR4b8Uz-wEfkoDwDrzvCdCymyhCVCGWpGeuw49rzdys%3D`;

(async () => {
  // 300MB
  for (let index = 0; index < 10; index++) {
    let chunkSizeInBytes = (index + 1) * 5 * 1024 * 1024; // (index * 5) MB
    const out = await largeFileDownloader({
      fileUrl: vid,
      chunkSizeInBytes,
      logger: false,
      destinationFolder: join(__dirname, "temp"),
      cleanTempFiles: false,
    });

    console.log(
      `chunkSizeInBytes: ${chunkSizeInBytes} bytes, time: ${
        out.time
      } ms, total: ${out.size} bytes, avg: ${
        out.size / (out.time / 1000)
      } bytes/s`
    );
  }
})();

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

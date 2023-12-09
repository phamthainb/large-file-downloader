"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const _1 = require(".");
// values
const vid10MB = `https://github.com/phamthainb/large-file-downloader/raw/master/sample/10MB.mp4`;
const vid18MB = `https://file-examples.com/storage/fe625b599465730b594836d/2017/04/file_example_MP4_1920_18MG.mp4`;
const vid = `https://rr8---sn-8pxuuxa-i5oed.googlevideo.com/videoplayback?expire=1702137782&ei=Vjt0Zar5GuPv7OsP-qm08A0&ip=2402%3A800%3A61c5%3A4fd1%3Ab51b%3A916a%3A305a%3A9075&id=o-AHAkplvWsJMg5Hspvw-ReIjJzKIfk-x8YCfvioTiwOVY&itag=137&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278%2C394%2C395%2C396%2C397%2C398%2C399&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Ty&mm=31%2C29&mn=sn-8pxuuxa-i5oed%2Csn-8pxuuxa-i5o6d&ms=au%2Crdu&mv=m&mvi=8&pl=54&gcr=vn&initcwndbps=1935000&spc=UWF9f9oo8w2fbGeKdaToLNLnhmN3c7EcGegaWFaNIA&vprv=1&svpuc=1&mime=video%2Fmp4&ns=tixbzaANSycFqX9As3XWa68P&gir=yes&clen=300918835&dur=2858.120&lmt=1696388277124783&mt=1702115803&fvip=8&keepalive=yes&fexp=24007246&c=WEB&txp=4535434&n=21-JUe4-HIQqRg&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=ANLwegAwRQIgLcV8ipzwmoXFEqRhfiWP93RA_zC0FGwtPnOklR7VSnYCIQCK8NFngmYwALcFDDhbm6DccJk3_rddc2Gvv3xMeehK-Q%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AM8Gb2swRgIhAPxYHo34kfbosEbt4lolpR45SdJqAiJHJSfSFoH30jMNAiEAvR4b8Uz-wEfkoDwDrzvCdCymyhCVCGWpGeuw49rzdys%3D`;
(() => __awaiter(void 0, void 0, void 0, function* () {
    // 300MB
    for (let index = 0; index < 10; index++) {
        let chunkSizeInBytes = (index + 1) * 5 * 1024 * 1024; // (index * 5) MB
        const out = yield (0, _1.largeFileDownloader)({
            fileUrl: vid,
            chunkSizeInBytes,
            logger: false,
            destinationFolder: (0, path_1.join)(__dirname, "temp"),
            cleanTempFiles: false,
        });
        console.log(`chunkSizeInBytes: ${chunkSizeInBytes} bytes, time: ${out.time} ms, total: ${out.size} bytes, avg: ${out.size / (out.time / 1000)} bytes/s`);
    }
}))();
// 300MB = 300918835 bytes
// chuck 10MB -> 16125 ms -> 16s
// chuck 30MB -> 150012 ms -> 150s
// chuck 500MB -> 16125 ms -> 16s

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
(() => __awaiter(void 0, void 0, void 0, function* () {
    const out = yield (0, _1.largeFileDownloader)({
        fileUrl: ``,
        chunkSizeInBytes: 50 * 1024 * 1024,
        logger: true,
        destinationFolder: (0, path_1.join)(__dirname, "temp"),
    });
    console.log(out);
}))();

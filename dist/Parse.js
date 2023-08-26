"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_UPLOADING_FILE = exports.UPLOADING_FILE = void 0;
exports.UPLOADING_FILE = { mx_unad: `UploadingFile` };
function is_UPLOADING_FILE(value) {
    return value?.mx_unad === exports.UPLOADING_FILE.mx_unad;
}
exports.is_UPLOADING_FILE = is_UPLOADING_FILE;

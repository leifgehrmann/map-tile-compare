/* eslint-disable @typescript-eslint/no-var-requires */
const LZString = require('lz-string');

const base64Data = process.argv.slice(2)[0];
// eslint-disable-next-line no-console
console.log(JSON.parse(LZString.decompressFromBase64(base64Data)));

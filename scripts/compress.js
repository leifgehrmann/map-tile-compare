/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const LZString = require('lz-string');

const file = process.argv.slice(2)[0];
fs.readFile(file, 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  // eslint-disable-next-line no-console
  console.log(LZString.compressToBase64(JSON.stringify(JSON.parse(data))));
});

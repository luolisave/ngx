const fs = require('fs');
const d = new Date().toISOString().replace('T',' ').slice(0,19);
fs.writeFileSync('src/app/build-info.ts', `export const BUILD_TIME = '${d}';\n`);

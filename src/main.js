const path = require('path');
const getFiles = require('./lib/getFiles');
const parsePhotoshopLogFile = require('./lib/parsePhotoshopLogFile');

async function main() {
  const files = await getFiles(path.join(__dirname, '..', 'data'), ['ps']);
  let results;

  for (const file of files) {
    results = await parsePhotoshopLogFile(file);
  }

  return results;
}

main().then(console.log);

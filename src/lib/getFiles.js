const fs = require('fs').promises;
const path = require('path');
const fileGroup = {
  ps: /Photoshop.+\.txt$/i,
};

async function getFiles(dir, validGroup, originDir = dir) {
  if (!validGroup) return false;
  let files;
  try {
    files = await fs.readdir(dir);
  } catch (error) {
    console.log('Error in getFiles()');
    console.log(error.message);
  }

  files = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        return getFiles(filePath, validGroup, originDir);
      } else if (stats.isFile()) {
        // valid = ['dti', 'claro', 'easyjob', 'worktime', 'admin'] - populated from getMeta, passed via controller
        let isValid = false;
        validGroup.forEach((el) => {
          if (!fileGroup[el]) throw new Error(`We need ${el} key defined in fileGroup constant.`);
          if (fileGroup[el].test(path.basename(filePath))) isValid = el;
        });

        if (isValid) {
          const uniqueName = filePath.replace(originDir, '.');
          return { path: filePath, group: isValid, name: uniqueName, size: stats.size, t_created: stats.birthtimeMs, t_modified: stats.birthtimeMs, t_parsed: new Date().getTime() };
        } else {
          return false;
        }
      }
    })
  );
  return files.reduce((all, folderContents) => all.concat(folderContents), []).filter((el) => el);
}

module.exports = getFiles;


const fs = require('fs');
const path = require('path');

const folderPath = './dist';

function clearFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        if (stats.isDirectory()) {
          clearFolder(filePath);
        } else {
          fs.unlink(filePath, err => { 
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('File deleted:', filePath);
            }
          });
        }
      });
    });
  });
}

clearFolder(folderPath);

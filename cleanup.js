const fs = require('fs');
const path = require('path');

const folderPath = './dist'; // Укажите путь к папке nodejs

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
          clearFolder(filePath); // Рекурсивно очищаем вложенные папки
        } else {
          fs.unlink(filePath, err => { // Удаляем файл
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

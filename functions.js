const fs = require('fs')
const pathLib = require('path')
const path = require('path');

// Determina si es una ruta válida
const validatePath = (firstPath) => {
  return fs.existsSync(firstPath)
}

// Determina si la ruta es absoluta
const absoluteFilePath = (secondPath) => {
  return path.isAbsolute(secondPath)
}

// Transforma las rutas en absolutas
const transformPath = (thirdPath) => {
    return path.resolve(thirdPath);
  } 

// Determina si es un directorio
const isADirectory = (fourthPath) => {
  if (fs.statSync(fourthPath).isDirectory()) {
    return true;
  } else {
    return false;
  }
}

// Determina si es un archivo .md
const isAMdFile = (fifthPath) => {
  if (path.extname(fifthPath).toLowerCase() === '.md') {
    return true;
  } else {
    return false;
  }
}

// Determina si el directorio está vacío
function emptyDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.length === 0);
      }
    });
  });
}

//Determina si hay archivos .md
const hasMdFiles = (dir) => {
  return new Promise((resolve, reject) => {
    let foundMdFiles = [];
    let allMdFiles = []; 
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const promises = files.map((file) => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            return hasMdFiles(filePath)
              .then((subdirMdFiles) => {
                allMdFiles = allMdFiles.concat(subdirMdFiles);
              })
              .catch((err) => {
                console.error(err);
              });
          } else if (path.extname(file) === '.md') {
            foundMdFiles.push(filePath);
            return Promise.resolve();
          } else {
            return Promise.resolve();
          }
        });

        Promise.all(promises)
          .then(() => {
            resolve(foundMdFiles.concat(allMdFiles)); 
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  });
};

hasMdFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas')
.then((result) => {
  console.log(result);
})
.catch((error) => {
  console.error(error);
});

// Extrae los links desde archivos .md
const extractLinksFromFiles = (path) => {
  let links = [];
  try {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
      const absolutePath = pathLib.resolve(path, file);
      const stats = fs.statSync(absolutePath);
      if (stats.isDirectory()) {
        links = links.concat(extractLinksFromFiles(absolutePath));
      } else if (isAMdFile(file)) {
        const archivoMD = fs.readFileSync(absolutePath, "utf-8");
        const regex = /\[(.*)\]\((http[s]?:\/\/[^\)]*)\)/gm;
        let match;
        while ((match = regex.exec(archivoMD))) {
          const link = {
            href: match[2],
            text: match[1],
            file: absolutePath,
          };
          links.push(link);
        }
      }
    });
  } catch (error) {
    console.error(error.message);
  }
  return links;
};

console.log(extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/NoExiste.md'));

module.exports = {
  validatePath,
  absoluteFilePath, 
  transformPath,
  isADirectory,
  isAMdFile,
  emptyDirectory,
  hasMdFiles,
  extractLinksFromFiles,
}
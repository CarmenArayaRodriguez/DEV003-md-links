const fs = require('fs')
const path = require('path');

// Determina si es una ruta válida
const validatePath = (firstPath) => {
  return fs.existsSync(firstPath)
}

// Determina si la ruta es absoluta
const absolutePath = (secondPath) => {
  return path.isAbsolute(secondPath)
}

// Transforma ruta relativa en absoluta
const transformPath = (thirdPath) => {
  return path.resolve(thirdPath);
} 

// Determina si una ruta es un directorio
const isADirectory = (fourthPath) => {
  return fs.statSync(fourthPath).isDirectory();
}

// Determina si un archivo es .md
const isAMdFile = (fifthPath) => {
  return path.extname(fifthPath).toLowerCase() === '.md';
}

// Indica si un directorio está vacío
const emptyDirectory = (sixthPath, callback) => {
  return fs.readdir(sixthPath, callback);
}

// //Indica si un directorio tiene archivos .md
const containsMdFiles = (seventhPath) => {
  fs.readdir(seventhPath, (error, files) => {
    if (error) {
      console.error(error);
      return;
}

   // Buscar archivos .md en un directorio
const hasMdFiles = (dir) => {
  let mdFiles = [];

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      mdFiles = mdFiles.concat(hasMdFiles(filePath));
    } else if (path.extname(file) === '.md') {
      mdFiles.push(filePath);
    }
  });

  return mdFiles;
};
  });
};

// Lee el archivo e imprime el contenido
const readingAFile = (eighthPath,callback) => {
  fs.readFile(eighthPath, 'utf8', (error, data) => {
        if (error) {
       callback(error);
  } else{
    callback(null, data);
    }
  });
};

// Extraer links
const extractLinksFromFile = (directory) => {
  let links = [];
  try {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        links = links.concat(extractLinksFromFile(filePath));
      } else if (path.extname(file) === ".md") {
        const archivoMD = fs.readFileSync(filePath, "utf-8");
        const regex = /\[(.*)\]\((http[s]?:\/\/[^\)]*)\)/gm;
        let match;
        while ((match = regex.exec(archivoMD))) {
          const link = {
            href: match[2],
            text: match[1],
            file: filePath,
          };
          links.push(link);
        }
      }
    });
   } catch (error) {
    console.error(`Error al leer el directorio: ${directory}`, error);
   }
  return links;
}

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    // Identificar si la ruta existe
    if (validatePath(path)) {
      // Identificar si la ruta es un directorio 
      if  (isADirectory(path)) {
        // Decir que la ruta es un directorio
        const messageDirectory = `La ruta ${path} es un directorio`;
        // Identificar que un directorio está vacío
        emptyDirectory(path, (err, files) => {
          if (err) {
            reject(err);
          } else {
            if (files.length === 0) {
              // Decir que el directorio está vacío
              const messageEmptyDir = `La ruta ${path} es un directorio vacío`;
              resolve(`${messageDirectory} y es absoluta. ${messageEmptyDir}`)
            } else {
              // Verificar si el directorio contiene archivos .md
              const mdFiles = extractLinksFromFile(path);
              if (mdFiles.length > 0) {
                resolve(mdFiles);
              } else {
                resolve(`La ruta ${path} no contiene archivos .md`);
              }
            }
            // Identificar si la ruta del directorio es absoluta
            if (absolutePath(path)) {
              resolve(`${messageDirectory} y es absoluta`);
            } else {
              // Transformar la ruta relativa en absoluta
              const absolutePath = transformPath(path);
              // La nueva ruta
              resolve(`La nueva ruta es : ${absolutePath}`);
            }
          }
        });
      } else {
        // Verificar si el archivo es .md
        if (isAMdFile(path)) {
          const links = extractLinksFromFile(path);
          resolve(links);
        } else {
          resolve(`La ruta ${path} no es un archivo .md`);
        }
        // Identificar si la ruta es absoluta
        if (absolutePath(path)) {
          resolve(`La ruta ${path} es absoluta`);
        } else {
          // Transformar la ruta relativa en absoluta
          const absolutePath = transformPath(path);
          // La nueva ruta
          resolve(`La nueva ruta es : ${absolutePath}`);
        }
      }
    } else {
      reject(`La ruta ${path} no existe`);
    }
  });
};

module.exports = {
  mdLinks,
  validatePath,
  absolutePath,
  transformPath,
  isADirectory,
  isAMdFile,
  emptyDirectory,
  containsMdFiles,
  readingAFile,
  extractLinksFromFile,
};
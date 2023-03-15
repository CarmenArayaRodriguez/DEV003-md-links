const fs = require('fs')
const path = require('path');

const validatePath = (firstPath) => {
  return fs.existsSync(firstPath)
}

const absolutePath = (secondPath) => {
  return path.isAbsolute(secondPath)
}

const transformPath = (thirdPath) => {
  return path.resolve(thirdPath);
} 

const isADirectory = (fourthPath) => {
  return fs.statSync(fourthPath).isDirectory();
}

const isAMdFile = (fifthPath) => {
  return path.extname(fifthPath).toLowerCase() === '.md';
}

const emptyDirectory = (sixthPath, callback) => {
  return fs.readdir(sixthPath, callback);
}

const containsMdFiles = (seventhPath) => {
  fs.readdir(seventhPath, (error, files) => {
    if (error) {
      console.error(error);
      return;
}
   // Buscar archivos .md en un directorio
   const hasMdFiles = files.some(file => path.extname(file) === '.md');
   if (hasMdFiles) {
     console.log('El directorio contiene archivos .md:');
     console.log(files)
   } else {
     console.log('El directorio no contiene archivos .md');
   }
 });
};

const mdLinks = (path, options) => {
  // let messageEmptyDir;
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
            }else {
            // Verificar si el directorio contiene archivos .md
            containsMdFiles(path);
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
        }
      });
    } else if (isAMdFile(path)) {
        // Decir que la ruta es un archivo .md
        const messageMdFile = `La ruta ${path} es un archivo .md`;
        // Identificar si la ruta del archivo .md es absoluta
        if (absolutePath(path)) {
          resolve(`${messageMdFile}`);
        } else {
          // Transformar la ruta relativa en absoluta
          const absolutePath = transformPath(path);
          // La nueva ruta
          resolve(messageMdFile  + `La nueva ruta es : ${absolutePath}`);
        }
      } else {
        reject(`La ruta ${path} no es un directorio ni un archivo .md`);
      }
    } else {
      // Si no existe la ruta se rechaza la promesa.
      reject('La ruta no existe'); 
    }
  });
};

module.exports = {
  mdLinks,
 
};

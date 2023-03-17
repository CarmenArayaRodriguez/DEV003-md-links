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

//Indica si un directorio tiene archivos .md
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
        // Leer el archivo e imprimir el contenido
        readingAFile(path, (error, data) => {
          if (error) {
            reject(error);
          } else {
            console.log(data);
            resolve(messageMdFile);
          }
        });
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

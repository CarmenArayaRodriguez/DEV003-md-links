const fs = require('fs')
const path = require('path')
const { validatePath, absoluteFilePath, transformPath, isADirectory, isAMdFile, emptyDirectory,  hasMdFiles, extractLinksFromFiles, } = require('./functions');

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    // Identificar si la ruta existe
    if (validatePath(path)) {
      // Identificar si la ruta es un directorio 
      if (isADirectory(path)) {
      // Identificar que un directorio está vacío
        emptyDirectory(path)
          .then((isEmpty) => {
            if (isEmpty) {
              // Decir que el directorio está vacío
              const messageEmptyDir = `La ruta ${path} es un directorio vacío`;
              const messageDirectory = `La ruta ${path} existe`;
              resolve(`${messageDirectory} y es absoluta. ${messageEmptyDir}`)
            } else {
              // Verificar si el directorio contiene archivos .md
              hasMdFiles(path)
              .then(() => {
                const links = extractLinksFromFiles(path);
                resolve(links);
              })
              .catch((err) => {
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
      } else {
        // Verificar si el archivo es .md
        if (isAMdFile(path)) {
          const links = extractLinksFromFiles([path]);
          resolve(links);
        } else {
          resolve(`La ruta ${path} no es un archivo .md`);
        }
        // Identificar si la ruta es absoluta
        if (absoluteFilePath(path)) {
          resolve(`La ruta ${path} es absoluta`);
        } else {
          // Transformar la ruta relativa en absoluta
          const absoluteFilePath = transformPath(path);
          // La nueva ruta
          resolve(`La nueva ruta es : ${absoluteFilePath}`);
        }
      }
    } else {
      reject(`La ruta ${path} no existe`);
    }
  });
};

module.exports = {
  mdLinks,
};
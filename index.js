const { validatePath, absoluteFilePath, transformPath, isADirectory, isAMdFile, emptyDirectory, hasMdFiles, getLinks, extractLinksFromFiles, httpStatus, linkStats, linkStatsComplete } = require('./functions');

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
              resolve(`${messageDirectory} y es absoluta. ${messageEmptyDir}`);
            } else {
              extractLinksFromFiles(path)
                .then((links) => {
                  if (options && options.validate) {
                    return httpStatus(links).then((statusLinks) => {
                      if (options.stats) {
                        const stats = linkStatsComplete(statusLinks);
                        resolve(stats);
                      } else {
                        resolve(statusLinks);
                      }
                    });
                  } else if (options && options.stats) {
                    const stats = linkStats(links);
                    resolve(stats);
                  } else {
                    resolve(links);
                  }
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
          extractLinksFromFiles(path)
            .then((links) => {
              if (options && options.validate) {
                return httpStatus(links).then((statusLinks) => {
                  if (options.stats) {
                    const stats = linkStatsComplete(statusLinks);
                    resolve(stats);
                  } else {
                    resolve(statusLinks);
                  }
                });
              } else if (options && options.stats) {
                const stats = linkStats(links);
                resolve(stats);
              } else {
                resolve(links);
              }
            })
            .catch((err) => {
              reject(err);
            });
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

mdLinks('/Users/carmen/Desktop/DEV003-md-links/Pruebas', { validate: true, stats: true })
  .then((links) => {
    console.log(links);
  })
  .catch((err) => {
    console.error(err);
  });


module.exports = {
  mdLinks,
};

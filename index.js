const { validatePath, absoluteFilePath, transformPath, isADirectory, isAMdFile, emptyDirectory,  hasMdFiles, getLinks, extractLinksFromFiles, linkStats } = require('./functions');

  const mdLinks = (path, options = {}) => {
    return new Promise((resolve, reject) => {
      // Verificar si se requiere linkStats
      if (options.linkStats) {
        const links = options.fromFiles ? extractLinksFromFiles(path) : getLinks(path);
        const stats = linkStats(links);
        resolve(stats);
        return;
      }
  
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
                // Verificar si el directorio contiene archivos .md
                hasMdFiles(path)
                  .then(() => {
                    const links = options.fromFiles ? extractLinksFromFiles(path) : getLinks(path);
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
            // Identificar si la ruta es absoluta
            if (absoluteFilePath(path)) {
              resolve(`La ruta ${path} es absoluta y se encontraron los siguientes enlaces:\n${links.join("\n")}`);
            } else {
              // Transformar la ruta relativa en absoluta
              const absoluteFilePath = transformPath(path);
              // La nueva ruta
              resolve(`La nueva ruta es : ${absoluteFilePath} y se encontraron los siguientes enlaces:\n${links.join("\n")}`);
            }
          } else {
            resolve(`La ruta ${path} no es un archivo .md`);
          }
        }
      } else {
        reject(`La ruta ${path} no existe`);
      }
    });
  };
  
  mdLinks('/Users/carmen/Desktop/DEV003-md-links/Pruebas', { fromFiles: false, getLinks: false, linkStats: true, })
    .then((stats) => {
      console.log(stats);
    })
    .catch((err) => {
      console.error(err);
    });
  
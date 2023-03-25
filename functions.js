const fs = require('fs')
const path = require('path')
const pathLib = require('path')
const http = require('https')
const url = require ('url')
const axios = require('axios');

const statusLinks = [
  {
    href: 'https://www.24horas.cl/',
    text: '24 Horas',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',
    status: 'OK - 200'
  },
  {
    href: 'https://www.cnnchile.com/',
    text: 'CNN Chile Lorem ipsum dolor sit amet, consectetuer',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',
    status: 'OK - 200'
  },
  {
    href: 'https://es-la.facebook.com/',
    text: 'Facebook',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/hola.md',
    status: 'Fail - 302'
  },
  {
    href: 'https://github.com/',
    text: 'GitHub',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/bye.md',
    status: 'OK - 200'
  },
  {
    href: 'https://www.google.com',
    text: 'Google',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md',
    status: 'OK - 200'
  },
  {
    href: 'https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions',
    text: 'Enlace roto',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md',
    status: 'Fail - 404'
  },
  {
    href: 'https://www.google.com',
    text: 'Google',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md',
    status: 'OK - 200'
  },
]
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
// hasMdFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas')
// .then((result) => {
//   console.log(result);
// })
// .catch((error) => {
//   console.error(error);
// });

// Extrae los links de archivos .md
const getLinks = (dirPath) => {
  const linksRegex = /\[([^\]]+)]\((http[s]?:\/\/[^\)]+)\)/gm;
  const links = [];
  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isFile()) {
      const fileContent = fs.readFileSync(itemPath, 'utf-8');
      let match;
      while ((match = linksRegex.exec(fileContent))) {
        links.push({
          href: match[2],
          text: match[1].slice(0, 50),
          file: itemPath,
        });
      }
    } else if (stats.isDirectory()) {
      const subLinks = getLinks(itemPath);
      links.push(...subLinks);
    }
  });

  return links;
};

// const printlinks = getLinks('/Users/carmen/Desktop/DEV003-md-links/Pruebas');
// console.log(printlinks)

// Extrae los links desde archivos .md y entrega el status
const extractLinksFromFiles = (path) => {
  return new Promise((resolve, reject) => {
    let links = [];
    try {
      if (!fs.existsSync(path)) { 
        resolve([]);
        return;
      }
      const stats = fs.statSync(path);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(path);
        const promises = [];
        files.forEach((file) => {
          const absolutePath = pathLib.resolve(path, file);
          const subLinksPromise = extractLinksFromFiles(absolutePath);
          promises.push(subLinksPromise);
          subLinksPromise.then(subLinks => {
            links = links.concat(subLinks);
          });
        });
        Promise.all(promises).then(() => {
          if (links.length === 0) {
            resolve([]);
          } else {
            resolve(links);
          }
        });
      } else if (fs.existsSync(path) && isAMdFile(path)) {
        const archivoMD = fs.readFileSync(path, "utf-8");
        const regex = /\[(.*)\]\((http[s]?:\/\/[^\)]*)\)/gm;
        let match;
        const promises = [];
        while ((match = regex.exec(archivoMD))) {
          const link = {
            href: match[2],
            text: match[1].slice(0,50),
            file: path,
            status: "",
          };
          links.push(link);
          const options = url.parse(link.href);
          options.method = "HEAD";
          const promise = new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
              const status = res.statusCode;
              if (status >= 200 && status < 300) {
                link.status = `OK - ${status}`;
              } else {
                link.status = `Fail - ${status}`;
              }
              resolve();
            });
            req.on("error", (err) => {
              console.error(`Error al hacer la solicitud: ${err.message}`);
              resolve();
            });
            req.end();
          });
          promises.push(promise);
        }
        Promise.all(promises).then(() => {
          if (links.length === 0) {
            resolve([]);
          } else {
            resolve(links);
          }
        });
      } else {
        resolve([]);
      }
    } catch (error) {
      console.error(error.message);
      reject(error);
    }
  });
};
// extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas')
//   .then(links => {
//     console.log(links);
//   })
//   .catch(error => {
//     console.error(error);
//   });

// Determina el status http
const httpStatus = (url) => {
  return axios
    .get(url, { validateStatus: () => true })
    .then((response) => {
      return response.status;
    })
    .catch((error) => {
      if (error.response) {
        throw error.response;
      } else if (error.request) {
        throw { statusCode: 500 };
      } else {
        throw error;
      }
    });
};

// Entrega el total de links y la cantidad de links únicos 
const linkStats = (array) => {
  const total = `${array.length}`;
  const unique = (() => {
    const unique = new Set(array.map((link) => link.href));
    return `${unique.size}`;
  })();
  return {
    total,
    unique,
  };
};
// console.log(linkStats(statusLinks))

//// Entrega el total de links, la cantidad de links únicos y la cantidad de links rotos 
const linkStatsComplete = (array) => {
  const total = `${array.length}`;
  const unique = (() => {
    const unique = new Set(array.map((link) => link.href));
    return `${unique.size}`;
  })();
  const broken = (() => {
    const broken = array.filter((link) => {
      const statusCode = link.status.match(/\d+/)[0]; 
      return statusCode >= 400 || statusCode < 200; 
    });
    return `${broken.length}`;
  })();

  return {
    total,
    unique,
    broken
  };
};
// console.log(linkStatsComplete(statusLinks))

module.exports = {
  validatePath,
  absoluteFilePath, 
  transformPath,
  isADirectory,
  isAMdFile,
  emptyDirectory,
  hasMdFiles,
  getLinks,
  extractLinksFromFiles,
  httpStatus,
  linkStats,
  linkStatsComplete,
}
const axios = require('axios');
const fs = require('fs')
const path = require('path')
const pathLib = require('path')
const http = require('https')
const url = require('url')

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
    href: 'https://github.com/',
    text: 'GitHub',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/bye.md',
    status: 'OK - 200'
  },
  {
    href: 'https://es-la.facebook.com/',
    text: 'Facebook',
    file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/hola.md',
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
    status: 'Fail - Request failed with status code 404'
  }
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

//Determina si hay archivos .md y devuelve la ruta
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
const extractLinksFromFiles = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        resolve([]);
        return;
      }
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(filePath);
        const promises = files.map((file) => {
          const subFilePath = path.join(filePath, file);
          return extractLinksFromFiles(subFilePath);
        });
        Promise.all(promises).then((subLinks) => {
          const links = subLinks.flat();
          resolve(links);
        }).catch((error) => {
          console.error(`Error al procesar las promesas: ${error.message}`);
          reject(error);
        });
      } else if (isAMdFile(filePath)) {
        const archivoMD = fs.readFileSync(filePath, 'utf-8');
        const regex = /\[(.*)\]\((http[s]?:\/\/[^\)]*)\)/gm;
        const links = [];
        let match;
        while ((match = regex.exec(archivoMD))) {
          const link = {
            href: match[2],
            text: match[1].slice(0, 50),
            file: filePath,
          };
          links.push(link);
        }
        resolve(links);
      } else {
        resolve([]);
      }
    } catch (error) {
      console.error(`Error al procesar la ruta: ${error.message}`);
      reject(error);
    }
  });
};


// Obtener el estado de cada enlace y devolver una lista completa de enlaces con su estado
const httpStatus = (links) => {
  const promises = links.map((link) => {
    return axios
      .get(link.href)
      .then((response) => {
        link.status = {
          code: response.status,
          message: response.statusText,
        };
        return link;
      })
      .catch((error) => {
        link.status = {
          code: error.code,
          message: error.message,
        };
        return link;
      });
  });

  return Promise.all(promises);
};


// Entrega el total de links y la cantidad de links únicos 
const linkStats = (array) => {
  const links = array.length;

  const href = new Set(array.map((link) => link.href)).size;
  return {
    total: links,
    unique: href
  };
};
// console.log(linkStats(statusLinks))

// Entrega el total de links, la cantidad de links únicos y la cantidad de links rotos 
const linkStatsComplete = (links) => {
  if (!Array.isArray(links)) return { total: 0, unique: 0, broken: 0 };
  const stats = {
    total: 0,
    unique: 0,
    broken: 0,
  };

  const hrefs = new Set();

  links.forEach((link) => {
    stats.total++;

    if (!hrefs.has(link.href)) {
      hrefs.add(link.href);
      stats.unique++;
    }

    if (link.status && link.status.code !== 200) {
      stats.broken++;
    }
  });

  return stats;
};


// console.log(linkStatsComplete(statusLinks));

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
const fs = require('fs')
const path = require('path')
const pathLib = require('path')
const http = require('https')
const url = require ('url')
const axios = require('axios');

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
            text: match[1],
            file: path,
            status: "",
          };
          links.push(link);
          console.log(`Encontrado link: ${link.text} (${link.href}) en archivo: ${path}`);
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

extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas')
  .then(links => {
    console.log(links);
  })
  .catch(error => {
    console.error(error);
  });

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

module.exports = {
  validatePath,
  absoluteFilePath, 
  transformPath,
  isADirectory,
  isAMdFile,
  emptyDirectory,
  hasMdFiles,
  extractLinksFromFiles,
  httpStatus,
}
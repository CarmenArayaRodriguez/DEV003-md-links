
 const fs = require('fs')
const path = require('path');

const validatePath = (firstPath) => {
  return fs.existsSync(firstPath)
}
// console.log(validatePath(path));

const absolutePath = (secondPath) => {
  return path.isAbsolute(secondPath)
}
// console.log(absolutePath('/Users/carmen/Desktop/DEV003-md-links/README.md'))

const transformPath = (thirdPath) => {
    return path.resolve(thirdPath);
  } 
// console.log(path.resolve('README.md'));

const isADirectory = (fourthPath) => {

//   if (fs.statSync(fourthPath).isDirectory()) {
//     return 'La ruta es un directorio';
//   } else {
//     return 'La ruta no es un directorio';
//   }
}
// console.log(isADirectory('README.md'))

// const isAMdFile = (fifthPath) => {
//   if (path.extname(fifthPath).toLowerCase() === '.md') {
//     return 'La ruta es un archivo .md';
//   } else {
//     return 'La ruta no es un archivo .md';
//   }
// }
// console.log(isAMdFile('README.md'))

// const emptyDirectory = (sixthPath) => {
//   fs.readdir(sixthPath,(error, files) =>{
//   if (error) {
//     console.error(error);
//     return;
//   }
//   if(files.length === 0) {
//     console.log('El directorio está vacío')
//   }else{
//     // console.log('El directorio contiene:')
//     // console.log(files);
//   }
// });
// };
// emptyDirectory('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorio vacio')

// const containsMdFiles = (seventhPath) => {
//   fs.readdir(seventhPath, (error, files) => {
//    if (error) {
//      console.error(err);
//      return;
//    }
//  // Buscar archivos .md en un directorio
//  let hasMdFiles = false;
//  for (const file of files) {
//    if (path.extname(file) === '.md') {
//      hasMdFiles = true;
//      break;
//    }
//  }
//  if (hasMdFiles) {
//    console.log('El directorio contiene archivos .md:');
//    console.log(files)
//  } else {
//    console.log('El directorio no contiene archivos .md');
//  }
//  });
//  };
//  containsMdFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorio con md')
 
const readFile = (eighthPath,callback) => {
  fs.readFile(eighthPath, 'utf8', (data) => {
        if (error) {
       console.error(error);
     return;
        }
        callback(data)
  });
};
  // readFile('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioConMd/bye.md', (data) => {
  //   console.log(data);
  // });
 
// module.exports = {
//   validatePath,
//   // absolutePath,
// };

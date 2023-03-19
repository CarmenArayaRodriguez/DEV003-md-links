const { validatePath, absolutePath, transformPath, isADirectory, isAMdFile, emptyDirectory, containsMdFiles, readingAFile } = require('../index.js');

describe('validatePath', () => {
  it('Debería devolver true si la ruta existe', () => {
    const result = validatePath('/Users/carmen/Desktop/DEV003-md-links/README.md');
    expect(result).toBe(true);
  });
  it('Debería devolver false si la ruta no existe', () => {
  const result = validatePath('/ruta-no-existe');
  expect(result).toBe(false);
  });
});

describe('absolutePath', () => {
  it('Debería devolver true si la ruta es absoluta', () => {
    const result = absolutePath('/Users/carmen/Desktop/DEV003-md-links/README.md');
    expect(result).toBe(true);
  });
  it('Debería devolver false si la ruta es relativa', () => {
  const result = absolutePath('Pruebas/TEXT.md');
  expect(result).toBe(false);
  });
});

describe('transformPath', () => {
  it('Debería devolver la ruta en absoluta', () => {
    const result = transformPath('/Users/carmen/Desktop/DEV003-md-links/README.md');
    expect(result).toBe('/Users/carmen/Desktop/DEV003-md-links/README.md');
  });
  it('Debería devolver la ruta en absoluta', () => {
    const result = transformPath('Pruebas/TEXT.md');
    expect(result).toBe('/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md');
  });
});
  
describe('isADirectory', () => {
  it('Debería devolver true si la ruta es un directorio', () => {
    const result = isADirectory('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioSinMd');
    expect(result).toBe(true);
  });
  it('Debería devolver false si la ruta no es un directorio', () => {
    const result = isADirectory('Pruebas/TEXT.md');
    expect(result).toBe(false);
  });
});

describe('isAMdFile', () => {
  it('Debería devolver true si es un archivo .md', () => {
    const result = isAMdFile('Pruebas/TEXT.md');
    expect(result).toBe(true);
  });
  it('Debería devolver false si no es un archivo .md', () => {
    const result = isAMdFile('Pruebas/directorioSinMd/HOLA.pdf');
    expect(result).toBe(false);
  });
});

describe('emptyDirectory', () => {
  it('Debería devolver true si la carpeta está vacía', () => {
    expect(emptyDirectory('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioVacio')).toBe(true);
  });
  it('Debería devolver false si la carpeta no está vacía', () => {
    expect(emptyDirectory('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioSinMd')).toBe(false);
  });
});
  
describe('containsMdFiles', () => {
  it('Debería devolver un array con los archivos .md', () => {
    const result = containsMdFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioConMd');
    expect(result).toEqual(['bye.md', 'hello.md']);
  });
  it('Debería devolver un array vacío si no hay archivos .md', () => {
    const result = containsMdFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioSinMd');
    expect(result).toEqual([]);
  });
});

describe('readingAFile', () => {
  it('Debería devolver ', () => {
    const result = readingAFile('/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md');
    expect(result).toEqual(['Hola', 'Esto es una prueba', '[Hola Google](https://www.google.com)']);
  });
  it('Debería devolver ', () => {
    const result = readingAFile('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioSinMd');
    expect(result).toEqual([]);
  });
});










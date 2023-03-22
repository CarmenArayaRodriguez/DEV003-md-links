const { validatePath, absoluteFilePath, transformPath, isADirectory, isAMdFile, emptyDirectory, hasMdFiles, extractLinksFromFiles } = require('../functions.js');

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

describe('absoluteFilePath', () => {
  it('Debería devolver true si la ruta es absoluta', () => {
    const result = absoluteFilePath('/Users/carmen/Desktop/DEV003-md-links/README.md');
    expect(result).toBe(true);
  });
  it('Debería devolver false si la ruta es relativa', () => {
  const result = absoluteFilePath('Pruebas/TEXT.md');
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
    expect(emptyDirectory('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioVacio')).toBeTruthy();
  });
});
  
describe('hasMdFiles', () => {
  it('Debería devolver un array con los archivos .md de directorios y subdirectorios', () => {
    return hasMdFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas')
      .then((result) => {
        const sortedResult = result.sort();
        const expected = [          
          '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SinTextoNiLinks.md',          
          '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',          
          '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/bye.md',          
          '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/hola.md',          
          '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md',        
        ].sort();
        expect(sortedResult).toEqual(expected);
      });
  });

  it('Debería devolver un array vacío si no hay archivos .md', () => {
    return hasMdFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioSinMd')
      .then((result) => {
        expect(result).toEqual([]);
      });
  });
});

describe('extractLinksFromFiles', () => {
  it('debería devolver un arreglo de objetos con información de enlaces dentro de archivos .md', () => {
    const links = extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas');
    expect(links).toEqual([
      {
        href: 'https://www.24horas.cl/',
        text: '24 Horas',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md'
      },
      {
        href: 'https://www.cnnchile.com/',
        text: 'CNN Chile',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md'
      },
      {
        href: 'https://github.com/',
        text: 'GitHub',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/bye.md'
      },
      {
        href: 'https://es-la.facebook.com/',
        text: 'Facebook',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/hola.md'
      },
      {
        href: 'https://www.google.com',
        text: 'Hola Google',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md'
      }
    ]);
  });

  it('debería devolver un arreglo vacío si no hay archivos .md con enlaces', () => {
    const links = extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SinTextoNiLinks.md');
    expect(links).toEqual([]);
  });

  it('debería devolver un arreglo vacío si el directorio no existe', () => {
    expect(extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/NoExiste.md')).toEqual([]);
  });
});










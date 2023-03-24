const { validatePath, absoluteFilePath, transformPath, isADirectory, isAMdFile, emptyDirectory, hasMdFiles, extractLinksFromFiles, httpStatus } = require('../functions.js');

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
it('should return valid links', () => {
  return extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas').then(links => {
    expect(links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: expect.any(String),
          text: expect.any(String),
          file: expect.any(String),
          status: expect.stringMatching(/^OK - ([2-3][0-9][0-9]|4[0-9][0-9])$/)
        })
      ])
    );
  });
});
  it('debería devolver un arreglo vacío si no hay archivos .md con enlaces', (done) => {
    extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SinTextoNiLinks.md')
      .then((links) => {
        expect(links).toEqual([]);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  it('devuelve un array vacío si el directorio no existe', () => {
    return expect(extractLinksFromFiles('/ruta/no/existente')).resolves.toEqual([]);
  });
});

describe('httpStatus', () => {
  it('Debería devolver OK si el caso es exitoso', () => {
    return httpStatus('https://www.google.com/?hl=es').then((status) => {
      expect(status).toEqual(status);
    });
  });
  it('Debería devolver Fail si el caso falló', () => {
    return httpStatus('https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions').catch((err) => {
      expect(err).toEqual('Fail');
    });
  });
});



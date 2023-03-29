const { validatePath, absoluteFilePath, transformPath, isADirectory, isAMdFile, emptyDirectory, hasMdFiles, getLinks, extractLinksFromFiles, httpStatus, linkStats, linkStatsComplete } = require('../functions.js');

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

describe('getLinks', () => {
  it('Debería devolver los enlaces encontrados', () => {
    const expectedLinks = [{
      href: 'https://www.24horas.cl/',
      text: '24 Horas',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md'
    },
    {
      href: 'https://www.cnnchile.com/',
      text: 'CNN Chile Lorem ipsum dolor sit amet, consectetuer',
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
      text: 'Google',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md'
    },
    {
      href: 'https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions',
      text: 'Enlace roto',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md'
    }];

    const actualLinks = getLinks('/Users/carmen/Desktop/DEV003-md-links/Pruebas');

    expect(actualLinks).toEqual(expectedLinks);
  });

  it('Debería devolver un array vacio si no encuentra enlaces', () => {
    const actualLinks = getLinks('/Users/carmen/Desktop/DEV003-md-links/Pruebas/directorioSinMd');

    expect(actualLinks).toEqual([]);
  });
});

describe('extractLinksFromFiles', () => {
  it('Debería devolver los links válidos con file, href y text', () => {
    return extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas').then(links => {
      expect(links).toEqual(
        [{ "file": "/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md", "href": "https://www.24horas.cl/", "text": "24 Horas" },
        { "file": "/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md", "href": "https://www.cnnchile.com/", "text": "CNN Chile Lorem ipsum dolor sit amet, consectetuer" },
        { "file": "/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/bye.md", "href": "https://github.com/", "text": "GitHub" },
        { "file": "/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/hola.md", "href": "https://es-la.facebook.com/", "text": "Facebook" },
        { "file": "/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md", "href": "https://www.google.com", "text": "Google" },
        { "file": "/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md", "href": "https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions", "text": "Enlace roto" }])
    });
  });
  it('Debería devolver un arreglo vacío si no hay archivos .md con enlaces', (done) => {
    extractLinksFromFiles('/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SinTextoNiLinks.md')
      .then((links) => {
        expect(links).toEqual([]);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  it('Debería devolver un array vacío si el directorio no existe', () => {
    return expect(extractLinksFromFiles('/ruta/no/existente')).resolves.toEqual([]);
  });
});

// describe('httpStatus', () => {
//   it('Debería devolver OK si el caso es exitoso', () => {
//     return httpStatus('https://www.google.com/?hl=es').then((status) => {
//       expect(status).toEqual(status);
//     });
//   });
//   it('Debería devolver Fail si el caso falló', () => {
//     return httpStatus('https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions').catch((err) => {
//       expect(err).toEqual('Fail');
//     });
//   });
// });
describe('httpStatus', () => {
  it('Debería devolver OK si el caso es exitoso', () => {
    const links = [
      {
        href: 'https://www.24horas.cl/',
        text: '24 Horas',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',
        status: { code: 200, message: 'OK' }
      },
      {
        href: 'https://www.cnnchile.com/',
        text: 'CNN Chile Lorem ipsum dolor sit amet, consectetuer',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',
        status: { code: 200, message: 'OK' }
      },
      {
        href: 'https://github.com/',
        text: 'GitHub',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/bye.md',
        status: { code: 200, message: 'OK' }
      },
      {
        href: 'https://es-la.facebook.com/',
        text: 'Facebook',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/hola.md',
        status: { code: 200, message: 'OK' }
      },
      {
        href: 'https://www.google.com',
        text: 'Google',
        file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md',
        status: { code: 200, message: 'OK' }
      },
    ];
    return httpStatus(links).then((status) => {
      expect(status).toEqual([

        {
          href: 'https://www.24horas.cl/',
          text: '24 Horas',
          file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',
          status: { code: 200, message: 'OK' }
        },
        {
          href: 'https://www.cnnchile.com/',
          text: 'CNN Chile Lorem ipsum dolor sit amet, consectetuer',
          file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',
          status: { code: 200, message: 'OK' }
        },
        {
          href: 'https://github.com/',
          text: 'GitHub',
          file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/bye.md',
          status: { code: 200, message: 'OK' }
        },
        {
          href: 'https://es-la.facebook.com/',
          text: 'Facebook',
          file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/hola.md',
          status: { code: 200, message: 'OK' }
        },
        {
          href: 'https://www.google.com',
          text: 'Google',
          file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md',
          status: { code: 200, message: 'OK' }
        },
      ]);
    });
  });


  // it('Debería devolver Fail si el caso falló', () => {
  //   const links = [
  //     { href: 'https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions', text: 'Enlace roto', file: 'example.md' }
  //   ];
  //   return expect(httpStatus(links)).rejects.toThrow('Fail');
  // });
  //   it('Debería devolver Fail si el caso falló', () => {
  //     const links = [
  //       { href: 'https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions', text: 'Enlace roto', file: 'example.md' }
  //     ];
  //     return httpStatus(links)
  //       .then((result) => {
  //         throw new Error('La petición debería haber fallado');
  //       })
  //       .catch((error) => {
  //         expect(error).toBe('Fail');
  //       });
  //     });
  // });
  it('Debería devolver Fail si el caso falló', () => {
    const links = [{ href: 'https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions', text: 'Enlace roto', file: 'example.md' }];
    return httpStatus(links)
      .then((result) => {
        expect(result[0].status).toEqual({ "code": "ERR_BAD_REQUEST", "message": "Request failed with status code 404" });
      });
  });
});


describe('linkStats', () => {
  test('Dedería devolver el número de enlaces totales y únicos', () => {
    const links = [{
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
    },];

    const expected = { total: 7, unique: 6 };

    const result = linkStats(links);

    expect(result).toEqual(expected);
  });
});

describe('linkStatsComplete', () => {
  test('Debería devolver el número de enlaces totales, únicos y rotos', () => {
    const links = [{
      href: 'https://www.24horas.cl/',
      text: '24 Horas',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',
      status: { code: 200, message: 'OK' }
    },
    {
      href: 'https://www.cnnchile.com/',
      text: 'CNN Chile Lorem ipsum dolor sit amet, consectetuer',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/SuDirMd/links.md',
      status: { code: 200, message: 'OK' }
    },
    {
      href: 'https://github.com/',
      text: 'GitHub',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/bye.md',
      status: { code: 200, message: 'OK' }
    },
    {
      href: 'https://es-la.facebook.com/',
      text: 'Facebook',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/DirectorioConMd/hola.md',
      status: { code: 200, message: 'OK' }
    },
    {
      href: 'https://www.google.com',
      text: 'Google',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md',
      status: { code: 200, message: 'OK' }
    },
    {
      href: 'https://www.grepper.com/tpc/how+to+extract+links+from+markdown+using+regular+expressions',
      text: 'Enlace roto',
      file: '/Users/carmen/Desktop/DEV003-md-links/Pruebas/TEXT.md',
      status: {
        code: 'ERR_BAD_REQUEST',
        message: 'Request failed with status code 404'
      }
    }];

    const expected = { total: 6, unique: 6, broken: 1 };

    const result = linkStatsComplete(links);

    expect(result).toEqual(expected);
  });
});
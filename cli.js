const { mdLinks} = require('./index.js');

const path = process.argv[2];
try {
  if (!path) {
    throw new Error('Debes proporcionar una ruta como argumento');
  } else {
    mdLinks(path)
      .then(links => {
        console.log(links);
        // if (Array.isArray(links)) {
        //   // console.log('Estos son los enlaces encontrados:');
        //   links.forEach((link) => {
        //     // console.log(`- ${link.href} (${link.text})`);
        //   });
        // }
      })
      .catch(err => {
        console.error(err.message);
      });
  }
} catch (error) {
  console.error(error.message);
}

#!/usr/bin/env node
const { extractLinksFromFiles, linkStatsComplete, linkStats, getLinks } = require('./functions.js');
const { mdLinks } = require('./index.js');

const path = process.argv[2];
const validate = process.argv.includes('--validate');
const stats = process.argv.includes('--stats');
const options = { validate, stats };

mdLinks(path, options)
  .then(links => {
    if (stats && validate) {
      const result = linkStatsComplete(links);
      console.log(result);
    } else if (validate) {
      const result = extractLinksFromFiles(path);
      console.log(result);
    } else if (stats) {
      const result = linkStats(links);
      console.log(result);
    } else {
      console.log(getLinks(links));
    }
  })
  .catch((error) => {
    console.error(error.message);
  });

mdLinks('/Users/carmen/Desktop/DEV003-md-links/Pruebas', { validate: true, stats: true, })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

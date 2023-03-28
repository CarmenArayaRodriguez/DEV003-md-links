const { mdLinks } = require('./index.js');

const args = process.argv.slice(2);

const path = args[0];
const options = {
  validate: args.includes('--validate'),
  stats: args.includes('--stats'),
};

mdLinks(path, options)
  .then((result) => {
    if (Array.isArray(result)) {
      const obj = {
        links: result,
        stats: linkStats(result),
      };
      console.log(obj);
    } else {
      const obj = {
        message: result,
      };
      console.log(obj);
    }
  })
  .catch((err) => {
    console.error(err);
  });



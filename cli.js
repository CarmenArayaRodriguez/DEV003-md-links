const { mdLinks } = require('./index.js');

const path = process.argv[2];
mdLinks(path, options)
.then((resolve) => {
	console.log(resolve)
})
.catch((error) => {
	console.log(error)
});
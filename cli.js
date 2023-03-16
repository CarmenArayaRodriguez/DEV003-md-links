const { mdLinks } = require('./index.js');

const path = process.argv[2];
mdLinks(path)
.then((resolve) => {
	console.log(resolve)
})
.catch((error) => {
	console.log(error)
});
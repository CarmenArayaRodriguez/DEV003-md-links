const { mdLinks } = require('./index.js');

const path = process.argv[2];
mdLinks(path) // Aquí va options también [(path, options)], pero tuve que sacarlo porque daba error al leer links
.then((resolve) => {
	console.log(resolve)
})
.catch((error) => {
	console.log(error)
});
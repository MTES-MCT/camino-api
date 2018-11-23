const fs = require('fs')
const path = require('path')

module.exports = (d, p) => fs.readFileSync(path.join(d, p), 'utf8')

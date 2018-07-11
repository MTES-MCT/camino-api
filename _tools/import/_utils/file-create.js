const fs = require('fs')

module.exports = (name, content) => {
  fs.writeFile(name, content, 'utf8', err => {
    if (err) {
      console.log('File: error', err)
    } else {
      console.log('File:', name)
    }
  })
}

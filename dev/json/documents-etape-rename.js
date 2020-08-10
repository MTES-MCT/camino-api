const fs = require('fs')

var oldPath = './files/etapes'
var newPath = './files/demarches'

fs.rename(oldPath, newPath, function (err) {
  if (err) throw err
  console.info('renommage du dossier etapes en demarches')
})

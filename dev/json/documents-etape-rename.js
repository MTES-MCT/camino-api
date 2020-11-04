const fs = require('fs')

const oldPath = './files/etapes'
const newPath = './files/demarches'

fs.rename(oldPath, newPath, function (err) {
  if (err) throw err
  console.info('renommage du dossier etapes en demarches')
})

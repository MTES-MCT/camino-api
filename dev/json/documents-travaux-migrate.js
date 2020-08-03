const fs = require('fs')

const filePath = './sources/documents-types.json'
const documentsTypes = JSON.parse(fs.readFileSync(filePath).toString())

documentsTypes.forEach(dt => {
  if (dt.repertoire === 'etapes') {
    dt.repertoire = 'demarches'
  }
})

fs.writeFileSync(`${filePath}`, JSON.stringify(documentsTypes, null, 2))

console.info('renommages des documents types terminé')

var oldPath = './files/etapes'
var newPath = './files/demarches'

fs.rename(oldPath, newPath, function (err) {
  if (err) throw err
  console.info('renommage du dossier etapes en demarches')
})

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

const fs = require('fs')

const filePath = './sources/titres-m-titres-references.json'
const titresMReferences = JSON.parse(fs.readFileSync(filePath).toString())

titresMReferences.forEach(tmr => {
  tmr.nom = tmr.nom.replace('PTMG-', '')
})

fs.writeFileSync(filePath, JSON.stringify(titresMReferences, null, 2))

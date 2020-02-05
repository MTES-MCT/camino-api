const fs = require('fs')

const filePath = './sources/titres-activites.json'

const titresActivites = JSON.parse(fs.readFileSync(filePath).toString())

titresActivites.forEach(ta => {
  ta.type_id = ta.activite_type_id
  delete ta.activite_type_id

  ta.statut_id = ta.activite_statut_id
  delete ta.activite_statut_id
})

fs.writeFileSync(`${filePath}`, JSON.stringify(titresActivites, null, 2))

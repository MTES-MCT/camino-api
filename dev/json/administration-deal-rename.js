const fs = require('fs')

const filePath = './sources/administrations.json'
const administrations = JSON.parse(fs.readFileSync(filePath).toString())

administrations.forEach(adm => {
  if (adm.id === 'dea-guyane-01') {
    adm.nom = 'Direction Générale des Territoires et de la Mer de Guyane'
    adm.abreviation = 'DGTM - Guyane'
  }
})

fs.writeFileSync(filePath, JSON.stringify(administrations, null, 2))

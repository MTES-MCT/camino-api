require('dotenv').config()
require('../postgres')

const titresDemarchesStatutUpdate = require('./titres-demarches-statut-update')

Promise.all([titresDemarchesStatutUpdate()]).then(r => {
  console.log('Tache quotidienne executée')
  process.exit()
})

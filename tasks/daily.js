require('dotenv').config()
require('../postgres')

const titresDemarchesStatutIdUpdate = require('./titres-demarches-statut-ids-update')
const titresDemarchesOrdreUpdate = require('./titres-demarches-ordre-update')
// const titresStatutUpdate = require('./titres-statut-update')

const run = async () => {
  await titresDemarchesStatutIdUpdate()
  await titresDemarchesOrdreUpdate()
  console.log('Tache quotidienne executée')
  process.exit()
}

run()

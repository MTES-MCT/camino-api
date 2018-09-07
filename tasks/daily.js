require('dotenv').config()
require('../postgres')

const titresDemarchesStatutIdUpdate = require('./titres-demarches-statut-ids-update')
const titresDemarchesOrdreUpdate = require('./titres-demarches-ordre-update')
const titresStatutIdsUpdate = require('./titres-statut-ids-update')

const run = async () => {
  await titresDemarchesStatutIdUpdate()
  await titresDemarchesOrdreUpdate()
  await titresStatutIdsUpdate()
  console.log('Tâches quotidiennes executées')
  process.exit()
}

run()

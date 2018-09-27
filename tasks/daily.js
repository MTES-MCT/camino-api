require('dotenv').config()
require('../postgres')

const titresEtapesOrdreUpdate = require('./titres-etapes-ordre-update')
const titresDemarchesStatutIdUpdate = require('./titres-demarches-statut-ids-update')
const titresDemarchesOrdreUpdate = require('./titres-demarches-ordre-update')
const titresStatutIdsUpdate = require('./titres-statut-ids-update')
const titresPhasesUpdate = require('./titres-phases-update')

const run = async () => {
  const a = await titresEtapesOrdreUpdate()
  const b = await titresDemarchesStatutIdUpdate()
  const c = await titresDemarchesOrdreUpdate()
  const d = await titresStatutIdsUpdate()
  const e = await titresPhasesUpdate()

  console.log(a)
  console.log(b)
  console.log(c)
  console.log(d)
  console.log(e)

  console.log('Tâches quotidiennes executées')
  process.exit()
}

run()

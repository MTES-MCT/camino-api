require('dotenv').config()
require('../postgres')

const titresEtapesOrdreUpdate = require('./titres-etapes-ordre-update')
const titresDemarchesStatutIdUpdate = require('./titres-demarches-statut-ids-update')
const titresDemarchesOrdreUpdate = require('./titres-demarches-ordre-update')
const titresStatutIdsUpdate = require('./titres-statut-ids-update')
const titresPhasesUpdate = require('./titres-phases-update')

const run = async () => {
  // détermine l'ordre des étapes
  // en fonction de leur date
  const a = await titresEtapesOrdreUpdate()

  // détermine le statut des démarches
  // en fonction de ses étapes (type, ordre, statut)
  const b = await titresDemarchesStatutIdUpdate()

  // détermine l'ordre des démarche
  // en fonction de la date de leur première étape
  const c = await titresDemarchesOrdreUpdate()

  // détermine le statut des titres
  // en fonction des démarches et de la date du jour
  const d = await titresStatutIdsUpdate()

  // détermine les phases
  // en fonction des démarches et de la date du jour
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

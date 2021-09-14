const seeding = require('../seeding')

const titresTravauxEtapes = require('../../sources/titres-travaux-etapes.json')
const titresTravaux = require('../../sources/titres-travaux.json')

const seed = seeding(async ({ insert }) => {
  await insert('titresTravaux', titresTravaux)
  await insert('titresTravauxEtapes', titresTravauxEtapes)
})

module.exports = seed

module.exports.seed = seed

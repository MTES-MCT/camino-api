const seeding = require('../seeding')

const titresActivites = require('../../sources/titres-activites.json')

let titresActivitesReprise
try {
  titresActivitesReprise = require('../../sources/titres-activites-reprise-titres-activites.json')
} catch (e) {
  titresActivitesReprise = []
}

const seed = seeding(async ({ insert }) => {
  await insert(
    'titresActivites',
    titresActivites.concat(titresActivitesReprise)
  )
})

module.exports = seed

module.exports.seed = seed

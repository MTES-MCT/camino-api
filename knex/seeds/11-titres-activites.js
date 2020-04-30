const seeding = require('../seeding')

const titresActivites = require('../../sources/titres-activites.json')

let titresActivitesReprise
try {
  titresActivitesReprise = require('../../sources/titres-activites-reprise-titres-activites.json')
} catch (e) {
  titresActivitesReprise = []
}

exports.seed = seeding(async ({ insert }) => {
  await insert(
    'titresActivites',
    titresActivites.concat(titresActivitesReprise)
  )
})

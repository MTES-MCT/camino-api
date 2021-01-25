const seeding = require('../seeding')

const chalk = require('chalk')
const decamelize = require('decamelize')

const documents = require('../../sources/documents.json')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w', 'reprise']

const titresEtapesJustificatifs = domainesIds.reduce((res, domaineId) => {
  const fileName = decamelize(`titres-${domaineId}-titresEtapesJustificatifs`, {
    separator: '-'
  })

  let content
  try {
    content = require(`../../sources/${fileName}.json`)

    return res.concat(content)
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
  }

  return res
}, [])

const seed = seeding(async ({ insert }) => {
  await insert('documents', documents)
  await insert('titresEtapesJustificatifs', titresEtapesJustificatifs)
})

module.exports = seed

module.exports.seed = seed

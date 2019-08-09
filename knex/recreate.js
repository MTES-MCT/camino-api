const config = require('./config-api')
const chalk = require('chalk')
const dbManager = require('knex-db-manager').databaseManagerFactory(config)

const run = async () => {
  try {
    console.log('supprime la base de données…')
    await dbManager.dropDb('camino')
    console.log('base de données supprimée')

    console.log('')
    console.log('crée la base de données…')
    await dbManager.createDb('camino')
    console.log('base de données créée')

    console.log('')
    process.exit()
  } catch (e) {
    console.error(chalk.red(e))

    process.exit(1)
  }
}

run()

const configDbManager = require('./config-db-manager')
const chalk = require('chalk')
const dbManager = require('knex-db-manager').databaseManagerFactory(
  configDbManager
)

const run = async () => {
  try {
    console.info('supprime la base de données…')
    await dbManager.dropDb(configDbManager.knex.connection.database)
    console.info('base de données supprimée')

    console.info('')
    console.info('crée la base de données…')
    await dbManager.createDb(configDbManager.knex.connection.database)
    console.info('base de données créée')

    console.info('')
    process.exit()
  } catch (e) {
    console.error(chalk.red(e))

    process.exit(1)
  }
}

run()

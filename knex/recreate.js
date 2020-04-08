const config = require('./config-api')
const chalk = require('chalk')
const dbManager = require('knex-db-manager').databaseManagerFactory(config)

const run = async () => {
  try {
    console.info('supprime la base de données…')
    await dbManager.dropDb(config.knex.connection.database)
    console.info('base de données supprimée')

    console.info('')
    console.info('crée la base de données…')
    await dbManager.createDb(config.knex.connection.database)
    console.info('base de données créée')

    console.info('')
    process.exit()
  } catch (e) {
    console.error(chalk.red(e))

    process.exit(1)
  }
}

run()

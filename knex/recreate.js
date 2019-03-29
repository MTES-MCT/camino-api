const config = require('./config-api')
const chalk = require('chalk')
const dbManager = require('knex-db-manager').databaseManagerFactory(config)

const run = async () => {
  try {
    console.log('Re créé la base de données')
    await dbManager.dropDb('camino')
    await dbManager.createDb('camino')

    process.exit()
  } catch (e) {
    console.error(chalk.red(e))

    process.exit(1)
  }
}

run()

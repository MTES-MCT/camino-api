const Knex = require('knex')
const config = require('./config-api')
const knex = Knex(config.knex)
const chalk = require('chalk')

const dbManager = require('knex-db-manager').databaseManagerFactory(config)

const run = new Promise((resolve, reject) => {
  resolve()
})

const exit = text => {
  if (text instanceof Error) {
    console.error(chalk.red(text.stack))
  } else {
    console.error(chalk.red(text))
  }

  process.exit(1)
}

run
  .then(() => {
    return dbManager.dropDb('camino')
  })
  .then(() => {
    return dbManager.createDb('camino')
  })
  .then(() => {
    console.log('Rollback')
    return knex.migrate
      .rollback()
      .spread((batchNo, log) => {
        if (log.length === 0) {
          console.log(chalk.cyan('Already at the base migration'))
        }

        console.log(
          chalk.green(
            `Batch ${batchNo} rolled back: ${log.length} migrations \n`
          ) + chalk.cyan(log.join('\n'))
        )
      })
      .catch(exit)
  })
  .then(() => {
    console.log('Migrate')
    return knex.migrate
      .latest()
      .spread((batchNo, log) => {
        if (log.length === 0) {
          console.log(chalk.cyan('Already up to date'))
        }

        console.log(
          chalk.green(`Batch ${batchNo} run: ${log.length} migrations \n`) +
            chalk.cyan(log.join('\n'))
        )
      })
      .catch(exit)
  })
  .then(() => {
    console.log('Seed')
    return knex.seed
      .run()
      .spread(log => {
        if (log.length === 0) {
          console.log(chalk.cyan('No seed files exist'))
        }

        console.log(
          chalk.green(
            `Ran ${log.length} seed files \n${chalk.cyan(log.join('\n'))}`
          )
        )
      })
      .catch(exit)
  })
  .then(() => {
    console.log('Migrations terminées')
    process.exit()
  })

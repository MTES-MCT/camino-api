const Knex = require('knex')
const config = require('./config-api')
const knex = Knex(config.knex)
const chalk = require('chalk')

const run = async () => {
  try {
    console.log('Rollback')
    await knex.migrate.rollback().spread((batchNo, log) => {
      if (log.length === 0) {
        console.log(chalk.cyan('Already at the base migration'))
      }

      console.log(
        chalk.green(
          `Batch ${batchNo} rolled back: ${log.length} migrations \n`
        ) +
          chalk.cyan(log.join('\n')) +
          '\n'
      )
    })

    console.log('Migrate')
    await knex.migrate.latest().spread((batchNo, log) => {
      if (log.length === 0) {
        console.log(chalk.cyan('Already up to date') + '\n')
      }

      console.log(
        chalk.green(`Batch ${batchNo} run: ${log.length} migrations \n`) +
          chalk.cyan(log.join('\n')) +
          '\n'
      )
    })

    console.log('Seed')
    await knex.seed.run().spread(log => {
      if (log.length === 0) {
        console.log(chalk.cyan('No seed files exist') + '\n')
      }

      console.log(
        chalk.green(
          `Ran ${log.length} seed files \n${chalk.cyan(log.join('\n'))}` + '\n'
        )
      )
    })

    console.log('Migrations terminées')
    process.exit()
  } catch (e) {
    if (e instanceof Error) {
      console.error(chalk.red(e.stack))
    } else {
      console.error(chalk.red(e))
    }

    process.exit(1)
  }
}

run()

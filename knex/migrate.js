const Knex = require('knex')
const config = require('./config-api')
const knex = Knex(config.knex)
const chalk = require('chalk')

const run = async () => {
  try {
    console.log('rollback…')
    const [rollBackBatchNo, rollbackLog] = await knex.migrate.rollback()

    if (rollbackLog.length === 0) {
      console.log(chalk.cyan('already at the base migration'))
    }

    console.log(
      chalk.green(
        `batch ${rollBackBatchNo} rolled back: ${rollbackLog.length} migrations \n`
      ) +
        chalk.cyan(rollbackLog.join('\n')) +
        '\n'
    )

    console.log('migrate…')
    const [latestBatchNo, latestLog] = await knex.migrate.latest()
    if (latestLog.length === 0) {
      console.log(chalk.cyan(`already up to date\n`))
    }

    console.log(
      chalk.green(
        `batch ${latestBatchNo} run: ${latestLog.length} migrations \n`
      ) +
        chalk.cyan(latestLog.join('\n')) +
        '\n'
    )

    console.log('seed…')
    const [seedLog] = await knex.seed.run()
    if (seedLog.length === 0) {
      console.log(chalk.cyan('no seed files exist') + '\n')
    }

    console.log(
      chalk.green(
        `ran ${seedLog.length} seed files \n${chalk.cyan(seedLog.join('\n'))}` +
          '\n'
      )
    )

    console.log('migrations terminées')
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

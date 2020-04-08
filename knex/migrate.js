const Knex = require('knex')
const config = require('./config-api')
const knex = Knex(config.knex)
const chalk = require('chalk')

const run = async () => {
  try {
    console.info('rollback…')
    const [rollBackBatchNo, rollbackLog] = await knex.migrate.rollback()

    if (rollbackLog.length === 0) {
      console.info(chalk.cyan('already at the base migration'))
    }

    console.info(
      chalk.green(
        `batch ${rollBackBatchNo} rolled back: ${rollbackLog.length} migrations \n`
      ) +
        chalk.cyan(rollbackLog.join('\n')) +
        '\n'
    )

    console.info('migrate…')
    const [latestBatchNo, latestLog] = await knex.migrate.latest()
    if (latestLog.length === 0) {
      console.info(chalk.cyan(`already up to date\n`))
    }

    console.info(
      chalk.green(
        `batch ${latestBatchNo} run: ${latestLog.length} migrations \n`
      ) +
        chalk.cyan(latestLog.join('\n')) +
        '\n'
    )

    console.info('seed…')
    const [seedLog] = await knex.seed.run()
    if (seedLog.length === 0) {
      console.info(chalk.cyan('no seed files exist') + '\n')
    }

    console.info(
      chalk.green(
        `ran ${seedLog.length} seed files \n${chalk.cyan(seedLog.join('\n'))}` +
          '\n'
      )
    )

    console.info('migrations terminées')
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

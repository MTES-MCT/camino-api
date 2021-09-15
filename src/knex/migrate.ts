import '../init'
import { knex } from '../knex'
import chalk from 'chalk'

const run = async () => {
  try {
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

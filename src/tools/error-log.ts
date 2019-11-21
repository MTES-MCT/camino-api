import * as chalk from 'chalk'

const errorLog = (error: string, ...args: any[]) => {
  console.error('')
  console.error(chalk.bgRed.black.bold(' erreur '))
  console.error(chalk.red.bold(error, ...args))
  console.error('')
}

export default errorLog

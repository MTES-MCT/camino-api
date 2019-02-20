import chalk from 'chalk'

const errorLog = (error, ...args) => {
  console.error('')
  console.error(chalk.bgRed.black.bold(' erreur '))
  console.error(chalk.red.bold(error, ...args))
  console.error('')
}

export default errorLog

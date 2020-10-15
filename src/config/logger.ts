/* istanbul ignore file */
import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf, colorize } = format

const myFormat = printf(({ level, message, timestamp }) => {
  if (!message || !message.length) {
    return ''
  }

  return `${timestamp} [${level}]: ${message}`
})

const timestampFormat = timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })

const logger = createLogger({
  transports: [
    new transports.Console({
      format: combine(colorize(), timestampFormat, myFormat)
    })
  ]
})

// Si nous sommes en production, alors on met aussi les logs dans un fichier
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.File({
      filename: 'app.log',
      format: combine(timestampFormat, myFormat)
    })
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.log = (message: any, ...args: any) => logger.info(message, ...args)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.info = (message: any, ...args: any) => logger.info(message, ...args)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.warn = (message: any, ...args: any) => logger.warn(message, ...args)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (message: any, ...args: any) => logger.error(message, ...args)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.debug = (message: any, ...args: any) => logger.debug(message, ...args)

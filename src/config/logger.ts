/* istanbul ignore file */
import { createLogger, format, Logger, transports } from 'winston'
import * as util from 'util'

const { combine, timestamp, printf, colorize } = format

const printFormat = printf(({ level, message, timestamp }) => {
  if (!message || !message.length) {
    return ''
  }

  return `${timestamp} [${level}]: ${message}`
})

const timestampFormat = timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })

const utilFormat = {
  transform(info: any) {
    const args = info[Symbol.for('splat')]
    if (args) {
      info.message = util.format(info.message, ...args)
    }

    return info
  }
}

const consoleOverride = (logger: Logger) => {
  console.info = (...args) => logger.info('', ...args)
  console.warn = (...args) => logger.warn('', ...args)
  console.error = (...args) => logger.error('', ...args)
  console.debug = (...args) => logger.debug('', ...args)
}

const logger = createLogger({
  transports: [
    new transports.Console({
      format: combine(colorize(), timestampFormat, utilFormat, printFormat)
    })
  ]
})

// Si nous sommes en production, alors on met aussi les logs dans un fichier
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.File({
      filename: 'app.log',
      format: combine(timestampFormat, utilFormat, printFormat)
    })
  )
}
consoleOverride(logger)

export { timestampFormat, utilFormat, consoleOverride }

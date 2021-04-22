/* istanbul ignore file */
import util from 'util'
import winston from 'winston'

const { createLogger, format, transports } = winston

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

const consoleOverride = (logger: winston.Logger) => {
  console.info = (...args) => logger.info('', ...args)
  console.warn = (...args) => logger.warn('', ...args)
  console.error = (...args) => logger.error('', ...args)
  console.debug = (...args) => logger.debug('', ...args)
}

const consoleTransport = new transports.Console({
  format: combine(colorize(), timestampFormat, utilFormat, printFormat)
})

const appLogger = createLogger({
  transports: [consoleTransport]
})

// Si nous sommes en production, alors on met aussi les logs dans un fichier
if (process.env.NODE_ENV === 'production') {
  appLogger.add(
    new transports.File({
      filename: 'app.log',
      format: combine(timestampFormat, utilFormat, printFormat)
    })
  )
}

const htmlFormat = printf(({ level, message, timestamp }) => {
  if (!message || !message.length) {
    return ''
  }

  return `<div>${timestamp} [${level}]: ${message}</div>`
})

const cronLogger = createLogger({
  transports: [
    consoleTransport,
    new transports.File({
      filename: 'cron.log',
      format: combine(timestampFormat, utilFormat, htmlFormat)
    })
  ]
})

export { consoleOverride, appLogger, cronLogger }

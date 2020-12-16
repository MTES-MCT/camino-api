/* istanbul ignore file */
import { createLogger, format, transports } from 'winston'
import {
  consoleOverride,
  consoleTransport,
  timestampFormat,
  utilFormat
} from './logger'

const { combine, printf } = format

const htmlFormat = printf(({ level, message, timestamp }) => {
  if (!message || !message.length) {
    return ''
  }

  return `<div>${timestamp} [${level}]: ${message}</div>`
})

const logger = createLogger({
  transports: [
    consoleTransport,
    new transports.File({
      filename: 'cron.log',
      format: combine(timestampFormat, utilFormat, htmlFormat)
    })
  ]
})

consoleOverride(logger)

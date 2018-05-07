const conf = {
  HOST: 'localhost',
  PORT: 3000,
  PATH: ''
}

const HOST = process.env.VIRTUAL_HOST ? '0.0.0.0' : conf.HOST
const PORT = Number(process.env.VIRTUAL_PORT) || conf.PORT
const PATH = conf.PATH

const PROTOCOL = process.env.VIRTUAL_HOST ? 'https' : 'http'
const VIRTUAL_PORT = process.env.VIRTUAL_HOST ? 443 : PORT
const VIRTUAL_HOST = process.env.VIRTUAL_HOST || HOST

const URL = `${PROTOCOL}://${VIRTUAL_HOST}:${VIRTUAL_PORT}/${PATH}`

module.exports = {
  HOST: HOST,
  PORT: PORT,
  PATH: PATH,
  URL: URL
}

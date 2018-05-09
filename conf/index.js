const virtualHost = process.env.VIRTUAL_HOST
const virtualProtocol = virtualHost && 'https'
const virtualPort = Number(process.env.VIRTUAL_PORT) && 443

const host = virtualHost && '0.0.0.0'
const dir = ''
const port = 4000

const virtualUrl =
  virtualHost && `${virtualProtocol}://${virtualHost}:${virtualPort}/${dir}`

module.exports = {
  port,
  host,
  virtualUrl
}

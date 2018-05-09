const virtualHost = process.env.VIRTUAL_HOST
const virtualProtocol = virtualHost && 'https'
const virtualPort = Number(process.env.VIRTUAL_PORT) && 443
const dir = ''

module.exports = {
  port: 4000,
  host: virtualHost && '0.0.0.0',
  virtualUrl:
    virtualHost && `${virtualProtocol}://${virtualHost}:${virtualPort}/${dir}`
}

// virtualHost est défini seuelement si
// l'application tourne dans un container docker
// cd DockerFile

const virtualHost = process.env.VIRTUAL_HOST
const protocol = virtualHost ? 'https' : 'http'
const dir = ''
const port = 4000
const host = virtualHost ? '0.0.0.0' : 'localhost'
const url = virtualHost
  ? `${protocol}://${virtualHost}/${dir}`
  : `${protocol}://${host}:${port}/${dir}`

module.exports = {
  port,
  host,
  url
}

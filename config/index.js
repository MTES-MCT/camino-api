// virtualHost est défini seulement si
// l'application tourne dans un container docker
// voir le fichier DockerFile

const debug = process.env.NODE_DEBUG === 'true'
const virtualHost = process.env.VIRTUAL_HOST
const protocol = virtualHost ? 'https' : 'http'
const port = Number(process.env.NODE_PORT)
const url = virtualHost
  ? `${protocol}://${virtualHost}/`
  : `${protocol}://localhost:${port}/`

module.exports = {
  port,
  url,
  debug
}

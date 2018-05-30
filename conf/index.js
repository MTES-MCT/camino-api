// virtualHost est défini seuelement si
// l'application tourne dans un container docker
// cd DockerFile
const env = process.env.NODE_ENV

console.log('env', env)
const virtualHost = process.env.VIRTUAL_HOST
const protocol = virtualHost ? 'https' : 'http'
const port = Number(process.env.NODE_PORT)
const url = virtualHost
  ? `${protocol}://${virtualHost}/`
  : `${protocol}://localhost:${port}/`
const jwtSecret = process.env.JWT_SECRET

module.exports = {
  port,
  url,
  env,
  jwtSecret
}

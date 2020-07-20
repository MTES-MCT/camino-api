// virtualHost est défini seulement si
// l'application tourne dans un container docker
// voir le fichier DockerFile

const debug = process.env.NODE_DEBUG === 'true'
const virtualHost = process.env.VIRTUAL_HOST
const port = Number(process.env.PORT)
const url = virtualHost ? `http://${virtualHost}/` : `http://localhost:${port}/`

export { port, url, debug }

import express from 'express'
import { Server, FileStore } from 'tus-node-server'
import { graphqlUploadExpress } from 'graphql-upload'
import { permissionCheck } from '../business/permission'
import { userGet } from '../database/queries/utilisateurs'

// Téléversement REST
const uploadAllowedMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).user?.id

  const user = await userGet(userId)

  if (!user || permissionCheck(user.permissionId, ['defaut'])) {
    res.sendStatus(403)

    return
  }
  next()
}

const restUpload = () => {
  const tmp = '/files/tmp'
  const server = new Server()

  // nous passons à travers un proxy
  const relativeLocation = true
  server.datastore = new FileStore({ path: tmp, relativeLocation })

  const uploadServer = express()
  uploadServer.all('*', server.handle.bind(server))

  return uploadServer
}

// Téléversement graphQL
const graphqlUpload = graphqlUploadExpress({
  maxFileSize: Infinity,
  maxFiles: 10
})

export { restUpload, uploadAllowedMiddleware, graphqlUpload }

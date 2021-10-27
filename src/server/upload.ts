import express from 'express'
import { Server, FileStore, EVENTS } from 'tus-node-server'
import fileRename from '../tools/file-rename'
import { graphqlUploadExpress } from 'graphql-upload'
import { permissionCheck } from '../tools/permission'
import { userGet } from '../database/queries/utilisateurs'
import { documentFilePathFind } from '../tools/documents/document-path-find'

type TUSEventUploadComplete = {
  file: {
    id: string
    // eslint-disable-next-line camelcase
    upload_length: string
    // eslint-disable-next-line camelcase
    upload_metadata: string
  }
}

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
  server.datastore = new FileStore({ path: tmp })

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

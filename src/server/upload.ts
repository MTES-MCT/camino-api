import express from 'express'
import { Server, FileStore, EVENTS } from 'tus-node-server'
import fileRename from '../tools/file-rename'
import { graphqlUploadExpress } from 'graphql-upload'
import { permissionCheck } from '../tools/permission'
import { userGet } from '../database/queries/utilisateurs'

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

  server.on(
    EVENTS.EVENT_UPLOAD_COMPLETE,
    async (event: TUSEventUploadComplete) => {
      const file = event.file
      const metadata: Record<string, string> = {}

      // Utilise le documentId créé par GQL, préalablement à ce téléversement,
      // puis passé dans les métadonnées, pour renommer le fichier avec le même nom que celui base.
      file.upload_metadata.split(',').forEach((rawStr: string) => {
        const keyAndVal = rawStr.split(' ')
        if (keyAndVal.length < 2) {
          throw new Error('Métadonnées incorrectes lors du téléversement')
        }
        metadata[keyAndVal[0]] = Buffer.from(keyAndVal[1], 'base64').toString()
      })

      const documentId = metadata.documentId

      if (!documentId) {
        throw new Error(
          'Manque documentId dans les métadonnées du téléversement'
        )
      }

      await fileRename(`${tmp}/${event.file.id}`, `${tmp}/${documentId}.pdf`)
    }
  )

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

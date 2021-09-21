import express from 'express'
import { Server, FileStore, EVENTS } from 'tus-node-server'
import fileRename from '../tools/file-rename'
import { TUSEventUploadComplete } from '../types'
import { graphqlUploadExpress } from 'graphql-upload'

// Téléversement REST
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
      throw new Error('Manque documentId dans les métadonnées du téléversement')
    }

    await fileRename(`${tmp}/${event.file.id}`, `${tmp}/${documentId}.pdf`)
  }
)

const restUpload = express()
restUpload.all('*', server.handle.bind(server))
// TODO authorization

// Téléversement graphQL
const graphqlUpload = graphqlUploadExpress({
  maxFileSize: Infinity,
  maxFiles: 10
})

export { restUpload, graphqlUpload }

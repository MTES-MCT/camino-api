/* eslint-disable camelcase */
import express from 'express'
import { Server, FileStore, EVENTS } from 'tus-node-server'
import fileRename from '../tools/file-rename'

const server = new Server()

server.datastore = new FileStore({
  path: '/files/tmp'
})

type EventUploadComplete = {
  file: {
    id: string
    upload_length: string
    upload_metadata: string
  }
}

server.on(EVENTS.EVENT_UPLOAD_COMPLETE, async (event: EventUploadComplete) => {
  const file = event.file
  const metadata: Record<string, string> = {}

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

  await fileRename(
    '/files/tmp/' + event.file.id,
    '/files/tmp/' + documentId + '.pdf'
  )
})

const upload = express()

upload.all('*', server.handle.bind(server))

export default upload

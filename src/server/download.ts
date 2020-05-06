import * as express from 'express'
import { join, parse } from 'path'
import { documentNameGet } from '../api/rest/documents'
import { IAuthRequest } from './_types'

const download = async (
  req: IAuthRequest,
  res: express.Response
  // next: express.NextFunction
) => {
  try {
    const userId = req.user && req.user.id
    const titreDocumentId = parse(req.params.fileName).name
    const documentName = await documentNameGet(userId, titreDocumentId)

    const options = {
      dotfiles: 'deny',
      headers: {
        'x-sent': true,
        'x-timestamp': Date.now()
      },
      root: join(process.cwd(), 'files')
    }

    return res.sendFile(documentName, options, err => {
      if (err) {
        res.status(404).send('fichier introuvable')
      }
    })
  } catch (error) {
    return res.status(403).send(error)
  }
}

export { download }

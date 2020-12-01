import { IFormat, Index } from '../types'

import * as express from 'express'
import { join } from 'path'

import { debug } from '../config/index'

import {
  titres,
  demarches,
  activites,
  utilisateurs,
  entreprises
} from '../api/rest'

import { fichier } from '../api/rest/fichiers'

import { IAuthRequest } from './_types'

const contentTypes = {
  csv: 'text/csv',
  geojson: 'application/geojson',
  xlsx: 'application/xlsx',
  pdf: 'application/pdf',
  json: 'application/json'
} as { [id in IFormat]: string }

interface IRestResolverResult {
  nom: string
  format: IFormat
  contenu?: string
  filePath?: string
}

type IRestResolver = (
  params: Index<unknown>,
  userId?: string
) => Promise<IRestResolverResult | null>

const rest = express.Router()

const restify = (resolver: IRestResolver) => async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const result = await resolver({ ...req.query, ...req.params }, req.user?.id)

    if (!result) {
      throw new Error('erreur: aucun résultat')
    }

    const { nom, format, contenu, filePath } = result

    res.header('Content-disposition', `attachment; filename=${nom}`)
    res.header('Content-Type', contentTypes[format])

    if (filePath) {
      const options = {
        dotfiles: 'deny',
        headers: {
          'x-sent': true,
          'x-timestamp': Date.now()
        },
        root: join(process.cwd(), 'files')
      }

      res.sendFile(filePath, options, err => {
        if (err) console.error(`erreur de téléchargement ${err}`)
      })
    } else {
      res.send(contenu)
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    next(e)
  }
}

rest.get('/titres', restify(titres))
rest.get('/demarches', restify(demarches))
rest.get('/activites', restify(activites))
rest.get('/utilisateurs', restify(utilisateurs))
rest.get('/entreprises', restify(entreprises))
rest.get('/fichiers/:documentId', restify(fichier))

rest.use(
  (
    err: Error,
    req: IAuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err) {
      res.status(500)
      res.send({ error: err.message })

      return
    }

    next()
  }
)

export { rest }

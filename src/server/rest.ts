import * as express from 'express'
import { IFormat, Index } from '../types'

import { debug } from '../config/index'

import {
  titres,
  demarches,
  activites,
  utilisateurs,
  entreprises
} from '../api/rest/flux'
import { IAuthRequest } from './_types'

const contentTypeCreate = (format: IFormat) => {
  if (format === 'csv') return 'text/csv'
  if (format === 'geojson') return 'application/geojson'
  if (format === 'xlsx') return 'application/xlsx'

  return ''
}

interface IRestResolverResult {
  nom: string
  format: IFormat
  contenu: string
}

type IRestResolver = (
  params: Index<any>,
  userId?: string
) => Promise<IRestResolverResult | null>

const rest = express.Router()

const restify = (resolver: IRestResolver) => async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const result = await resolver(req.query, req.user?.id)

    if (!result) {
      throw new Error('Erreur technique: mauvais retour dans le resolver')
    }

    const { nom, format, contenu } = result

    res.header('Content-disposition', `attachment; filename=${nom}`)
    res.header('Content-Type', contentTypeCreate(format))

    res.send(contenu)
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

export { rest }

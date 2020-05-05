import * as express from 'express'
import { titresGet } from '../../database/queries/titres'
import { ITitreColonneId, IFormat } from '../../types'
import { userGet } from '../../database/queries/utilisateurs'
import { titresFormat } from '../resolvers/format/titres'
import { tableConvert } from './_convert'
import { fileNameCreate } from '../../tools/telechargement/file-name-create'
import { titresFormatGeojson, titresFormatTable } from './format/titres'

interface IAuthRequest extends express.Request {
  user?: {
    [id: string]: string
  }
}

const contentTypeCreate = (format: IFormat) => {
  if (format === 'csv') return 'text/csv'
  if (format === 'geojson') return 'application/geojson'
  if (format === 'xlsx') return 'application/xlsx'

  return ''
}

interface ITitresQueryInput {
  format?: IFormat
  ordre?: 'asc' | 'desc' | null
  colonne?: ITitreColonneId | null
  domainesIds?: string | null
  typesIds?: string | null
  statutsIds?: string | null
  substances?: string | null
  noms?: string | null
  entreprises?: string | null
  references?: string | null
  territoires?: string | null
}

const titres = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = req.user?.id

  const {
    format = 'csv',
    ordre,
    colonne,
    typesIds,
    domainesIds,
    statutsIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  } = req.query as ITitresQueryInput

  const titres = await titresGet(
    {
      ordre,
      colonne,
      typesIds: typesIds?.split(','),
      domainesIds: domainesIds?.split(','),
      statutsIds: statutsIds?.split(','),
      substances,
      noms,
      entreprises,
      references,
      territoires
    },
    {},
    userId
  )

  const user = userId ? await userGet(userId) : undefined
  const titresFormatted = titresFormat(user, titres)

  let contenu

  if (format === 'geojson') {
    const elements = titresFormatGeojson(titresFormatted)

    contenu = JSON.stringify(elements, null, 2)
  } else if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = titresFormatTable(titresFormatted)

    contenu = tableConvert('titres', elements, format)
  }

  if (contenu) {
    const nom = fileNameCreate('titres', format)

    res.header('Content-disposition', `attachment; filename=${nom}`)
    res.header('Content-Type', contentTypeCreate(format))

    res.send(contenu)

    return
  }

  next()
}

const demarches = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  //
}

const activites = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  //
  elementsFormatted = activitesFormatCsv(elements as ITitreActivite[])
}

const utilisateurs = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  //
}

const entreprises = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  //
}

export { titres, demarches, activites, utilisateurs, entreprises }

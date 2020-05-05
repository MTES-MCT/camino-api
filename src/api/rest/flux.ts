import * as express from 'express'

import {
  IFormat,
  ITitreColonneId,
  ITitreDemarcheColonneId,
  ITitreActiviteColonneId
} from '../../types'

import { debug } from '../../config/index'

import { titresGet } from '../../database/queries/titres'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import { entreprisesGet } from '../../database/queries/entreprises'
import { utilisateursGet, userGet } from '../../database/queries/utilisateurs'

import { titresFormat } from '../resolvers/format/titres'
import { titreDemarcheFormat } from '../resolvers/format/titres-demarches'
import { titreActiviteFormat } from '../resolvers/format/titres-activites'
import { utilisateurFormat } from '../resolvers/format/utilisateurs'
import { entrepriseFormat } from '../resolvers/format/entreprises'

import { tableConvert } from './_convert'
import { fileNameCreate } from '../../tools/telechargement/file-name-create'

import { titresFormatGeojson, titresFormatTable } from './format/titres'
import { titresDemarchesFormatTable } from './format/titres-demarches'
import { titresActivitesFormatTable } from './format/titres-activites'
import { utilisateursFormatTable } from './format/utilisateurs'
import { entreprisesFormatTable } from './format/entreprises'

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
  try {
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
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    next(e)
  }
}

interface ITitresDemarchesQueryInput {
  format?: IFormat
  ordre?: 'asc' | 'desc' | null
  colonne?: ITitreDemarcheColonneId | null
  typesIds?: string | null
  statutsIds?: string | null
  titresTypesIds?: string | null
  titresDomainesIds?: string | null
  titresStatutsIds?: string | null
  etapesInclues?: string | null
  etapesExclues?: string | null
}

const demarches = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const {
      format = 'csv',
      ordre,
      colonne,
      typesIds,
      statutsIds,
      titresTypesIds,
      titresDomainesIds,
      titresStatutsIds,
      etapesInclues,
      etapesExclues
    } = req.query as ITitresDemarchesQueryInput

    const userId = req.user?.id

    const titresDemarches = await titresDemarchesGet(
      {
        ordre,
        colonne,
        typesIds: typesIds?.split(','),
        statutsIds: statutsIds?.split(','),
        titresTypesIds: titresTypesIds?.split(','),
        titresDomainesIds: titresDomainesIds?.split(','),
        titresStatutsIds: titresStatutsIds?.split(','),
        etapesInclues: etapesInclues ? JSON.parse(etapesInclues) : null,
        etapesExclues: etapesExclues ? JSON.parse(etapesExclues) : null
      },
      {
        fields: {
          type: { id: {} },
          statut: { id: {} },
          titre: { id: {} }
        }
      },
      userId
    )

    const user = userId ? await userGet(userId) : undefined

    const demarchesFormatted = titresDemarches.map(titreDemarche =>
      titreDemarcheFormat(
        user,
        titreDemarche,
        titreDemarche.titre!.typeId,
        titreDemarche.titre!.statutId!
      )
    )

    let contenu

    if (['csv', 'xlsx', 'ods'].includes(format)) {
      const elements = titresDemarchesFormatTable(demarchesFormatted)

      contenu = tableConvert('demarches', elements, format)
    }

    if (contenu) {
      const nom = fileNameCreate('demarches', format)

      res.header('Content-disposition', `attachment; filename=${nom}`)
      res.header('Content-Type', contentTypeCreate(format))

      res.send(contenu)

      return
    }

    next()
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    next(e)
  }
}

interface ITitresActivitesQueryInput {
  format?: IFormat
  ordre?: 'asc' | 'desc' | null
  colonne?: ITitreActiviteColonneId | null
  typesIds?: string[] | null
  annees?: number[] | null
}

const activites = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const {
      format = 'csv',
      ordre,
      colonne,
      typesIds,
      annees
    } = req.query as ITitresActivitesQueryInput

    const userId = req.user?.id

    const titresActivites = await titresActivitesGet(
      {
        ordre,
        colonne,
        typesIds,
        annees
      },
      {
        fields: {
          type: {
            frequence: {
              annees: { id: {} },
              trimestres: { id: {} },
              mois: { id: {} }
            }
          },
          statut: { id: {} },
          titre: { id: {} }
        }
      },
      userId
    )

    const titresActivitesFormatted = titresActivites.map(
      a => titreActiviteFormat(a)
    )

    let contenu

    if (['csv', 'xlsx', 'ods'].includes(format)) {
      const elements = titresActivitesFormatTable(titresActivitesFormatted)

      contenu = tableConvert('activites', elements, format)
    }

    if (contenu) {
      const nom = fileNameCreate('activites', format)

      res.header('Content-disposition', `attachment; filename=${nom}`)
      res.header('Content-Type', contentTypeCreate(format))

      res.send(contenu)

      return
    }

    next()
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    next(e)
  }
}

interface IUtilisateursQueryInput {
  format?: IFormat,
  entrepriseIds?: string
  administrationIds?: string
  permissionIds?: string
  noms?: string
}

const utilisateurs = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const {
      format = 'csv',
      entrepriseIds,
      administrationIds,
      permissionIds,
      noms
    } = req.query as IUtilisateursQueryInput

    const userId = req.user?.id

    const utilisateurs = await utilisateursGet(
      {
        noms: noms?.split(' '),
        entrepriseIds: entrepriseIds?.split(','),
        administrationIds: administrationIds?.split(','),
        permissionIds: permissionIds?.split(',')
      },
      {},
      userId
    )

    const utilisateursFormatted = utilisateurs.map(utilisateurFormat)


    let contenu

    if (['csv', 'xlsx', 'ods'].includes(format)) {
      const elements = utilisateursFormatTable(utilisateursFormatted)

      contenu = tableConvert('utilisateurs', elements, format)
    }

    if (contenu) {
      const nom = fileNameCreate('utilisateurs', format)

      res.header('Content-disposition', `attachment; filename=${nom}`)
      res.header('Content-Type', contentTypeCreate(format))

      res.send(contenu)

      return
    }

    next()
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    next(e)
  }
}

interface IEntreprisesQueryInput {
  format?: IFormat
}

const entreprises = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const {
      format = 'csv',
    } = req.query as IEntreprisesQueryInput

    const userId = req.user?.id

    const entreprises = await entreprisesGet(
      null,
      {},
      userId
    )

    const user = userId ? await userGet(userId) : undefined

    const entreprisesFormatted = entreprises.map(e => entrepriseFormat(user, e))

    let contenu

    if (['csv', 'xlsx', 'ods'].includes(format)) {
      const elements = entreprisesFormatTable(entreprisesFormatted)

      contenu = tableConvert('entreprises', elements, format)
    }

    if (contenu) {
      const nom = fileNameCreate('entreprises', format)

      res.header('Content-disposition', `attachment; filename=${nom}`)
      res.header('Content-Type', contentTypeCreate(format))

      res.send(contenu)

      return
    }

    next()
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    next(e)
  }
}

export { titres, demarches, activites, utilisateurs, entreprises }

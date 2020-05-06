import {
  IFormat,
  ITitreColonneId,
  ITitreDemarcheColonneId,
  ITitreActiviteColonneId
} from '../../types'

import { titresGet } from '../../database/queries/titres'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import { entreprisesGet } from '../../database/queries/entreprises'
import { utilisateursGet, userGet } from '../../database/queries/utilisateurs'

import { titresFormat } from '../_format/titres'
import { titreDemarcheFormat } from '../_format/titres-demarches'
import { titreActiviteFormat } from '../_format/titres-activites'
import { utilisateurFormat } from '../_format/utilisateurs'
import { entrepriseFormat } from '../_format/entreprises'

import { tableConvert } from './_convert'
import { fileNameCreate } from '../../tools/telechargement/file-name-create'

import { titresFormatGeojson, titresFormatTable } from './format/titres'
import { titresDemarchesFormatTable } from './format/titres-demarches'
import { titresActivitesFormatTable } from './format/titres-activites'
import { utilisateursFormatTable } from './format/utilisateurs'
import { entreprisesFormatTable } from './format/entreprises'

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
  {
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
  }: ITitresQueryInput,
  userId?: string
) => {
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

  return contenu
    ? {
        nom: fileNameCreate('titres', format),
        format,
        contenu
      }
    : null
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
  {
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
  }: ITitresDemarchesQueryInput,
  userId?: string
) => {
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

  return contenu
    ? {
        nom: fileNameCreate('demarches', format),
        format,
        contenu
      }
    : null
}

interface ITitresActivitesQueryInput {
  format?: IFormat
  ordre?: 'asc' | 'desc' | null
  colonne?: ITitreActiviteColonneId | null
  typesIds?: string[] | null
  annees?: number[] | null
}

const activites = async (
  {
    format = 'csv',
    ordre,
    colonne,
    typesIds,
    annees
  }: ITitresActivitesQueryInput,
  userId?: string
) => {
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

  const titresActivitesFormatted = titresActivites.map(a =>
    titreActiviteFormat(a)
  )

  let contenu

  if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = titresActivitesFormatTable(titresActivitesFormatted)

    contenu = tableConvert('activites', elements, format)
  }

  return contenu
    ? {
        nom: fileNameCreate('activites', format),
        format,
        contenu
      }
    : null
}

interface IUtilisateursQueryInput {
  format?: IFormat
  entrepriseIds?: string
  administrationIds?: string
  permissionIds?: string
  noms?: string
}

const utilisateurs = async (
  {
    format = 'csv',
    entrepriseIds,
    administrationIds,
    permissionIds,
    noms
  }: IUtilisateursQueryInput,
  userId?: string
) => {
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

  return contenu
    ? {
        nom: fileNameCreate('utilisateurs', format),
        format,
        contenu
      }
    : null
}

interface IEntreprisesQueryInput {
  format?: IFormat
}

const entreprises = async (
  { format = 'csv' }: IEntreprisesQueryInput,
  userId?: string
) => {
  const entreprises = await entreprisesGet(null, {}, userId)

  const user = userId ? await userGet(userId) : undefined

  const entreprisesFormatted = entreprises.map(e => entrepriseFormat(user, e))

  let contenu

  if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = entreprisesFormatTable(entreprisesFormatted)

    contenu = tableConvert('entreprises', elements, format)
  }

  return contenu
    ? {
        nom: fileNameCreate('entreprises', format),
        format,
        contenu
      }
    : null
}

export { titres, demarches, activites, utilisateurs, entreprises }

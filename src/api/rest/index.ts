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
import { fileNameCreate } from '../../tools/file-name-create'

import { titresFormatGeojson, titresFormatTable } from './format/titres'
import { titresDemarchesFormatTable } from './format/titres-demarches'
import { titresActivitesFormatTable } from './format/titres-activites'
import { utilisateursFormatTable } from './format/utilisateurs'
import { entreprisesFormatTable } from './format/entreprises'

const formatCheck = (formats: string[], format: string) => {
  if (!formats.includes(format)) {
    throw new Error(`Format « ${format} » non supporté.`)
  }
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
  {
    format = 'json',
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
  formatCheck(['json', 'xlsx', 'csv', 'ods', 'geojson'], format)

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
    {
      fields: {
        type: { type: { id: {} } },
        domaine: { id: {} },
        statut: { id: {} },
        references: { type: { id: {} } },
        substances: { legales: { id: {} } },
        titulaires: { etablissements: { id: {} } },
        amodiataires: { etablissements: { id: {} } },
        surfaceEtape: { id: {} },
        points: { id: {} },
        communes: { departement: { region: { pays: { id: {} } } } },
        administrationsLocales: { type: { id: {} } },
        administrationsGestionnaires: { type: { id: {} } }
      }
    },
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
  } else {
    contenu = JSON.stringify(titresFormatted)
  }

  return contenu
    ? {
        nom: fileNameCreate(`titres-${titres.length}`, format),
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
  etapesInclues?: string | null
  etapesExclues?: string | null
  titresTypesIds?: string | null
  titresDomainesIds?: string | null
  titresStatutsIds?: string | null
  titresNoms?: string | null
  titresEntreprises?: string | null
  titresSubstances?: string | null
  titresReferences?: string | null
  titresTerritoires?: string | null
}

const demarches = async (
  {
    format = 'json',
    ordre,
    colonne,
    typesIds,
    etapesInclues,
    etapesExclues,
    statutsIds,
    titresTypesIds,
    titresDomainesIds,
    titresStatutsIds,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires
  }: ITitresDemarchesQueryInput,
  userId?: string
) => {
  formatCheck(['json', 'csv', 'ods', 'xlsx'], format)

  const titresDemarches = await titresDemarchesGet(
    {
      ordre,
      colonne,
      typesIds: typesIds?.split(','),
      statutsIds: statutsIds?.split(','),
      etapesInclues: etapesInclues ? JSON.parse(etapesInclues) : null,
      etapesExclues: etapesExclues ? JSON.parse(etapesExclues) : null,
      titresTypesIds: titresTypesIds?.split(','),
      titresDomainesIds: titresDomainesIds?.split(','),
      titresStatutsIds: titresStatutsIds?.split(','),
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires
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

  let contenu = ''

  if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = titresDemarchesFormatTable(demarchesFormatted)

    contenu = tableConvert('demarches', elements, format)
  } else {
    contenu = JSON.stringify(demarchesFormatted)
  }

  return contenu
    ? {
        nom: fileNameCreate(`demarches-${titresDemarches.length}`, format),
        format,
        contenu
      }
    : null
}

interface ITitresActivitesQueryInput {
  format?: IFormat
  ordre?: 'asc' | 'desc' | null
  colonne?: ITitreActiviteColonneId | null
  typesIds?: string | null
  statutsIds?: string | null
  annees?: string | null
  titresNoms?: string | null
  titresEntreprises?: string | null
  titresSubstances?: string | null
  titresReferences?: string | null
  titresTerritoires?: string | null
}

const activites = async (
  {
    format = 'json',
    ordre,
    colonne,
    typesIds,
    statutsIds,
    annees,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires
  }: ITitresActivitesQueryInput,
  userId?: string
) => {
  formatCheck(['json', 'xlsx', 'csv', 'ods'], format)

  const titresActivites = await titresActivitesGet(
    {
      ordre,
      colonne,
      typesIds: typesIds?.split(','),
      statutsIds: statutsIds?.split(','),
      annees: annees?.split(',').map(a => Number(a)),
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires
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
  } else {
    contenu = JSON.stringify(titresActivitesFormatted)
  }

  return contenu
    ? {
        nom: fileNameCreate(`activites-${titresActivites.length}`, format),
        format,
        contenu
      }
    : null
}

interface IUtilisateursQueryInput {
  format?: IFormat
  entrepriseIds?: string | undefined
  administrationIds?: string | undefined
  permissionIds?: string | undefined
  noms?: string | null
  prenoms?: string | null
  emails?: string | null
}

const utilisateurs = async (
  {
    format = 'json',
    entrepriseIds,
    administrationIds,
    permissionIds,
    noms,
    prenoms,
    emails
  }: IUtilisateursQueryInput,
  userId?: string
) => {
  formatCheck(['json', 'csv', 'ods', 'xlsx'], format)

  const utilisateurs = await utilisateursGet(
    {
      noms,
      prenoms,
      emails,
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
  } else {
    contenu = JSON.stringify(utilisateursFormatted)
  }

  return contenu
    ? {
        nom: fileNameCreate(`utilisateurs-${utilisateurs.length}`, format),
        format,
        contenu
      }
    : null
}

interface IEntreprisesQueryInput {
  format?: IFormat
  noms?: string | null
}

const entreprises = async (
  { format = 'json', noms }: IEntreprisesQueryInput,
  userId?: string
) => {
  formatCheck(['json', 'csv', 'xlsx', 'ods'], format)

  const entreprises = await entreprisesGet({ noms }, {}, userId)

  const user = userId ? await userGet(userId) : undefined

  const entreprisesFormatted = entreprises.map(e => entrepriseFormat(user, e))

  let contenu

  if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = entreprisesFormatTable(entreprisesFormatted)

    contenu = tableConvert('entreprises', elements, format)
  } else {
    contenu = JSON.stringify(entreprisesFormatted)
  }

  return contenu
    ? {
        nom: fileNameCreate(`entreprises-${entreprises.length}`, format),
        format,
        contenu
      }
    : null
}

export { titres, demarches, activites, utilisateurs, entreprises }

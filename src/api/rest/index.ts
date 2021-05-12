import {
  IFormat,
  ITitreColonneId,
  ITitreDemarcheColonneId,
  ITitreActiviteColonneId,
  IUtilisateursColonneId
} from '../../types'

import { titreGet, titresGet } from '../../database/queries/titres'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import { entreprisesGet } from '../../database/queries/entreprises'
import { userGet, utilisateursGet } from '../../database/queries/utilisateurs'

import { titreFormat, titresFormat } from '../_format/titres'
import { titreDemarcheFormat } from '../_format/titres-demarches'
import { titreActiviteFormat } from '../_format/titres-activites'
import { utilisateurFormat } from '../_format/utilisateurs'
import { entrepriseFormat } from '../_format/entreprises'

import { tableConvert } from './_convert'
import { fileNameCreate } from '../../tools/file-name-create'

import {
  titresGeojsonFormat,
  titreGeojsonFormat,
  titresTableFormat
} from './format/titres'
import { titresDemarchesFormatTable } from './format/titres-demarches'
import { titresActivitesFormatTable } from './format/titres-activites'
import { utilisateursFormatTable } from './format/utilisateurs'
import { entreprisesFormatTable } from './format/entreprises'

import { matomo } from '../../tools/matomo'

const formatCheck = (formats: string[], format: string) => {
  if (!formats.includes(format)) {
    throw new Error(`Format « ${format} » non supporté.`)
  }
}

const titreFields = {
  type: { type: { id: {} } },
  domaine: { id: {} },
  statut: { id: {} },
  references: { type: { id: {} } },
  substances: { legales: { id: {} } },
  titulaires: { id: {} },
  amodiataires: { id: {} },
  surfaceEtape: { id: {} },
  points: { id: {} },
  communes: { departement: { region: { pays: { id: {} } } } },
  forets: { id: {} },
  administrationsLocales: { type: { id: {} } },
  administrationsGestionnaires: { type: { id: {} } }
}

interface ITitreInput {
  query: { format?: IFormat }
  params: { id?: string | null }
}

const titre = async (
  { query: { format = 'json' }, params: { id } }: ITitreInput,
  userId?: string
) => {
  const user = await userGet(userId)

  formatCheck(['geojson', 'json'], format)

  const titre = await titreGet(id!, { fields: titreFields }, user)

  const titreFormatted = titreFormat(titre)
  let contenu

  if (format === 'geojson') {
    const titreGeojson = titreGeojsonFormat(titreFormatted)

    contenu = JSON.stringify(titreGeojson, null, 2)
  } else {
    contenu = JSON.stringify(titreFormatted, null, 2)
  }

  return {
    nom: fileNameCreate(titre.id, format),
    format,
    contenu
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
    query: {
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
    }
  }: { query: ITitresQueryInput },
  userId?: string
) => {
  const user = await userGet(userId)

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
    { fields: titreFields },
    user
  )

  const titresFormatted = titresFormat(titres)

  let contenu

  if (format === 'geojson') {
    const elements = titresGeojsonFormat(titresFormatted)

    contenu = JSON.stringify(elements, null, 2)
  } else if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = titresTableFormat(titresFormatted)

    contenu = tableConvert('titres', elements, format)
  } else {
    contenu = JSON.stringify(titresFormatted, null, 2)
  }

  if (matomo) {
    const url = Object.entries({
      format,
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
    })
      .filter(param => param[1] !== undefined)
      .map(param => param.join('='))
      .join('&')

    matomo.track({
      url: `${process.env.API_MATOMO_URL}/matomo.php?${url}`,
      e_c: 'camino-api',
      e_a: `titres-flux-${format}`
    })
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
    query: {
      format = 'json',
      ordre,
      colonne,
      typesIds,
      statutsIds,
      etapesInclues,
      etapesExclues,
      titresTypesIds,
      titresDomainesIds,
      titresStatutsIds,
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires
    }
  }: { query: ITitresDemarchesQueryInput },
  userId?: string
) => {
  const user = await userGet(userId)

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
        type: { etapesTypes: { etapesStatuts: { id: {} } } },
        statut: { id: {} },
        titre: {
          id: {},
          titulaires: { id: {} },
          amodiataires: { id: {} },
          references: { id: {} }
        },
        etapes: { type: { etapesStatuts: { id: {} } } }
      }
    },
    user
  )

  const demarchesFormatted = titresDemarches.map(titreDemarche =>
    titreDemarcheFormat(titreDemarche, titreDemarche.titre!.typeId)
  )

  let contenu = ''

  if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = titresDemarchesFormatTable(demarchesFormatted)

    contenu = tableConvert('demarches', elements, format)
  } else {
    contenu = JSON.stringify(demarchesFormatted, null, 2)
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
  titresTypesIds?: string | null
  titresDomainesIds?: string | null
  titresStatutsIds?: string | null
}

const activites = async (
  {
    query: {
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
      titresTerritoires,
      titresTypesIds,
      titresDomainesIds,
      titresStatutsIds
    }
  }: { query: ITitresActivitesQueryInput },
  userId?: string
) => {
  const user = await userGet(userId)

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
      titresTerritoires,
      titresTypesIds: titresTypesIds?.split(','),
      titresDomainesIds: titresDomainesIds?.split(','),
      titresStatutsIds: titresStatutsIds?.split(',')
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
    user
  )

  const titresActivitesFormatted = titresActivites.map(a =>
    titreActiviteFormat(a)
  )

  let contenu

  if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = titresActivitesFormatTable(titresActivitesFormatted)

    contenu = tableConvert('activites', elements, format)
  } else {
    contenu = JSON.stringify(titresActivitesFormatted, null, 2)
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
  colonne?: IUtilisateursColonneId | null
  ordre?: 'asc' | 'desc' | null
  entrepriseIds?: string
  administrationIds?: string
  permissionIds?: string
  noms?: string | null
  emails?: string | null
}

const utilisateurs = async (
  {
    query: {
      format = 'json',
      colonne,
      ordre,
      entrepriseIds,
      administrationIds,
      permissionIds,
      noms,
      emails
    }
  }: { query: IUtilisateursQueryInput },
  userId?: string
) => {
  const user = await userGet(userId)

  formatCheck(['json', 'csv', 'ods', 'xlsx'], format)

  const utilisateurs = await utilisateursGet(
    {
      colonne,
      ordre,
      entrepriseIds: entrepriseIds?.split(','),
      administrationIds: administrationIds?.split(','),
      permissionIds: permissionIds?.split(','),
      noms,
      emails
    },
    {},
    user
  )

  const utilisateursFormatted = utilisateurs.map(utilisateurFormat)

  let contenu

  if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = utilisateursFormatTable(utilisateursFormatted)

    contenu = tableConvert('utilisateurs', elements, format)
  } else {
    contenu = JSON.stringify(utilisateursFormatted, null, 2)
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
  { query: { format = 'json', noms } }: { query: IEntreprisesQueryInput },
  userId?: string
) => {
  const user = await userGet(userId)

  formatCheck(['json', 'csv', 'xlsx', 'ods'], format)

  const entreprises = await entreprisesGet({ noms }, {}, user)

  const entreprisesFormatted = entreprises.map(entrepriseFormat)

  let contenu

  if (['csv', 'xlsx', 'ods'].includes(format)) {
    const elements = entreprisesFormatTable(entreprisesFormatted)

    contenu = tableConvert('entreprises', elements, format)
  } else {
    contenu = JSON.stringify(entreprisesFormatted, null, 2)
  }

  return contenu
    ? {
        nom: fileNameCreate(`entreprises-${entreprises.length}`, format),
        format,
        contenu
      }
    : null
}

export { titre, titres, demarches, activites, utilisateurs, entreprises }

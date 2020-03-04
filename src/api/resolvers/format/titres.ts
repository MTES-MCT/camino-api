import {
  ITitre,
  IAdministration,
  IGeoJson,
  IUtilisateur,
  IFields
} from '../../../types'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../../tools/geojson'

import { dupRemove } from '../../../tools/index'

import { permissionsCheck } from '../permissions/permissions-check'
import { titreIsPublicCheck, titrePermissionCheck } from '../permissions/titre'
import { titrePermissionAdministrationsCheck } from '../permissions/titre-edition'

import { administrationsFormat } from './administrations'
import { entreprisesFormat } from './entreprises'

import {
  titreActiviteFormatFields,
  titresActivitesFormat,
  titreActiviteCalc
} from './titres-activites'

import {
  titreDemarcheFormatFields,
  titreDemarcheFormat
} from './titres-demarches'

const titreFormatFields = {
  surface: {},
  engagement: {},
  volume: {},
  geojsonMultiPolygon: {},
  geojsonPoints: {},
  pays: {},
  demarches: titreDemarcheFormatFields,
  activites: titreActiviteFormatFields,
  activitesAbsentes: {},
  activitesDeposees: {},
  activitesEnConstruction: {},
  administrations: {}
} as IFields

// optimisation possible pour un expert SQL
// remplacer le contenu de ce fichier
// par des requêtes SQL (dans /database/queries/titres)
// qui retournent les données directement formatées
const titreFormat = (
  user: IUtilisateur | undefined,
  t: ITitre,
  fields: IFields = titreFormatFields
) => {
  const titreIsPublic = titreIsPublicCheck(t)
  const userHasPermission = titrePermissionCheck(
    user,
    ['super', 'admin', 'editeur', 'lecteur'],
    t
  )

  if (!titreIsPublic && !userHasPermission) {
    return null
  }

  const isSuper = permissionsCheck(user, ['super'])
  const isAdmin = permissionsCheck(user, ['admin'])

  if (isSuper || isAdmin) {
    t.editable =
      isSuper ||
      titrePermissionAdministrationsCheck(user, t.typeId, t.statutId!)
    t.supprimable = isSuper
  }

  if (!fields) return t

  if (t.points?.length) {
    if (fields.geojsonMultiPolygon) {
      t.geojsonMultiPolygon = (geojsonFeatureMultiPolygon(
        t.points
      ) as unknown) as IGeoJson
    }

    if (fields.geojsonPoints) {
      t.geojsonPoints = (geojsonFeatureCollectionPoints(
        t.points
      ) as unknown) as IGeoJson
    }
  }

  if (fields.demarches && t.demarches && t.demarches.length) {
    t.demarches = t.demarches.map(td =>
      titreDemarcheFormat(
        user,
        td,
        t.typeId,
        t.statutId!,
        { userHasPermission, isSuper, isAdmin },
        fields.demarches
      )
    )
  }

  if (fields.volume && t.volumeEtape) {
    t.volume = t.volumeEtape.volume
  }

  if (fields.engagement && t.engagementEtape) {
    t.engagement = t.engagementEtape.engagement
  }

  if (fields.surface && t.surfaceEtape) {
    t.surface = t.surfaceEtape.surface
  }

  if (t.activites?.length) {
    t.activitesAbsentes = fields.activitesAbsentes
      ? titreActiviteCalc(
          user,
          t.activites,
          'abs',
          t.amodiataires,
          t.titulaires
        )
      : 0

    t.activitesDeposees = fields.activitesDeposees
      ? titreActiviteCalc(
          user,
          t.activites,
          'dep',
          t.amodiataires,
          t.titulaires
        )
      : 0

    t.activitesEnConstruction = fields.activitesEnConstruction
      ? titreActiviteCalc(
          user,
          t.activites,
          'enc',
          t.amodiataires,
          t.titulaires
        )
      : 0

    if (fields.activites) {
      t.activites = titresActivitesFormat(
        user,
        t.activites,
        t.amodiataires,
        t.titulaires,
        fields.activites
      )
    }
  } else {
    t.activitesAbsentes = 0
    t.activitesDeposees = 0
    t.activitesEnConstruction = 0

    t.activites = []
  }

  if (fields.administrations) {
    const hasAdministrations =
      t.administrationsGestionnaires?.length || t.administrationsLocales?.length
    if (hasAdministrations) {
      // fusionne administrations gestionnaires et locales
      let administrations = dupRemove('id', [
        ...(t.administrationsGestionnaires || []),
        ...(t.administrationsLocales || [])
      ]) as IAdministration[]

      // si l'utilisateur n'a pas de droits de visualisation suffisants
      // alors filtre les administrations `associee`
      administrations = !permissionsCheck(user, [
        'super',
        'admin',
        'editeur',
        'lecteur'
      ])
        ? administrations.filter(a => !a.associee)
        : administrations

      t.administrations = administrations.sort(
        (a, b) => a.type.ordre - b.type.ordre
      )

      t.administrations = administrationsFormat(user, t.administrations)

      delete t.administrationsGestionnaires
      delete t.administrationsLocales
    } else {
      t.administrations = []
    }
  }

  if (t.titulaires) {
    t.titulaires = entreprisesFormat(user, t.titulaires)
  }

  if (t.amodiataires) {
    t.amodiataires = entreprisesFormat(user, t.amodiataires)
  }

  return t
}

const titresFormat = (
  user: IUtilisateur | undefined,
  titres: ITitre[],
  fields = titreFormatFields
) =>
  titres &&
  titres.reduce((acc: ITitre[], titre) => {
    const titreFormated = titreFormat(user, titre, fields)

    if (titreFormated) {
      acc.push(titreFormated)
    }

    return acc
  }, [])

export { titreFormatFields, titreFormat, titresFormat }

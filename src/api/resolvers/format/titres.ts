import {
  ITitre,
  IAdministration,
  IGeoJson,
  IUtilisateur,
  IFields,
  ITitrePropsTitreEtapes
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

const titreContenuTitreEtapesFormat = (t: ITitre) => {
  if (!t.propsTitreEtapesIds) return null

  return Object.keys(t.propsTitreEtapesIds).reduce(
    (contenu: ITitrePropsTitreEtapes, sectionId) =>
      Object.keys(t.propsTitreEtapesIds![sectionId])
        .reduce((contenu, elementId) => {
          if (
            !t.propsTitreEtapesIds ||
            !t.propsTitreEtapesIds[sectionId] ||
            !t.propsTitreEtapesIds[sectionId][elementId]
          ) {
            return contenu
          }

          t.demarches!.some((d) => d.etapes!.some(e => {
            // si l'étape n'est pas celle dans le contenu du titre
            // ou l'étape n'a ni contenu ni section ni l'élément qui nous intéresse
            if (
              e.id !== t.propsTitreEtapesIds![sectionId][elementId] ||
              !e.contenu ||
              !e.contenu[sectionId] ||
              e.contenu[sectionId][elementId] === undefined
            ) {
              return false
            }

            // initialise la section dans le contenu du titre si besoin
            if (!contenu[sectionId]) {
              contenu[sectionId] = {}
            }

            // récupère le contenu de l'étape et assigne au contenu du titre
            contenu[sectionId][elementId] = e.contenu[sectionId][elementId]

            if (!e.type || !e.type.sections) return true

            const etapeSection = e.type.sections.find(s => s.id === sectionId)
            if (!etapeSection || !etapeSection.elements) return true

            const etapeElement = etapeSection.elements.find(e => e.id === elementId)
            if (!etapeElement) return true

            if (!t.type) return true

            // initialise les sections dans le titre si besoin
            if (!t.type.sections) {
              t.type.sections = []
            }

            // ajoute la section dans le titre si elle n'existe pas encore
            let titreSection = t.type.sections.find(s => s.id === sectionId)
            if (!titreSection) {
              titreSection = {
                ...etapeSection,
                elements: []
              }
              t.type.sections.push(titreSection)
            }
            if (!titreSection.elements) {
              titreSection.elements = []
            }

            // ajoute l'élément dans les sections du titre s'il n'existe pas encore
            let titreElement = titreSection.elements.find(e => e.id === elementId)
            if (!titreElement) {
              titreSection.elements.push(etapeElement)
            }

            return true
          }))

          return contenu
        }, contenu),
    {}
  )
}

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

  if (fields.contenu && t.propsTitreEtapesIds) {
    t.contenu = titreContenuTitreEtapesFormat(t)
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

import {
  ITitre,
  ITitreDemarche,
  IAdministration,
  IGeoJson,
  IUtilisateur,
  IFields,
  ISection
} from '../../../types'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../../tools/geojson'

import { dupRemove } from '../../../tools/index'

import { administrationFormat } from './administrations'
import { entrepriseFormat } from './entreprises'

import {
  titreActiviteFormatFields,
  titreActiviteFormat
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
  administrations: {}
} as IFields

const titreTypeSectionsFormat = (t: ITitre) => {
  if (!t.propsTitreEtapesIds) return null

  return Object.keys(t.propsTitreEtapesIds).reduce(
    (sections: ISection[], sectionId) =>
      Object.keys(t.propsTitreEtapesIds![sectionId]).reduce(
        (sections, elementId) => {
          if (
            !t.propsTitreEtapesIds ||
            !t.propsTitreEtapesIds[sectionId] ||
            !t.propsTitreEtapesIds[sectionId][elementId]
          ) {
            return sections
          }

          const etapeId = t.propsTitreEtapesIds![sectionId][elementId]

          t.demarches!.some(d =>
            d.etapes!.some(e => {
              // si l'étape n'est pas celle dans le sections du titre
              if (e.id !== etapeId) {
                return false
              }

              // sinon, si l'étape correspond à l'id de `propsTitreEtapesIds`
              // et que l'étape n'a ni contenu ni section ni l'élément qui nous intéresse
              // on ne cherche pas plus loin
              if (
                !e.contenu ||
                !e.contenu[sectionId] ||
                e.contenu[sectionId][elementId] === undefined ||
                !e.type?.sections
              ) {
                return true
              }

              const etapeSection = e.type.sections.find(s => s.id === sectionId)
              if (!etapeSection || !etapeSection.elements) return true

              const etapeElement = etapeSection.elements.find(
                e => e.id === elementId
              )
              if (!etapeElement) return true

              if (!t.type) return true

              // ajoute la section dans le titre si elle n'existe pas encore
              let titreTypeSection = sections.find(s => s.id === sectionId)
              if (!titreTypeSection) {
                titreTypeSection = {
                  ...etapeSection,
                  elements: []
                }
                sections.push(titreTypeSection)
              }
              if (!titreTypeSection.elements) {
                titreTypeSection.elements = []
              }

              // ajoute l'élément dans les sections du titre s'il n'existe pas encore
              const titreElement = titreTypeSection.elements.find(
                e => e.id === elementId
              )
              if (!titreElement) {
                titreTypeSection.elements.push(etapeElement)
              }

              return true
            })
          )

          return sections
        },
        sections
      ),
    []
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

  if (fields.demarches && t.demarches?.length) {
    t.demarches = t.demarches.map(td =>
      titreDemarcheFormat(user, td, t.typeId, t.statutId!, fields.demarches)
    )
  }

  if (fields.type?.sections) {
    t.type!.sections = titreTypeSectionsFormat(t)
  }

  if (fields.surface && t.surfaceEtape) {
    t.surface = t.surfaceEtape.surface
  }

  if (fields.activites && t.activites?.length) {
    t.activites = t.activites.map(ta =>
      titreActiviteFormat(ta, fields.activites)
    )
  }

  if (fields.administrations) {
    const hasAdministrations =
      t.administrationsGestionnaires?.length || t.administrationsLocales?.length
    if (hasAdministrations) {
      // fusionne administrations gestionnaires et locales
      const administrations = dupRemove('id', [
        ...(t.administrationsGestionnaires || []),
        ...(t.administrationsLocales || [])
      ]) as IAdministration[]

      t.administrations = administrations.sort(
        (a, b) => a.type.ordre - b.type.ordre
      )

      t.administrations = t.administrations.map(a =>
        administrationFormat(user, a)
      )

      delete t.administrationsGestionnaires
      delete t.administrationsLocales
    } else {
      t.administrations = []
    }
  }

  t.titulaires = t.titulaires?.map(e => entrepriseFormat(user, e))

  t.amodiataires = t.amodiataires?.map(e => entrepriseFormat(user, e))

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

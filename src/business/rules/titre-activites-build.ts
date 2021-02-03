import {
  ITitreDemarche,
  IActiviteType,
  ITitreActivite,
  ISubstance,
  ISection,
  ISubstanceFiscale,
  ISectionElement
} from '../../types'

import * as dateFormat from 'dateformat'
import { titreValideCheck } from '../utils/titre-valide-check'
import { titreEtapePropFind } from './titre-etape-prop-find'
import { metasGet } from '../../database/cache/metas'

const substancesFiscalesFind = (substances: ISubstance[]) =>
  substances
    .flatMap(s => s.legales)
    .flatMap(s => s.fiscales)
    .reduce((acc: ISubstanceFiscale[], s) => {
      if (s && !acc.map(({ id }) => id).includes(s.id)) {
        acc.push(s)
      }

      return acc
    }, [])

const titreActiviteSectionElementsFormat = (
  elements: ISectionElement[],
  periodeId: number,
  date: string
) =>
  elements.reduce((newElements: ISectionElement[], e) => {
    // ne conserve que les éléments dont
    // - la période,
    // - la date de début et la date de fin
    // correspondent à l'élément
    if (
      (!e.periodesIds || e.periodesIds.find(id => periodeId === id)) &&
      (!e.dateFin || e.dateFin >= date) &&
      (!e.dateDebut || e.dateDebut < date)
    ) {
      const element = {
        id: e.id,
        nom: e.nom,
        type: e.type,
        description: e.description
      } as ISectionElement

      if (e.optionnel) {
        element.optionnel = true
      }

      if (e.valeurs) {
        element.valeurs = e.valeurs
      } else if (e.valeursMetasNom) {
        element.valeurs = metasGet(e.valeursMetasNom)
      }

      newElements.push(element)
    }

    return newElements
  }, [])

/**
 * Construit les sections d'une activité en fonction de son type
 * @param activiteTypeId - id du type d'activité
 * @param sections - modèle de sections
 * @param periodeId - id de la fréquence de la période (ex: 1 pour le premier trimestre)
 * @param date - date de l'activité
 * @param titreDemarches - démarches du titre
 */

const titreActiviteSectionsBuild = (
  activiteTypeId: string,
  sections: ISection[],
  periodeId: number,
  date: string,
  titreDemarches: ITitreDemarche[]
) =>
  sections.reduce((newSections: ISection[], s) => {
    let elements = [] as ISectionElement[]

    if (s.elements) {
      elements = titreActiviteSectionElementsFormat(s.elements, periodeId, date)
    } else if (
      ['gra', 'grx'].includes(activiteTypeId) &&
      s.id === 'substancesFiscales'
    ) {
      const substances = titreEtapePropFind(
        'substances',
        date,
        titreDemarches
      ) as ISubstance[] | null

      if (substances?.length) {
        const substancesFiscales = substancesFiscalesFind(substances)

        elements = substancesFiscales.map(sf => {
          const element = {
            id: sf.id,
            nom: `${sf.nom}`,
            type: 'number',
            description: `${sf.description} (<b>${sf.unite!.nom}</b>)`,
            uniteId: sf.uniteId
          } as ISectionElement

          if (sf.unite!.referenceUniteRatio) {
            element.referenceUniteRatio = sf.unite!.referenceUniteRatio
          }

          return element
        })
      }
    }

    if (elements.length) {
      const section = {
        id: s.id,
        elements
      } as ISection

      if (s.nom) {
        section.nom = s.nom
      }

      newSections.push(section)
    }

    return newSections
  }, [])

const titreActiviteIsValideCheck = (
  date: string,
  aujourdhui: string,
  periodeId: number,
  annee: number,
  months: number,
  titreDemarches: ITitreDemarche[],
  titreStatutId?: string | null
) => {
  // si la date de fin de l'activité n'est pas passée
  // on ne crée pas l'activité
  if (date > aujourdhui) return false

  // si le statut du titre n'est pas "modification en instance"
  // - cherche si le titre est valide pendant la durée de l'activité

  if (titreStatutId !== 'mod') {
    const dateDebut = dateFormat(
      new Date(annee, (periodeId - 1) * months, 1),
      'yyyy-mm-dd'
    )

    const titreIsValide = titreValideCheck(titreDemarches, dateDebut, date)

    // le titre n'est pas valide pour cette période
    // on ne crée pas l'activité
    if (!titreIsValide) return false
  }

  return true
}

const titreActiviteFind = (
  activiteTypeId: string,
  annee: number,
  periodeId: number,
  titreActivites?: ITitreActivite[] | null
) =>
  !!titreActivites?.length &&
  titreActivites.find(
    a =>
      a.typeId === activiteTypeId &&
      a.annee === annee &&
      a.periodeId === periodeId
  )

/**
 * Construit une activité (si elle n'existe pas déjà)
 * @param typeId - id du type d'activité
 * @param periodeId - id de la période (exemple: 2 pour le 2ème trimestre)
 * @param activiteTypeSections - sections du type d'activité
 * @param annee - année
 * @param months - nombre de mois dans la période (exemple: 3 si la période est le trimestre)
 * @param aujourdhui - date du jour au format yyyy-mm-jj
 * @param titreId - id du titre
 * @param titreDemarches - démarches du titre
 * @param titreStatutId - id du statut du titre
 * @param titreActivites - activités existantes du titres
 */

const titreActiviteBuild = (
  typeId: string,
  periodeId: number,
  activiteTypeSections: ISection[],
  annee: number,
  months: number,
  aujourdhui: string,
  titreId: string,
  titreDemarches: ITitreDemarche[],
  titreStatutId?: string | null,
  titreActivites?: ITitreActivite[] | null
) => {
  // si l'activité existe déjà
  // ne la créée pas
  if (titreActiviteFind(typeId, annee, periodeId, titreActivites)) return null

  // la date de fin de l'activité est le premier jour du mois
  // du début de la période suivante, en fonction de la fréquence
  const date = dateFormat(new Date(annee, periodeId * months, 1), 'yyyy-mm-dd')

  const titreActiviteIsValide = titreActiviteIsValideCheck(
    date,
    aujourdhui,
    periodeId,
    annee,
    months,
    titreDemarches,
    titreStatutId
  )

  if (!titreActiviteIsValide) return null

  const sections = titreActiviteSectionsBuild(
    typeId,
    activiteTypeSections,
    periodeId,
    date,
    titreDemarches
  )

  if (!sections.length) return null

  return {
    titreId,
    date,
    typeId: typeId,
    statutId: 'abs',
    periodeId,
    annee,
    sections
  } as ITitreActivite
}

/**
 * Construit les activités à ajouter sur un titre
 * @param titreId - id du titre
 * @param activiteType - type d'activité
 * @param annees - années pour lesquelles des activités sont à créer
 * @param aujourdhui - date du jour au format yyyy-mm-dd
 * @param titreStatutId - id du statut du titre
 * @param titreDemarches - demarches du titre
 * @returns une liste d'activités
 */

const titreActivitesBuild = (
  activiteType: IActiviteType,
  annees: number[],
  aujourdhui: string,
  titreId: string,
  titreStatutId?: string | null,
  titreDemarches?: ITitreDemarche[] | null,
  titreActivites?: ITitreActivite[] | null
) => {
  // si le titre n'a pas de phases de démarches
  // aucune activité ne peut être créées
  if (!titreDemarches?.some(d => d.phase)) return []

  const periodes = activiteType.frequence![
    activiteType.frequence!.periodesNom!
  ]!
  const months = 12 / periodes.length
  const periodesIndexes = [...new Array(periodes.length)]

  const titresActivites = annees.reduce(
    (titreActivitesNew: ITitreActivite[], annee) =>
      periodesIndexes.reduce((acc: ITitreActivite[], _, i) => {
        const titreActivite = titreActiviteBuild(
          activiteType.id,
          i + 1,
          activiteType.sections,
          annee,
          months,
          aujourdhui,
          titreId,
          titreDemarches,
          titreStatutId,
          titreActivites
        )

        if (titreActivite) {
          acc.push(titreActivite)
        }

        return acc
      }, titreActivitesNew),
    []
  )

  return titresActivites
}

export { titreActivitesBuild, titreActiviteSectionsBuild }

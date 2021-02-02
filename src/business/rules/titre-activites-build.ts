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
import { objectClone } from '../../tools/index'
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
  frequencePeriodeId: number,
  date: string
) =>
  elements.reduce((newElements: ISectionElement[], e) => {
    // ne conserve que les éléments dont
    // - la période,
    // - la date de début et la date de fin
    // correspondent à l'élément
    if (
      (!e.frequencePeriodesIds ||
        e.frequencePeriodesIds.find(id => frequencePeriodeId === id)) &&
      (!e.dateFin || e.dateFin >= date) &&
      (!e.dateDebut || e.dateDebut < date)
    ) {
      const element = {
        id: e.id,
        nom: e.nom,
        type: e.type,
        description: e.description
      } as ISectionElement

      if (e.valeurs) {
        element.valeurs = objectClone(e.valeurs)
      } else if (e.valeursMetasNom) {
        element.valeurs = objectClone(metasGet(e.valeursMetasNom))
      }

      newElements.push(element)
    }

    return newElements
  }, [])

/**
 * Construit les sections d'une activité en fonction de son type
 * @param activiteTypeId - id du type d'activité
 * @param sections - modèle de sections
 * @param frequencePeriodeId - index de la période concernée (ex: 1 pour le premier trimestre)
 * @param date - date de l'activité
 * @param titreDemarches - démarches du titre
 */

const titreActiviteSectionsBuild = (
  activiteTypeId: string,
  sections: ISection[],
  frequencePeriodeId: number,
  date: string,
  titreDemarches: ITitreDemarche[]
) =>
  sections.reduce((newSections: ISection[], s) => {
    let elements = [] as ISectionElement[]

    if (s.elements) {
      elements = titreActiviteSectionElementsFormat(
        s.elements,
        frequencePeriodeId,
        date
      )
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
            description: `${sf.description} (<b>${sf.unite!.nom}</b>)`
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

/**
 * Construit une activité
 * @param activiteType - type d'activité
 * @param annee - année,
 * @param frequencePeriodeId - index de la période concernée (ex: 1 pour le premier trimestre)
 * @param months - nombre de mois concernés (ex : 3 pour un trimestre)
 * @param aujourdhui - date du jour au format yyyy-mm-jj
 * @param titreId - id du titre
 * @param titreDemarches - démarches du titre
 * @param titreStatutId - id du titre
 * @returns une activité ou null
 */

const titreActiviteBuild = (
  activiteType: IActiviteType,
  annee: number,
  frequencePeriodeId: number,
  months: number,
  aujourdhui: string,
  titreId: string,
  titreDemarches: ITitreDemarche[],
  titreStatutId?: string | null
) => {
  // la date de fin de l'activité est le premier jour du mois
  // du début de la période suivante, en fonction de la fréquence
  const date = dateFormat(
    new Date(annee, frequencePeriodeId * months, 1),
    'yyyy-mm-dd'
  )

  // si la date de fin de l'activité n'est pas passée
  // on ne crée pas l'activité
  if (date > aujourdhui) return null

  // si le statut du titre n'est pas "modification en instance"
  // - cherche si le titre est valide pendant la durée de l'activité

  if (titreStatutId !== 'mod') {
    const dateDebut = dateFormat(
      new Date(annee, (frequencePeriodeId - 1) * months, 1),
      'yyyy-mm-dd'
    )

    const titreIsValide = titreValideCheck(titreDemarches, dateDebut, date)

    // le titre n'est pas valide pour cette période
    // on ne crée pas l'activité
    if (!titreIsValide) return null
  }

  // le statut de l'activité créée est 'absente'
  const statutId = 'abs'

  const sections = titreActiviteSectionsBuild(
    activiteType.id,
    activiteType.sections,
    frequencePeriodeId,
    date,
    titreDemarches
  )

  if (!sections.length) {
    return null
  }

  const titreActivite = {
    titreId,
    date,
    typeId: activiteType.id,
    statutId,
    frequencePeriodeId,
    annee,
    sections
  } as ITitreActivite

  return titreActivite
}

const activiteFind = (
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
      a.frequencePeriodeId === periodeId
  )

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

  const periods = activiteType.frequence![activiteType.frequence!.periodesNom!]!
  const months = 12 / periods.length

  const periodsIndexes = [...new Array(periods.length)]

  return annees.reduce(
    (titreActivitesNew: ITitreActivite[], annee) =>
      periodsIndexes.reduce((acc: ITitreActivite[], _, i) => {
        const periodeIndex = i + 1

        // si l'activité existe déjà
        // ne la créée pas
        if (
          activiteFind(activiteType.id, annee, periodeIndex, titreActivites)
        ) {
          return acc
        }

        const titreActivite = titreActiviteBuild(
          activiteType,
          annee,
          periodeIndex,
          months,
          aujourdhui,
          titreId,
          titreDemarches!,
          titreStatutId
        )

        if (titreActivite) {
          acc.push(titreActivite)
        }

        return acc
      }, titreActivitesNew),
    []
  )
}

export { titreActivitesBuild, titreActiviteSectionsBuild }

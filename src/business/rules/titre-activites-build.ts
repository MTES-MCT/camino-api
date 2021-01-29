import {
  ITitre,
  ITitreDemarche,
  IActiviteType,
  ITitreActivite,
  ISubstance,
  ISection,
  ISubstanceFiscale,
  ISectionElement
} from '../../types'

import * as dateFormat from 'dateformat'
import { titreValiditePeriodeCheck } from '../utils/titre-validite-periode-check'
import { titreEtapePropFind } from './titre-etape-prop-find'
import { objectClone } from '../../tools/object-clone'
import metas from '../../database/cache/metas'

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

const titreActiviteSectionElementFormat = (e: ISectionElement) => {
  if (e.valeursMetasNom) {
    e.valeurs = metas[e.valeursMetasNom]

    delete e.valeursMetasNom
  }

  return e
}

const titreActiviteSectionElementsFormat = (
  elements: ISectionElement[],
  periodeId: number | undefined = undefined,
  date: string | undefined = undefined
) =>
  elements.reduce((elements: ISectionElement[], e) => {
    // ne conserve que les éléments dont
    // - la période (si elle existe),
    // - la date de début et la date de fin
    // correspondent à l'élément
    if (
      (!periodeId ||
        !e.frequencePeriodesIds ||
        e.frequencePeriodesIds.find(id => periodeId === id)) &&
      (!date ||
        ((!e.dateFin || e.dateFin >= date) &&
          (!e.dateDebut || e.dateDebut < date)))
    ) {
      e = titreActiviteSectionElementFormat(e)

      elements.push(e)
    }

    return elements
  }, [])

const titreActiviteSectionsFormat = (
  sections: ISection[],
  periodeId?: number,
  date?: string
) =>
  sections.reduce((sections: ISection[], s) => {
    if (s.elements) {
      const elements = titreActiviteSectionElementsFormat(
        s.elements,
        periodeId,
        date
      )

      if (elements?.length) {
        sections.push({
          id: s.id,
          nom: s.nom,
          elements
        })
      }
    }

    return sections
  }, [])

const titreActiviteSectionBuild = (
  activiteType: IActiviteType,
  frequencePeriodeId: number,
  date: string,
  titreDemarches: ITitreDemarche[]
) => {
  const sections = objectClone(activiteType.sections) as ISection[]

  if (['gra', 'grx'].includes(activiteType.id)) {
    const substances = titreEtapePropFind(
      'substances',
      date,
      titreDemarches
    ) as ISubstance[] | null

    const section = sections.find(({ id }) => id === 'substancesFiscales')

    if (substances?.length && section) {
      const substancesFiscales = substancesFiscalesFind(substances)

      section.elements = substancesFiscales.map(sf => ({
        id: sf.id,
        nom: `${sf.nom}`,
        type: 'number',
        description: `${sf.description} (<b>${sf.unite!.nom}</b>)`,
        referenceUniteRatio: sf.unite?.referenceUniteRatio
      }))
    }
  }

  return titreActiviteSectionsFormat(sections, frequencePeriodeId, date)
}

/**
 * Construit une activité
 * @param titreDemarches - démarches d'un titre
 * @param titreStatutId - id du statut du titre
 * @param titreId - id du titre
 * @param typeId - id du type de l'activité
 * @param annee - année,
 * @param periodeIndex - index de la période concernée (ex: 1 pour le premier trimestre)
 * @param monthsCount - nombre de mois concernés (ex : 3 pour un trimestre)
 * @param aujourdhui - date du jour au format YYYY-MM-JJ
 * @returns une activité ou null
 */

const titreActiviteBuild = (
  titreDemarches: ITitreDemarche[],
  titreStatutId: string,
  titreId: string,
  activiteType: IActiviteType,
  annee: number,
  frequencePeriodeId: number,
  monthsCount: number,
  aujourdhui: string
) => {
  const date = dateFormat(
    new Date(annee, frequencePeriodeId * monthsCount, 1),
    'yyyy-mm-dd'
  )

  // si la date de fin de l'activité n'est pas passée
  // on ne crée pas l'activité
  if (date > aujourdhui) return null

  // si le statut du titre n'est pas "modification en instance"
  // - vérifie les dates de validité
  if (titreStatutId !== 'mod') {
    const periodeDateDebut = dateFormat(
      new Date(annee, frequencePeriodeId * monthsCount, 1),
      'yyyy-mm-dd'
    )

    const titreIsValid = titreValiditePeriodeCheck(
      titreDemarches,
      periodeDateDebut,
      date
    )

    // le titre n'est pas valide pour cette période
    // on ne crée pas l'activité
    if (!titreIsValid) return null
  }

  const sections = titreActiviteSectionBuild(
    activiteType,
    frequencePeriodeId,
    date,
    titreDemarches
  )

  const titreActivite = {
    titreId,
    // la date de début de l'activité est le premier jour du mois
    // du début de la période suivante, en fonction de la fréquence
    date,
    typeId: activiteType.id,
    // le statut de l'activité crée automatiquement
    // est 'absente'
    statutId: 'abs',
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
  titreActivites: ITitreActivite[]
) =>
  titreActivites.find(
    a =>
      a.typeId === activiteTypeId &&
      a.annee === annee &&
      a.frequencePeriodeId === periodeId
  )

/**
 * Construit les activités à ajouter sur un titre
 * @param titre - titre
 * @param activiteType - type d'activité
 * @param annees - liste des années
 * @param aujourdhui - date du jour au format yyyy-mm-dd
 * @returns une liste d'activités
 */

const titreActivitesBuild = (
  titre: ITitre,
  activiteType: IActiviteType,
  annees: number[],
  aujourdhui: string
) => {
  const periods = activiteType.frequence![activiteType.frequence!.periodesNom!]!
  const monthsCount = 12 / periods.length

  const { activites: titreActivites } = titre

  const periodsIndexes = [...new Array(periods.length)]

  return annees.reduce(
    (titreActivitesNew: ITitreActivite[], annee) =>
      periodsIndexes.reduce((acc, _, periodeIndex) => {
        // si l'activité existe, inutile de la créer
        if (
          titreActivites &&
          activiteFind(activiteType.id, annee, periodeIndex + 1, titreActivites)
        )
          return acc

        const titreActivite = titreActiviteBuild(
          titre.demarches!,
          titre.statutId!,
          titre.id,
          activiteType,
          annee,
          periodeIndex + 1,
          monthsCount,
          aujourdhui
        )

        if (titreActivite) {
          acc.push(titreActivite)
        }

        return acc
      }, titreActivitesNew),
    []
  )
}

export { titreActivitesBuild }

import {
  ITitre,
  ITitreDemarche,
  IActiviteType,
  ITitreActivite
} from '../../types'

import * as dateFormat from 'dateformat'
import titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

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
  typeId: string,
  annee: number,
  periodeIndex: number,
  monthsCount: number,
  aujourdhui: string
) => {
  const frequencePeriodeId = periodeIndex + 1

  const periodeDateFin = dateFormat(
    new Date(annee, (periodeIndex + 1) * monthsCount, 1),
    'yyyy-mm-dd'
  )

  // si la date de fin de l'activité n'est pas passée
  // on ne crée pas l'activité
  if (periodeDateFin > aujourdhui) return null

  // si le statut du titre n'est pas "modification en instance"
  // - vérifie les dates de validité
  if (titreStatutId !== 'mod') {
    const periodeDateDebut = dateFormat(
      new Date(annee, periodeIndex * monthsCount, 1),
      'yyyy-mm-dd'
    )

    // vérifie la validité du titre pour la période
    const titreIsValid = titreValiditePeriodeCheck(
      titreDemarches,
      periodeDateDebut,
      periodeDateFin
    )

    // le titre n'est pas valide pour cette période
    // on ne crée pas l'activité
    if (!titreIsValid) return null
  }

  const titreActivite = {
    titreId,
    // la date de début de l'activité est le premier jour du mois
    // du début de la période suivante, en fonction de la fréquence
    date: periodeDateFin,
    typeId,
    // le statut de l'activité crée automatiquement
    // est 'absente'
    statutId: 'abs',
    frequencePeriodeId,
    annee
  } as ITitreActivite

  return titreActivite
}

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

  const periodsIndices = [...new Array(periods.length)]

  return annees.reduce(
    (titreActivitesNew: ITitreActivite[], annee) =>
      periodsIndices.reduce((titreActivitesNew, e, periodeIndex) => {
        // cherche si l'activité existe déjà dans le titre
        let titreActivite =
          titreActivites &&
          titreActivites.find(
            a =>
              a.typeId === activiteType.id &&
              a.annee === annee &&
              a.frequencePeriodeId === periodeIndex + 1
          )

        // la ligne d'activité existe déjà pour le titre
        // il n'est pas nécessaire de la créer
        if (titreActivite) return titreActivitesNew

        titreActivite = titreActiviteBuild(
          titre.demarches!,
          titre.statutId!,
          titre.id,
          activiteType.id,
          annee,
          periodeIndex,
          monthsCount,
          aujourdhui
        )

        if (titreActivite) {
          titreActivitesNew.push(titreActivite)
        }

        return titreActivitesNew
      }, titreActivitesNew),
    []
  )
}

export { titreActivitesBuild }

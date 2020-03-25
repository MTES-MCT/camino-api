import {
  ITitreActivite,
  IUtilisateur,
  ITrimestre,
  IMois,
  IAnnee,
  IEntreprise,
  IFields
} from '../../../types'

import { permissionsCheck } from '../permissions/permissions-check'

import { titreActivitePermissionCheck } from '../permissions/titre'

import { titreSectionsFormat } from './titres-sections'

const titreActiviteFormatFields = {
  periode: {},
  sections: {}
} as IFields

const titreActiviteFormat = (
  user: IUtilisateur | undefined,
  ta: ITitreActivite,
  fields: IFields = titreActiviteFormatFields
) => {
  // si
  // - le formatage de la période est requis
  // - l'activité a une périodicité
  // - le type d'activité a une fréquence qui contient un tableau de périodes
  // alors la période de l'activité en cours est définie
  if (
    fields.periode &&
    ta.frequencePeriodeId &&
    ta.type?.frequence?.periodesNom &&
    ta.type.frequence[ta.type.frequence.periodesNom] &&
    ta.type.frequence[ta.type.frequence.periodesNom]!.length
  ) {
    ta.periode = ta.type.frequence[ta.type.frequence.periodesNom]!.find(
      p => p.id === ta.frequencePeriodeId
    ) as IAnnee | ITrimestre | IMois

    // si les sections contiennent des élements sur cette activité
    if (fields.sections && ta.type?.sections) {
      ta.sections = titreSectionsFormat(
        ta.type.sections,
        ta.periode?.id,
        ta.date
      )
    }
  }

  console.log('isSuper:', ta.isSuper)

  ta.editable =
    !!ta.isSuper ||
    !!ta.isAdmin ||
    (permissionsCheck(user, ['entreprise']) && ta.statutId !== 'dep')

  return ta
}

const titresActivitesFormat = (
  user: IUtilisateur | undefined,
  titresActivites: ITitreActivite[],
  titreAmodiataires: IEntreprise[] | undefined | null,
  titreTitulaires: IEntreprise[] | undefined | null,
  fields: IFields = titreActiviteFormatFields
) =>
  titresActivites.reduce((acc: ITitreActivite[], ta) => {
    if (
      titreActivitePermissionCheck(
        user,
        ta.type?.administrations,
        titreAmodiataires,
        titreTitulaires
      )
    ) {
      acc.push(titreActiviteFormat(user, ta, fields))
    }

    return acc
  }, [])

const titreActiviteCalc = (
  user: IUtilisateur | undefined,
  titresActivites: ITitreActivite[],
  statutId: string,
  titreAmodiataires: IEntreprise[] | undefined | null,
  titreTitulaires: IEntreprise[] | undefined | null
) =>
  titresActivites.reduce(
    (acc, titreActivite) =>
      titreActivite.statutId === statutId &&
      titreActivitePermissionCheck(
        user,
        titreActivite.type?.administrations,
        titreAmodiataires,
        titreTitulaires
      )
        ? ++acc
        : acc,
    0
  )

export {
  titreActiviteFormatFields,
  titreActiviteFormat,
  titresActivitesFormat,
  titreActiviteCalc
}

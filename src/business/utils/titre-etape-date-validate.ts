// valide la date et la position de l'étape en fonction des autres étapes
import {
  ITitre,
  ITitreEtape,
  IEtapeType,
  IDemarcheType,
  ITitreTypeEtapeTypeRestriction,
  ITitreEtapeCondition,
  ITitreCondition
} from '../../types'

import titreEtapeDemarcheEtapeTypeFind from './titre-etape-demarche-etape-type-find'
import titresTypesEtapesTypesRestrictions from '../definitions/titres-types-etapes-types-restrictions'

import { contenuConditionMatch, objConditionMatch } from '../../tools/index'

// compile les restrictions `impossibleAvant`
titresTypesEtapesTypesRestrictions.forEach(titreTypeEtapesTypesRestrictions =>
  titreTypeEtapesTypesRestrictions.restrictions.forEach(
    titreTypeEtapeTypeRestriction => {
      if (!titreTypeEtapeTypeRestriction.impossibleApres) return

      titreTypeEtapeTypeRestriction.impossibleApres.forEach(
        impossibleApresUne => {
          let restriction = titreTypeEtapesTypesRestrictions.restrictions.find(
            restriction =>
              objConditionMatch(restriction.condition.etape, impossibleApresUne)
          )

          if (!restriction) {
            restriction = {
              condition: { etape: impossibleApresUne },
              impossibleAvant: []
            }
            titreTypeEtapesTypesRestrictions.restrictions.push(restriction)
          }

          if (!restriction.impossibleAvant) {
            restriction.impossibleAvant = []
          }

          restriction.impossibleAvant.push(
            titreTypeEtapeTypeRestriction.condition.etape
          )
        }
      )
    }
  )
)

const sameContenuCheck = (conditionTitre: ITitreCondition, titre: ITitre) =>
  conditionTitre.contenu &&
  titre.contenu &&
  Object.keys(conditionTitre.contenu).every(
    key =>
      titre.contenu![key] &&
      contenuConditionMatch(conditionTitre.contenu[key], titre.contenu![key])
  )

const titreEtapeTypesRestrictionsFind = (
  titreTypeEtapesTypesRestrictions: ITitreTypeEtapeTypeRestriction[],
  etapeTypeId: string,
  etapeStatutId: string,
  titre: ITitre
) =>
  titreTypeEtapesTypesRestrictions.filter(restrictions => {
    const { condition } = restrictions

    const isSameEtapeType = objConditionMatch(condition.etape, {
      typeId: etapeTypeId,
      statutId: etapeStatutId
    })

    return (
      isSameEtapeType &&
      (!condition.titre || sameContenuCheck(condition.titre, titre))
    )
  })

const impossibleAvantFind = (
  etapeType: IEtapeType,
  date: string,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  impossibleAvant: ITitreEtapeCondition[]
) =>
  impossibleAvant.reduce((errors: string[], impossibleAvantUne) => {
    const impossibleAvantUneEtapeKeys = Object.keys(impossibleAvantUne)

    const titreEtapeBefore = titreDemarcheEtapes.find(
      e =>
        objConditionMatch(impossibleAvantUne, e, impossibleAvantUneEtapeKeys) &&
        date < e.date
    )

    // si on trouve une étape avant, alors c'est une erreur
    if (titreEtapeBefore) {
      const titreEtapeBeforeType = titreEtapeDemarcheEtapeTypeFind(
        impossibleAvantUne.typeId,
        demarcheType.etapesTypes,
        demarcheType.nom
      )

      errors.push(
        `Une étape « ${etapeType.nom} » ne peut être créée avant une étape « ${titreEtapeBeforeType.nom} ».`
      )
    }

    return errors
  }, [])

const impossibleApresFind = (
  etapeType: IEtapeType,
  date: string,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  impossibleApres: ITitreEtapeCondition[]
) =>
  impossibleApres.reduce((errors: string[], impossibleApresUne) => {
    const impossibleApresUneEtapeKeys = Object.keys(impossibleApresUne)

    const titreEtapeAfter = titreDemarcheEtapes.find(
      e =>
        objConditionMatch(impossibleApresUne, e, impossibleApresUneEtapeKeys) &&
        e.date < date
    )

    // si on trouve une étape après, alors c'est une erreur
    if (titreEtapeAfter) {
      const titreEtapeAfterType = titreEtapeDemarcheEtapeTypeFind(
        impossibleApresUne.typeId,
        demarcheType.etapesTypes,
        demarcheType.nom
      )

      errors.push(
        `Une étape « ${etapeType.nom} » ne peut être créée après une étape « ${
          titreEtapeAfterType.nom
        } »${
          impossibleApresUne.statutId
            ? ` (dont le statut est « ${impossibleApresUne.statutId} »)`
            : ''
        }.`
      )
    }

    return errors
  }, [])

const obligatoireApresFind = (
  etapeType: IEtapeType,
  date: string,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  obligatoireApres: ITitreEtapeCondition[]
) => {
  const errors = obligatoireApres.reduce(
    (errors: string[], obligatoireApresUne) => {
      const obligatoireApresUneEtapeKeys = Object.keys(obligatoireApresUne)

      const titreEtapeBefore = titreDemarcheEtapes.find(
        e =>
          objConditionMatch(
            obligatoireApresUne,
            e,
            obligatoireApresUneEtapeKeys
          ) && e.date <= date
      )

      if (!titreEtapeBefore) {
        // si on ne trouve pas l'étape nécessaire, alors c'est une erreur
        const titreEtapeBeforeType = titreEtapeDemarcheEtapeTypeFind(
          obligatoireApresUne.typeId,
          demarcheType.etapesTypes,
          demarcheType.nom
        )

        errors.push(
          `Une étape « ${titreEtapeBeforeType.nom} » antérieure${
            obligatoireApresUne.statutId
              ? ` (dont le statut est « ${obligatoireApresUne.statutId} »)`
              : ''
          } est nécessaire pour la création d'une étape « ${etapeType.nom} ».`
        )
      }

      return errors
    },
    []
  )

  // si il n'y a pas au moins une étape parmis les étapes obligatoire possibles
  // alors on ne peut pas créer l'étape
  return errors.length === obligatoireApres.length ? errors : []
}

const titreEtapeTypesRestrictionsCheck = (
  titreEtapeTypesRestrictions: ITitreTypeEtapeTypeRestriction[],
  etapeType: IEtapeType,
  date: string,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[]
) =>
  titreEtapeTypesRestrictions.reduce(
    (errors: string[], titreEtapeTypesRestrictions) => {
      const {
        condition,
        impossible,
        obligatoireApres,
        impossibleApres,
        impossibleAvant
      } = titreEtapeTypesRestrictions

      if (impossible) {
        const statutId = condition.etape && condition.etape.statutId

        errors.push(
          `L'étape « ${etapeType.nom} »${
            statutId ? ` avec un statut « ${statutId} »` : ''
          } est impossible.`
        )
      }

      // l'étape nécessite une étape antérieure pour pouvoir exister
      if (obligatoireApres) {
        const errorsObligatoire = obligatoireApresFind(
          etapeType,
          date,
          demarcheType,
          titreDemarcheEtapes,
          obligatoireApres
        )

        if (errorsObligatoire.length) {
          errors.push(...errorsObligatoire)
        }
      }

      // l'étape ne peut se trouver après une étape postérieure
      if (impossibleApres) {
        const errorsApres = impossibleApresFind(
          etapeType,
          date,
          demarcheType,
          titreDemarcheEtapes,
          impossibleApres
        )
        if (errorsApres.length) {
          errors.push(...errorsApres)
        }
      }

      if (impossibleAvant) {
        const errorsAvant = impossibleAvantFind(
          etapeType,
          date,
          demarcheType,
          titreDemarcheEtapes,
          impossibleAvant
        )
        if (errorsAvant.length) {
          errors.push(...errorsAvant)
        }
      }

      return errors
    },
    []
  )

const titreEtapeDateValidate = (
  etapeTypeId: string,
  etapeStatutId: string,
  date: string,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  titre: ITitre
) => {
  // pas de validation pour les titres qui n'ont pas d'arbre de restrictions
  const titreTypeEtapesTypesRestrictions = titresTypesEtapesTypesRestrictions.find(
    r =>
      r.typeId === titre.typeId &&
      (r.demarcheTypeIds.includes(demarcheType.id) || !demarcheType.id)
  )
  if (!titreTypeEtapesTypesRestrictions) return null

  // pas de validation si l'étape est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (date < '2019-10-31') return null

  const titreEtapeTypesRestrictions = titreEtapeTypesRestrictionsFind(
    titreTypeEtapesTypesRestrictions.restrictions,
    etapeTypeId,
    etapeStatutId,
    titre
  )

  // l'étape à vérifier ne fait l'objet d'aucune restriction
  if (!titreEtapeTypesRestrictions.length) return null

  const etapeType = titreEtapeDemarcheEtapeTypeFind(
    etapeTypeId,
    demarcheType.etapesTypes,
    demarcheType.nom
  )

  const titreEtapesDateErrors = titreEtapeTypesRestrictionsCheck(
    titreEtapeTypesRestrictions,
    etapeType,
    date,
    demarcheType,
    titreDemarcheEtapes
  )

  return titreEtapesDateErrors.length ? titreEtapesDateErrors.join('\n') : null
}

export default titreEtapeDateValidate

// valide la date et la position de l'étape en fonction des autres étapes
import {
  ITitre,
  ITitreDemarche,
  ITitreEtape,
  IEtapeType,
  ITitreTypeEtapeTypeRestriction,
  ITitreEtapeCondition,
  ITitreCondition
} from '../../types'

import titreEtapeDemarcheEtapeTypeFind from './titre-etape-demarche-etape-type-find'
import titresTypesEtapesTypesRestrictions from '../definitions/titres-types-etapes-types-restrictions'

import { objConditionMatch } from '../../tools/index'

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
      objConditionMatch(conditionTitre.contenu[key], titre.contenu![key])
  )

const titreEtapeTypesRestrictionsFind = (
  titreTypeEtapesTypesRestrictions: ITitreTypeEtapeTypeRestriction[],
  titreEtape: ITitreEtape,
  titre: ITitre
) =>
  titreTypeEtapesTypesRestrictions.filter(restrictions => {
    const { condition } = restrictions

    const isSameEtapeType = objConditionMatch(condition.etape, titreEtape)

    const isSameContenu =
      !condition.titre || sameContenuCheck(condition.titre, titre)

    return isSameEtapeType && isSameContenu
  })

const impossibleAvantFind = (
  titreDemarche: ITitreDemarche,
  titreEtapeType: IEtapeType,
  titreEtapeDate: string,
  impossibleAvant: ITitreEtapeCondition[]
) =>
  impossibleAvant.reduce((errors: string[], impossibleAvantUne) => {
    const impossibleAvantUneEtapeKeys = Object.keys(impossibleAvantUne)

    const titreEtapeBefore = titreDemarche.etapes!.find(
      e =>
        objConditionMatch(impossibleAvantUne, e, impossibleAvantUneEtapeKeys) &&
        titreEtapeDate < e.date
    )

    // si on trouve une étape avant, alors c'est une erreur
    if (titreEtapeBefore) {
      const titreEtapeBeforeType = titreEtapeDemarcheEtapeTypeFind(
        titreDemarche.type!,
        impossibleAvantUne.typeId
      )

      errors.push(
        `Une étape « ${titreEtapeType.nom} » ne peut être créée avant une étape « ${titreEtapeBeforeType.nom} ».`
      )
    }

    return errors
  }, [])

const impossibleApresFind = (
  titreDemarche: ITitreDemarche,
  titreEtapeType: IEtapeType,
  titreEtapeDate: string,
  impossibleApres: ITitreEtapeCondition[]
) => {
  const errors = impossibleApres.reduce(
    (errors: string[], impossibleApresUne) => {
      const impossibleApresUneEtapeKeys = Object.keys(impossibleApresUne)

      const titreEtapeAfter = titreDemarche.etapes!.find(
        e =>
          objConditionMatch(
            impossibleApresUne,
            e,
            impossibleApresUneEtapeKeys
          ) && e.date < titreEtapeDate
      )

      // si on trouve une étape après, alors c'est une erreur
      if (titreEtapeAfter) {
        const titreEtapeAfterType = titreEtapeDemarcheEtapeTypeFind(
          titreDemarche.type!!,
          impossibleApresUne.typeId
        )

        errors.push(
          `Une étape « ${
            titreEtapeType.nom
          } » ne peut être créée après une étape « ${
            titreEtapeAfterType.nom
          } »${
            impossibleApresUne.statutId
              ? ` (dont le statut est « ${impossibleApresUne.statutId} »)`
              : ''
          }.`
        )
      }

      return errors
    },
    []
  )

  return errors.length === impossibleApres.length ? errors : []
}

const obligatoireApresFind = (
  titreDemarche: ITitreDemarche,
  titreEtapeType: IEtapeType,
  titreEtapeDate: string,
  obligatoireApres: ITitreEtapeCondition[]
) => {
  const errors = obligatoireApres.reduce(
    (errors: string[], obligatoireApresUne) => {
      const obligatoireApresUneEtapeKeys = Object.keys(obligatoireApresUne)

      const titreEtapeBefore = titreDemarche.etapes!.find(
        e =>
          objConditionMatch(
            obligatoireApresUne,
            e,
            obligatoireApresUneEtapeKeys
          ) && e.date <= titreEtapeDate
      )

      if (!titreEtapeBefore) {
        // si on ne trouve pas l'étape nécessaire, alors c'est une erreur
        const titreEtapeBeforeType = titreEtapeDemarcheEtapeTypeFind(
          titreDemarche.type!!,
          obligatoireApresUne.typeId
        )

        errors.push(
          `Une étape « ${titreEtapeBeforeType.nom} » antérieure${
            obligatoireApresUne.statutId
              ? ` (dont le statut est « ${obligatoireApresUne.statutId} »)`
              : ''
          } est nécessaire pour la création d'une étape « ${
            titreEtapeType.nom
          } ».`
        )
      }

      return errors
    },
    []
  )

  return errors.length === obligatoireApres.length ? errors : []
}

const titreEtapeTypesRestrictionsCheck = (
  titreEtapeTypesRestrictions: ITitreTypeEtapeTypeRestriction[],
  titreEtape: ITitreEtape,
  titreEtapeType: IEtapeType,
  titreDemarche: ITitreDemarche
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
          `L'étape « ${titreEtapeType.nom} »${
            statutId ? ` avec un statut « ${statutId} »` : ''
          } est impossible.`
        )
      }

      // l'étape nécessite une étape antérieure pour pouvoir exister
      if (obligatoireApres) {
        const errorsObligatoire = obligatoireApresFind(
          titreDemarche,
          titreEtapeType,
          titreEtape.date,
          obligatoireApres
        )

        if (errorsObligatoire.length) {
          errors.push(...errorsObligatoire)
        }
      }

      // l'étape ne peut se trouver après une étape postérieure
      if (impossibleApres) {
        const errorsApres = impossibleApresFind(
          titreDemarche,
          titreEtapeType,
          titreEtape.date,
          impossibleApres
        )
        if (errorsApres.length) {
          errors.push(...errorsApres)
        }
      }

      if (impossibleAvant) {
        const errorsAvant = impossibleAvantFind(
          titreDemarche,
          titreEtapeType,
          titreEtape.date,
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
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre
) => {
  // pas de validation pour les titres qui n'ont pas d'arbre de restrictions
  const titreTypeEtapesTypesRestrictions = titresTypesEtapesTypesRestrictions.find(
    r => r.typeId === titre.typeId &&
      r.demarcheTypeId === titreDemarche.typeId
  )
  if (!titreTypeEtapesTypesRestrictions) return null

  // pas de validation si l'étape est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (titreEtape.date < '2019-10-31') return null

  const titreEtapeTypesRestrictions = titreEtapeTypesRestrictionsFind(
    titreTypeEtapesTypesRestrictions.restrictions,
    titreEtape,
    titre
  )

  // l'étape à vérifier ne fait l'objet d'aucune restriction
  if (!titreEtapeTypesRestrictions.length) return null

  const titreEtapeType = titreEtapeDemarcheEtapeTypeFind(
    titreDemarche.type!!,
    titreEtape.typeId
  )

  const titreEtapesDateErrors = titreEtapeTypesRestrictionsCheck(
    titreEtapeTypesRestrictions,
    titreEtape,
    titreEtapeType,
    titreDemarche
  )

  return titreEtapesDateErrors.length ? titreEtapesDateErrors.join('\n') : null
}

export default titreEtapeDateValidate

// valide la date et la position de l'étape en fonction des autres étapes

import titreEtapeDemarcheEtapeTypeFind from './titre-etape-demarche-etape-type-find'
import titresTypesEtapesTypesRestrictions from '../definitions/titres-types-etapes-types-restrictions'

import { objConditionMatch } from '../../tools/index'

// compile les restrictions `impossibleAvant`
Object.keys(titresTypesEtapesTypesRestrictions).forEach(typeId => {
  const titreTypeEtapesTypesRestrictions =
    titresTypesEtapesTypesRestrictions[typeId]

  titreTypeEtapesTypesRestrictions.forEach(titreTypeEtapesTypesRestriction => {
    if (!titreTypeEtapesTypesRestriction) {
      return false
    }

    const { impossibleAvant = [] } = titreTypeEtapesTypesRestriction

    const { condition } = titreTypeEtapesTypesRestriction
    if (!condition || !condition.etape) return false

    const conditionEtapeTypeId = condition.etape.typeId

    titreTypeEtapesTypesRestriction.impossibleAvant = titreTypeEtapesTypesRestrictions.reduce(
      (impossibleAvant, restriction) => {
        if (
          restriction &&
          restriction.impossibleApres &&
          restriction.impossibleApres.some(
            impossibleApresUne =>
              impossibleApresUne.typeId === conditionEtapeTypeId
          )
        ) {
          impossibleAvant.push({
            typeId: restriction.condition.etape.typeId
          })
        }

        return impossibleAvant
      },
      impossibleAvant
    )
  })
})

const sameContenuCheck = (conditionTitre, titre) =>
  conditionTitre.contenu &&
  titre.contenu &&
  Object.keys(conditionTitre.contenu).every(
    key =>
      titre.contenu[key] &&
      objConditionMatch(conditionTitre.contenu[key], titre.contenu[key])
  )

const titreEtapeTypesRestrictionsFind = (
  titreTypeEtapesTypesRestrictions,
  titreEtape,
  titre
) =>
  titreTypeEtapesTypesRestrictions.filter(restrictions => {
    if (!restrictions) return false

    const { condition } = restrictions
    if (!condition) return false

    const isSameEtapeType =
      condition.etape && objConditionMatch(condition.etape, titreEtape)

    const isSameContenu =
      !condition.titre || sameContenuCheck(condition.titre, titre)

    return isSameEtapeType && isSameContenu
  })

const impossibleAvantFind = (
  titreDemarche,
  titreEtapeType,
  titreEtapeDate,
  impossibleAvant
) =>
  impossibleAvant.reduce((errors, impossibleAvantUne) => {
    const impossibleAvantUneEtapeKeys = Object.keys(impossibleAvantUne)

    const titreEtapeBefore = titreDemarche.etapes.find(
      e =>
        objConditionMatch(impossibleAvantUne, e, impossibleAvantUneEtapeKeys) &&
        titreEtapeDate < e.date
    )

    // si on trouve une étape avant, alors c'est une erreur
    if (titreEtapeBefore) {
      const titreEtapeBeforeType = titreEtapeDemarcheEtapeTypeFind(
        titreDemarche.type,
        impossibleAvantUne.typeId
      )

      errors.push(
        `Une étape « ${titreEtapeType.nom} » ne peut être créée avant une étape « ${titreEtapeBeforeType.nom} ».`
      )
    }

    return errors
  }, [])

const impossibleApresFind = (
  titreDemarche,
  titreEtapeType,
  titreEtapeDate,
  impossibleApres
) => {
  const errors = impossibleApres.reduce((errors, impossibleApresUne) => {
    // si l'étape doit être la première de la démarche
    if (impossibleApresUne === '*') {
      const titreEtapeAfter = titreDemarche.etapes.find(
        e => e.typeId !== titreEtapeType.id && e.date < titreEtapeDate
      )

      // si on trouve une étape après, alors c'est une erreur
      if (titreEtapeAfter) {
        errors.push(
          `Une étape « ${titreEtapeType.nom} » ne peut être créée après aucune autre étape.`
        )
      }

      return errors
    }

    const impossibleApresUneEtapeKeys = Object.keys(impossibleApresUne)

    const titreEtapeAfter = titreDemarche.etapes.find(
      e =>
        objConditionMatch(impossibleApresUne, e, impossibleApresUneEtapeKeys) &&
        e.date < titreEtapeDate
    )

    // si on trouve une étape après, alors c'est une erreur
    if (titreEtapeAfter) {
      const titreEtapeAfterType = titreEtapeDemarcheEtapeTypeFind(
        titreDemarche.type,
        impossibleApresUne.typeId
      )

      errors.push(
        `Une étape « ${titreEtapeType.nom} » ne peut être créée après une étape « ${titreEtapeAfterType.nom} ».`
      )
    }

    return errors
  }, [])

  return errors.length === impossibleApres.length ? errors : []
}

const obligatoireApresFind = (
  titreDemarche,
  titreEtapeType,
  titreEtapeDate,
  obligatoireApres
) => {
  const errors = obligatoireApres.reduce((errors, obligatoireApresUne) => {
    const obligatoireApresUneEtapeKeys = Object.keys(obligatoireApresUne)

    const titreEtapeBefore = titreDemarche.etapes.find(
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
        titreDemarche.type,
        obligatoireApresUne.typeId
      )

      errors.push(
        `Une étape « ${titreEtapeBeforeType.nom} » antérieure${
          obligatoireApresUne.statutId
            ? ` (dont le statut est « ${
                Array.isArray(obligatoireApresUne.statutId)
                  ? obligatoireApresUne.statutId.join(' ou ')
                  : obligatoireApresUne.statutId
              } »)`
            : ''
        } est nécessaire pour la création d'une étape « ${
          titreEtapeType.nom
        } ».`
      )
    }

    return errors
  }, [])

  return errors.length === obligatoireApres.length ? errors : []
}

const titreEtapeTypesRestrictionsCheck = (
  titreEtapeTypesRestrictions,
  titreEtape,
  titreEtapeType,
  titreDemarche
) =>
  titreEtapeTypesRestrictions.reduce((errors, titreEtapeTypesRestrictions) => {
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

    if (impossibleAvant && impossibleAvant.length > 0) {
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
  }, [])

const titreEtapeDateValidate = (titreEtape, titreDemarche, titre) => {
  // pas de validation pour les titres qui n'ont pas d'arbre de restrictions
  const titreTypeEtapesTypesRestrictions =
    titresTypesEtapesTypesRestrictions[titre.typeId]
  if (!titreTypeEtapesTypesRestrictions) return null

  // pas de validation si l'étape est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (titreEtape.date < '2019-10-31') return null

  const titreEtapeTypesRestrictions = titreEtapeTypesRestrictionsFind(
    titreTypeEtapesTypesRestrictions,
    titreEtape,
    titre
  )

  // l'étape à vérifier ne fait l'objet d'aucune restriction
  if (!titreEtapeTypesRestrictions.length) return null

  const titreEtapeType = titreEtapeDemarcheEtapeTypeFind(
    titreDemarche.type,
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

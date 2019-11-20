import titreEtapeDemarcheEtapeTypeFind from './titre-etape-demarche-etape-type-find'
import titreEtapesTypesRestrictions from '../definitions/titre-etapes-types-restrictions'

import { objConditionMatch } from '../../tools/index'

// valide la date et la position de l'étape en fonction des autres étapes

titreEtapesTypesRestrictions.forEach(restrictions => {
  if (!restrictions) return false

  const { condition } = restrictions
  if (!condition || !condition.etape) return false

  restrictions.impossibleAvantDes = titreEtapesTypesRestrictions.reduce(
    (impossibleAvantDes, restriction) => {
      if (
        restriction &&
        restriction.impossibleApresUne &&
        condition.etape.typeId === restriction.impossibleApresUne.typeId
      ) {
        impossibleAvantDes.push({ typeId: restriction.condition.etape.typeId })
      }

      return impossibleAvantDes
    },
    []
  )
})

const titreEtapeTypesRestrictionsFind = (titreEtape, titreDemarche, titre) =>
  titreEtapesTypesRestrictions.find(restrictions => {
    if (!restrictions) return false

    const { condition } = restrictions
    if (!condition) return false

    const isSameEtapeType =
      condition.etape && objConditionMatch(condition.etape, titreEtape)

    const isSameMecanisation =
      !condition.titre ||
      (titre.contenu &&
        titre.contenu.onf &&
        condition.titre.contenu &&
        condition.titre.contenu.onf &&
        condition.titre.contenu.onf.mecanisee === titre.contenu.onf.mecanisee)

    return isSameEtapeType && isSameMecanisation
  })

const titreEtapeTypesRestrictionsCheck = (
  titreEtapeTypesRestrictions,
  titreEtape,
  titreEtapeType,
  titreDemarche,
  titreEtapeCurrent
) => {
  const errors = []

  const {
    obligatoireApresUne,
    impossibleApresUne,
    impossibleAvantDes
  } = titreEtapeTypesRestrictions

  // l'étape nécessite une étape antérieure pour pouvoir exister
  if (obligatoireApresUne) {
    const obligatoireApresUneEtapeKeys = Object.keys(obligatoireApresUne)

    const titreEtapeBefore = titreDemarche.etapes.find(
      e =>
        objConditionMatch(
          obligatoireApresUne,
          e,
          obligatoireApresUneEtapeKeys
        ) && e.date <= titreEtape.date
    )

    // si on ne trouve pas l'étape nécessaire, alors c'est une erreur
    if (!titreEtapeBefore) {
      const titreEtapeBeforeType = titreEtapeDemarcheEtapeTypeFind(
        titreDemarche.type,
        obligatoireApresUne.typeId
      )

      errors.push(
        `Une étape « ${
          titreEtapeBeforeType.nom
        } » antérieure est nécessaire pour la création d'une étape « ${
          titreEtapeType.nom
        } »${
          obligatoireApresUne.statutId
            ? ` dont le statut est « ${
                Array.isArray(obligatoireApresUne.statutId)
                  ? obligatoireApresUne.statutId.join(' ou ')
                  : obligatoireApresUne.statutId
              } »`
            : ''
        }.`
      )
    }
  }

  // l'étape ne peut se trouver après une étape postérieure
  if (impossibleApresUne) {
    // si l'étape doit être la première de la démarche
    if (impossibleApresUne === '*') {
      const titreEtapeAfter = titreDemarche.etapes.find(
        e => e.typeId !== titreEtape.typeId && e.date < titreEtape.date
      )

      // si on trouve une étape après, alors c'est une erreur
      if (titreEtapeAfter) {
        errors.push(
          `Une étape « ${titreEtapeType.nom} » ne peut être créée après aucune autre étape.`
        )
      }
    } else {
      const impossibleApresUneEtapeKeys = Object.keys(impossibleApresUne)

      const titreEtapeAfter = titreDemarche.etapes.find(
        e =>
          objConditionMatch(
            impossibleApresUne,
            e,
            impossibleApresUneEtapeKeys
          ) && e.date < titreEtape.date
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
    }
  }

  if (impossibleAvantDes && impossibleAvantDes.length > 0) {
    impossibleAvantDes.forEach(impossibleAvantUne => {
      const impossibleAvantUneEtapeKeys = Object.keys(impossibleAvantUne)

      const titreEtapeBefore = titreDemarche.etapes.find(
        e =>
          objConditionMatch(
            impossibleAvantUne,
            e,
            impossibleAvantUneEtapeKeys
          ) && titreEtape.date < e.date
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
    })
  }

  return errors
}

// TODO: remonter le paramètre dans le titre et supprimer
const titreMecanisationCheck = titreDemarches => {
  // TODO: attention, façon simpliste de chercher la mécanisation
  // TODO: gérer la démarche de mécanisation (?)
  const mecanisation = titreDemarches.find(d =>
    d.etapes
      .slice()
      .reverse()
      .find(e => e.contenu && e.contenu.onf && e.contenu.onf.mecanisee)
  )

  return mecanisation !== undefined
}

const titreEtapeDateCheck = (titreEtape, titreDemarche, titre) => {
  // pas de validation pour les titres autres qu'ARM
  if (titre.typeId !== 'arm') return null

  // pas de validation si l'étape est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (titreEtape.date < '2019-10-31') return null

  // TODO: remonter le paramètre dans le titre et supprimer
  const mecanisee = titreMecanisationCheck(titre.demarches)
  titre.contenu = { onf: { mecanisee } }

  const titreEtapeTypesRestrictions = titreEtapeTypesRestrictionsFind(
    titreEtape,
    titreDemarche,
    titre
  )

  // l'étape à vérifier ne fait l'objet d'aucune restriction
  if (!titreEtapeTypesRestrictions) return null

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

export default titreEtapeDateCheck

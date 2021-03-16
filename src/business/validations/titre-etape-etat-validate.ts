// valide la date et la position de l'étape en fonction des autres étapes
import { ITitreEtape, IContenu, Index } from '../../types'

import {
  ITitreCondition,
  IContenuElementCondition,
  IEtapeTypeIdCondition,
  IDemarcheDefinitionRestrictions,
  IDemarcheDefinitionRestrictionsProps
} from '../rules-demarches/definitions'

const contenuConditionMatch = (
  condition: IContenuElementCondition,
  obj: Index<any> | null,
  keys: string[] | null = null
) => {
  // si les conditions sont testées plusieurs fois, (dans une boucle par ex)
  // alors les clés de l'objet de condition peuvent être passées optionnellement
  // pour ne pas les recalculer à chaque fois
  const conditionKeys = keys || Object.keys(condition)

  return conditionKeys.every(k => {
    const contenuElementCondition = condition[k]

    let contenuValeur = obj ? obj[k] : undefined
    if (!contenuValeur) {
      if (typeof contenuElementCondition?.valeur === 'number') {
        contenuValeur = 0
      } else if (typeof contenuElementCondition?.valeur === 'boolean') {
        contenuValeur = false
      }
    }

    switch (contenuElementCondition?.operation) {
      case 'NOT_EQUAL':
        return contenuElementCondition.valeur !== contenuValeur
      default:
        return contenuElementCondition?.valeur === contenuValeur
    }
  })
}

const sameContenuCheck = (
  conditionTitre: ITitreCondition,
  contenu: IContenu | null
) =>
  conditionTitre.contenu &&
  Object.keys(conditionTitre.contenu).every(key =>
    contenuConditionMatch(
      conditionTitre.contenu[key],
      contenu ? contenu[key] : null
    )
  )

const titreEtapeTypeIdRestrictionsFind = (
  demarcheDefinitionRestrictions: IDemarcheDefinitionRestrictions,
  etapeTypeId: string
) => {
  const etapeTypeIdDefinitions = demarcheDefinitionRestrictions[etapeTypeId]

  if (etapeTypeIdDefinitions) {
    return etapeTypeIdDefinitions
  }

  throw new Error(
    `l’étape ${etapeTypeId} n’existe pas dans cet arbre d’instructions`
  )
}

const etapesEnAttenteGet = (
  etapeTypeIdDefinitions: IDemarcheDefinitionRestrictions,
  titreDemarcheEtapes: ITitreEtape[]
) => {
  return etapesSuivantesEnAttenteGet(
    titreDemarcheEtapes,
    titreDemarcheEtapes,
    [],
    etapeTypeIdDefinitions
  )
}

const etapesSuivantesEnAttenteGet = (
  titreDemarcheEtapes: ITitreEtape[],
  titreDemarcheEtapesSuivantes: ITitreEtape[],
  etapesEnAttente: ITitreEtape[],
  etapeTypeIdDefinitions: IDemarcheDefinitionRestrictions
): ITitreEtape[] => {
  if (!titreDemarcheEtapesSuivantes || !titreDemarcheEtapesSuivantes.length) {
    return etapesEnAttente
  }

  const etapeCourante = titreDemarcheEtapesSuivantes.slice(0, 1)[0]
  const etapesSuivantes = titreDemarcheEtapesSuivantes.slice(1)

  if (!etapesEnAttente || !etapesEnAttente.length) {
    return etapesSuivantesEnAttenteGet(
      titreDemarcheEtapes,
      etapesSuivantes,
      [etapeCourante],
      etapeTypeIdDefinitions
    )
  }

  const etapeCouranteConditions = etapeTypeIdDefinitions[
    etapeCourante.typeId
  ] as IDemarcheDefinitionRestrictionsProps

  // on cherche quelles étapes en attente ont permis d’atteindre cette étape
  if (etapeCouranteConditions.justeApres) {
    etapesEnAttente.forEach(etape => {
      const predicatCheck = etapeCouranteConditions!
        .justeApres!.flat()
        .find(c => c?.etapeTypeId === etape.typeId)

      if (predicatCheck) {
        // si cette étape a permis d’atteindre l’étape courante, alors on la remplace dans les étapes en attente
        etapesEnAttente = etapesEnAttente.filter(e => {
          const etapeSeparationHas = etapeTypeIdDefinitions[e.typeId]

          if (etapeSeparationHas && etapeSeparationHas.separation) {
            return !etapeSeparationHas.separation!.includes(
              etapeCourante.typeId!
            )
          }

          return e.typeId !== etape.typeId
        })
      }
    })
  }

  if (etapeCouranteConditions.apres) {
    titreDemarcheEtapes.forEach(etape => {
      const predicatCheck = etapeCouranteConditions
        .apres!.flat()
        .find(c => c?.etapeTypeId === etape.typeId)

      if (predicatCheck) {
        if (
          (etapeCouranteConditions.justeApres.length &&
            etapeCouranteConditions.justeApres[0].length) ||
          !etapeCouranteConditions.final
        ) {
          etapesEnAttente = etapesEnAttente.filter(
            e =>
              !etapeCouranteConditions.justeApres
                .flatMap(d => d)
                .map(a => a.etapeTypeId)
                .includes(e.typeId!)
          )
        } else {
          // Si c’est une étape sans de « justeAprès », c’est que c’est une interruption de la démarche
          etapesEnAttente = []
        }
      }
    })
  }
  etapesEnAttente.push(etapeCourante)

  return etapesSuivantesEnAttenteGet(
    titreDemarcheEtapes,
    etapesSuivantes,
    etapesEnAttente,
    etapeTypeIdDefinitions
  )
}

const etapeTypeIdConditionsCheck = (
  contenu: IContenu | null,
  titreDemarcheEtapes: ITitreEtape[],
  conditions: IEtapeTypeIdCondition[][]
) =>
  conditions.some(condition =>
    condition.every(c => {
      if (c.titre && !sameContenuCheck(c.titre, contenu)) {
        return false
      }

      return titreDemarcheEtapes.find(etape => {
        let result = true

        if (c.etapeTypeId) {
          result = result && c.etapeTypeId === etape.typeId
        }
        if (c.statutId) {
          result = result && c.statutId === etape.statutId
        }

        return result
      })
    })
  )

const etapesEnAttenteToString = (titreEtapesEnAttente: ITitreEtape[]) =>
  titreEtapesEnAttente
    .map(t => (t.type ? t.type.nom : t.typeId))
    .map(t => `"${t}"`)
    .join(', ')

const titreEtapeEtatValidate = (
  etapeTypeIdDefinitions: IDemarcheDefinitionRestrictions,
  etapeTypeId: string,
  titreDemarcheEtapes: ITitreEtape[],
  contenu: IContenu | null
) => {
  const errors = []
  const titreEtapesEnAttente = etapesEnAttenteGet(
    etapeTypeIdDefinitions,
    titreDemarcheEtapes
  )

  if (titreEtapesEnAttente.find(e => e.typeId === etapeTypeId)) {
    errors.push(
      `l’étape "${etapeTypeId}" ne peut-être effecutée 2 fois d’affilée`
    )
  }

  const titreEtapeRestrictions = titreEtapeTypeIdRestrictionsFind(
    etapeTypeIdDefinitions,
    etapeTypeId
  )

  const { avant, apres, justeApres } = titreEtapeRestrictions

  if (
    !errors.length &&
    avant &&
    etapeTypeIdConditionsCheck(contenu, titreDemarcheEtapes, avant)
  ) {
    errors.push(
      `l’étape "${etapeTypeId}" n’est plus possible après ${etapesEnAttenteToString(
        titreEtapesEnAttente
      )}`
    )
  }

  if (
    !errors.length &&
    apres &&
    !etapeTypeIdConditionsCheck(contenu, titreDemarcheEtapes, apres)
  ) {
    errors.push(
      `l’étape "${etapeTypeId}" n’est pas possible après ${etapesEnAttenteToString(
        titreEtapesEnAttente
      )}`
    )
  }

  if (
    !errors.length &&
    justeApres.length &&
    !etapeTypeIdConditionsCheck(contenu, titreEtapesEnAttente, justeApres)
  ) {
    errors.push(
      `l’étape "${etapeTypeId}" n’est pas possible juste après ${etapesEnAttenteToString(
        titreEtapesEnAttente
      )}`
    )
  }

  if (!errors.length) {
    if (!justeApres.length || justeApres.some(c => !c.length)) {
      if (titreDemarcheEtapes.map(e => e.typeId).includes(etapeTypeId)) {
        errors.push(`l’étape "${etapeTypeId}" existe déjà`)
      }
    }
  }

  return errors
}

export {
  titreEtapeEtatValidate,
  etapesSuivantesEnAttenteGet,
  titreEtapeTypeIdRestrictionsFind
}

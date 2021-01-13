// valide la date et la position de l'étape en fonction des autres étapes
import {
  ITitre,
  ITitreEtape,
  IDemarcheType,
  ITitreCondition
} from '../../types'

import { contenuConditionMatch } from '../../tools/index'
import {
  etapeTypeIdDefinitionsGet,
  IEtapeTypeIdCondition,
  IEtapeTypeIdDefinition
} from '../demarches-etats-definitions/demarches-etats-definitions'
import { titrePropsContenuGet } from '../processes/titres-props-contenu-update'
import { titreContenuFormat } from '../../api/_format/titres-contenu'
import titreEtapesSortAscByDate from './titre-etapes-sort-asc-by-date'

const sameContenuCheck = (conditionTitre: ITitreCondition, titre: ITitre) =>
  conditionTitre.contenu &&
  Object.keys(conditionTitre.contenu).every(key =>
    contenuConditionMatch(
      conditionTitre.contenu[key],
      titre.contenu ? titre.contenu[key] : null
    )
  )

const titreEtapeTypeIdRestrictionsFind = (
  titreEtapeTypeIdRestrictions: IEtapeTypeIdDefinition[],
  etapeTypeId: string
) => {
  const etapeTypeIdDefinitions = titreEtapeTypeIdRestrictions.find(
    restriction => {
      return restriction.etapeTypeId === etapeTypeId
    }
  )

  if (etapeTypeIdDefinitions) {
    return etapeTypeIdDefinitions
  }

  throw new Error(
    `l’étape ${etapeTypeId} n’existe pas dans cet arbre d’instructions`
  )
}

const etapesEnAttenteGet = (
  etapeTypeIdDefinitions: IEtapeTypeIdDefinition[],
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
  etapeTypeIdDefinitions: IEtapeTypeIdDefinition[]
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

  const etapeCouranteConditions = etapeTypeIdDefinitions.find(
    definition => definition.etapeTypeId === etapeCourante.typeId
  ) as IEtapeTypeIdDefinition

  // on cherche quelles étapes en attente ont permis d’atteindre cette étape
  if (etapeCouranteConditions.justeApres) {
    etapesEnAttente.forEach(etape => {
      const predicatCheck = etapeCouranteConditions!
        .justeApres!.flat()
        .find(c => c?.etapeTypeId === etape.typeId)

      if (predicatCheck) {
        // si cette étape a permis d’atteindre l’étape courante, alors on la remplace dans les étapes en attente
        etapesEnAttente = etapesEnAttente.filter(e => {
          const etapeSeparationHas = etapeTypeIdDefinitions.find(
            definition =>
              definition.etapeTypeId === e.typeId && definition.separation
          )

          if (etapeSeparationHas) {
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
  titre: ITitre,
  titreDemarcheEtapes: ITitreEtape[],
  conditions: IEtapeTypeIdCondition[][]
) =>
  conditions.some(condition =>
    condition.every(c => {
      if (c.titre && !sameContenuCheck(c.titre, titre)) {
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

const titreEtapeTypeIdRestrictionsCheck = (
  etapeTypeIdDefinitions: IEtapeTypeIdDefinition[],
  etapeTypeId: string,
  titreDemarcheEtapes: ITitreEtape[],
  titre: ITitre
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
    etapeTypeIdConditionsCheck(titre, titreDemarcheEtapes, avant)
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
    !etapeTypeIdConditionsCheck(titre, titreDemarcheEtapes, apres)
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
    !etapeTypeIdConditionsCheck(titre, titreEtapesEnAttente, justeApres)
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

const titreDemarcheEtatValidate = (
  etapeTypeIdDefinitions: IEtapeTypeIdDefinition[],
  demarcheType: IDemarcheType,
  titreEtapes: ITitreEtape[],
  titre: ITitre
) => {
  // Si on tente d’insérer ou de modifier une étape, il faut regarder
  // qu’on puisse la mettre avec son nouveau etapeTypeId à la nouvelle date souhaitée
  // et que les étapes après celle-ci soient toujours possibles

  // Vérifie que toutes les étapes existent dans l’arbre
  const etapeTypeIdsValid = etapeTypeIdDefinitions.map(r => r.etapeTypeId)
  const etapeInconnue = titreEtapes.find(
    etape => !etapeTypeIdsValid.includes(etape.typeId!)
  )

  if (etapeInconnue) {
    return [`l’étape ${etapeInconnue.typeId} n’existe pas dans l’arbre`]
  }

  titreEtapes = titreEtapesSortAscByDate(
    titreEtapes,
    'demarches',
    demarcheType,
    titre.typeId
  )

  for (let i = 0; i < titreEtapes.length; i++) {
    // On doit recalculer les sections de titre pour chaque étape,
    // car elles ont peut-être été modifiées après l’étape en cours
    const titreTemp = JSON.parse(JSON.stringify(titre)) as ITitre
    const titreDemarche = titreTemp.demarches?.find(
      d => d.typeId === demarcheType.id
    )

    if (!titreDemarche) {
      throw new Error(
        'le titre ne contient pas la démarche en cours de modification'
      )
    }

    const etapes = titreEtapes.slice(0, i)
    titreDemarche.etapes = etapes
    const { propsTitreEtapesIds } = titrePropsContenuGet(titreTemp)
    if (propsTitreEtapesIds) {
      titreTemp.contenu = titreContenuFormat(
        propsTitreEtapesIds,
        titre.demarches
      )
    }

    const titreEtapeTypeIdErrors = titreEtapeTypeIdRestrictionsCheck(
      etapeTypeIdDefinitions,
      titreEtapes[i].typeId!,
      etapes,
      titreTemp
    )

    if (titreEtapeTypeIdErrors.length) {
      return titreEtapeTypeIdErrors
    }
  }

  return null
}

const titreDemarcheEtapesBuild = (
  titreDemarcheEtapes: ITitreEtape[],
  titreEtape: ITitreEtape,
  suppression = false
) => {
  // quand on ajoute une étape, on ne connaît pas encore sa date.
  // on doit donc proposer tous les types d'étape possibles
  if (!titreEtape.date) {
    titreEtape.date = '2300-01-01'
  }

  // si nous n’ajoutons pas une nouvelle étape
  // on supprime l’étape en cours de modification ou de suppression
  const titreEtapes = titreDemarcheEtapes.reduce((acc: ITitreEtape[], te) => {
    if (te.id !== titreEtape.id) {
      acc.push(te)
    }

    // modification
    if (!suppression && te.id === titreEtape.id) {
      acc.push(titreEtape)
    }

    return acc
  }, [])

  // création
  if (!titreEtape.id) {
    titreEtapes.push(titreEtape)
  }

  return titreEtapes
}

const titreDemarcheUpdatedEtatValidate = (
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  titre: ITitre,
  titreEtape: ITitreEtape,
  suppression = false
) => {
  const etapeTypeIdDefinitions = etapeTypeIdDefinitionsGet(
    titre.typeId,
    demarcheType.id
  )
  // pas de validation pour les démarches qui n'ont pas d'arbre d’instructions
  if (!etapeTypeIdDefinitions) return null

  // pas de validation si la démarche est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (
    titreDemarcheEtapes.length &&
    titreDemarcheEtapes.reverse()[0].date < '2019-10-31'
  )
    return null

  const titreDemarcheEtapesNew = titreDemarcheEtapesBuild(
    titreDemarcheEtapes,
    titreEtape,
    suppression
  )

  // On vérifie que la nouvelle démarche respecte son arbre d’instructions
  return titreDemarcheEtatValidate(
    etapeTypeIdDefinitions,
    demarcheType,
    titreDemarcheEtapesNew,
    titre
  )
}

export {
  titreDemarcheUpdatedEtatValidate,
  titreDemarcheEtapesBuild,
  etapesSuivantesEnAttenteGet,
  titreDemarcheEtatValidate,
  titreEtapeTypeIdRestrictionsFind
}

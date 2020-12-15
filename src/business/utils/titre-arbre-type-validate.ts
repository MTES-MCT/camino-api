// valide la date et la position de l'étape en fonction des autres étapes
import {
  ITitre,
  ITitreEtape,
  IDemarcheType,
  ITitreCondition
} from '../../types'

import { contenuConditionMatch } from '../../tools/index'
import {
  arbreDemarcheGet,
  IArbreCondition,
  IArbreEtape,
  IArbresDemarches
} from '../arbres-demarches/arbres-demarches'
import titreEtapesSortAscByDate from './titre-etapes-sort-asc-by-date'

const sameContenuCheck = (conditionTitre: ITitreCondition, titre: ITitre) =>
  conditionTitre.contenu &&
  Object.keys(conditionTitre.contenu).every(key =>
    contenuConditionMatch(
      conditionTitre.contenu[key],
      titre.contenu ? titre.contenu[key] : null
    )
  )

const titreArbreTypeIdRestrictionsFind = (
  titreArbreTypeIdRestrictions: IArbreEtape[],
  arbreTypeId: string
) => {
  const restrictions = titreArbreTypeIdRestrictions.find(restriction => {
    return restriction.arbreTypeId === arbreTypeId
  })

  if (restrictions) {
    return restrictions
  }

  throw new Error(
    `L’étape ${arbreTypeId} n’existe pas dans cet arbre d’instructions`
  )
}

const etapesEnAttenteGet = (
  arbre: IArbreEtape[],
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  titreTypeId: string
) => {
  const titreEtapesAscSort = titreEtapesSortAscByDate(
    titreDemarcheEtapes,
    demarcheType,
    titreTypeId
  )

  return etapesSuivantesEnAttenteGet(
    titreEtapesAscSort,
    titreEtapesAscSort,
    [],
    arbre
  )
}

const etapesSuivantesEnAttenteGet = (
  titreDemarcheEtapes: ITitreEtape[],
  titreDemarcheEtapesSuivantes: ITitreEtape[],
  etapesEnAttente: ITitreEtape[],
  arbre: IArbreEtape[]
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
      arbre
    )
  }

  const etapeCouranteConditions = arbre.find(
    etapeCondition => etapeCondition.arbreTypeId === etapeCourante.arbreTypeId
  ) as IArbreEtape

  // on cherche quelles étapes en attente ont permis d’atteindre cette étape
  if (etapeCouranteConditions.justeApres) {
    etapesEnAttente.forEach(etape => {
      const predicatCheck = etapeCouranteConditions!
        .justeApres!.flat()
        .find(c => c?.arbreTypeId === etape.arbreTypeId)

      if (predicatCheck) {
        // si cette étape a permis d’atteindre l’étape courante, alors on la remplace dans les étapes en attente
        etapesEnAttente = etapesEnAttente.filter(e => {
          const etapeSeparationHas = arbre.find(
            etapeCondition =>
              etapeCondition.arbreTypeId === e.arbreTypeId &&
              etapeCondition.separation
          )

          if (etapeSeparationHas) {
            return !etapeSeparationHas.separation!.includes(
              etapeCourante.arbreTypeId!
            )
          }

          return e.arbreTypeId !== etape.arbreTypeId
        })
      }
    })
  }
  if (etapeCouranteConditions.apres) {
    titreDemarcheEtapes.forEach(etape => {
      const predicatCheck = etapeCouranteConditions
        .apres!.flat()
        .find(c => c?.arbreTypeId === etape.arbreTypeId)

      if (predicatCheck) {
        if (
          etapeCouranteConditions.justeApres.length &&
          etapeCouranteConditions.justeApres[0].length
        ) {
          etapesEnAttente = etapesEnAttente.filter(
            e =>
              !etapeCouranteConditions.justeApres
                .flatMap(d => d)
                .map(a => a.arbreTypeId)
                .includes(e.arbreTypeId!)
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
    arbre
  )
}

const arbreConditionsCheck = (
  titre: ITitre,
  titreDemarcheEtapes: ITitreEtape[],
  conditions: IArbreCondition[][]
) =>
  conditions.some(condition =>
    condition.every(c => {
      if (c.titre && !sameContenuCheck(c.titre, titre)) {
        return false
      }

      return titreDemarcheEtapes.find(etape => {
        let result = true

        if (c.arbreTypeId) {
          result = result && c.arbreTypeId === etape.arbreTypeId
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
    .map(t => (t.type ? t.type.nom : t.arbreTypeId))
    .map(t => `"${t}"`)
    .join(', ')

const titreArbreTypeIdRestrictionsCheck = (
  arbre: IArbreEtape[],
  arbreTypeId: string,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  titre: ITitre
) => {
  const errors = []
  const titreEtapesEnAttente = etapesEnAttenteGet(
    arbre,
    demarcheType,
    titreDemarcheEtapes,
    titre.typeId
  )

  if (titreEtapesEnAttente.find(e => e.arbreTypeId === arbreTypeId)) {
    errors.push(
      `L’étape "${arbreTypeId}" ne peut-être effecutée 2 fois d’affilée`
    )
  }

  const titreEtapeRestrictions = titreArbreTypeIdRestrictionsFind(
    arbre,
    arbreTypeId
  )

  const { avant, apres, justeApres } = titreEtapeRestrictions

  if (
    !errors.length &&
    avant &&
    arbreConditionsCheck(titre, titreDemarcheEtapes, avant)
  ) {
    errors.push(
      `L’étape "${arbreTypeId}" n’est plus possible après ${etapesEnAttenteToString(
        titreEtapesEnAttente
      )}`
    )
  }

  if (
    !errors.length &&
    apres &&
    !arbreConditionsCheck(titre, titreDemarcheEtapes, apres)
  ) {
    errors.push(
      `L’étape "${arbreTypeId}" n’est pas possible après ${etapesEnAttenteToString(
        titreEtapesEnAttente
      )}`
    )
  }

  if (
    !errors.length &&
    justeApres.length &&
    !arbreConditionsCheck(titre, titreEtapesEnAttente, justeApres)
  ) {
    errors.push(
      `L’étape "${arbreTypeId}" n’est pas possible juste après ${etapesEnAttenteToString(
        titreEtapesEnAttente
      )}`
    )
  }

  return errors
}

const titreEtapesSortAsc = (
  titreEtapes: ITitreEtape[],
  restrictions: IArbreEtape[]
) =>
  titreEtapes.slice().sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    // si les deux étapes ont la même date
    // on utilise l'arbre pour trouver quelle étape provoque l’autre
    const aRestriction = restrictions.find(
      arbreEtape => arbreEtape.arbreTypeId === a.arbreTypeId
    )

    if (
      aRestriction!.justeApres
        .flat(2)
        .find(a => a?.arbreTypeId === b.arbreTypeId)
    ) {
      return 1
    }

    const bRestriction = restrictions.find(
      arbreEtape => arbreEtape.arbreTypeId === b.arbreTypeId
    )
    if (
      bRestriction!.justeApres
        .flat(2)
        .find(b => b?.arbreTypeId === a.arbreTypeId)
    ) {
      return -1
    }

    return a.ordre! - b.ordre!
  })

const titreDemarcheArbreValidate = (
  arbreDemarche: IArbresDemarches,
  demarcheType: IDemarcheType,
  titreEtapes: ITitreEtape[],
  titre: ITitre
) => {
  // Si on tente d’insérer ou de modifier une étape, il faut regarder
  // qu’on puisse la mettre avec son nouveau arbreTypeId à la nouvelle date souhaitée
  // et que les étapes après celle-ci soient toujours possibles

  // Vérifie que toutes les étapes existent dans l’arbre
  const arbreTypeIdsValid = arbreDemarche.restrictions.map(r => r.arbreTypeId)
  const etapeInconnue = titreEtapes.find(
    etape => !arbreTypeIdsValid.includes(etape.arbreTypeId!)
  )
  if (etapeInconnue) {
    return `L’étape ${etapeInconnue.arbreTypeId} n’existe pas dans l’arbre`
  }

  titreEtapes = titreEtapesSortAsc(titreEtapes, arbreDemarche.restrictions)
  for (let i = 0; i < titreEtapes.length; i++) {
    const titreArbreTypeIdErrors = titreArbreTypeIdRestrictionsCheck(
      arbreDemarche.restrictions,
      titreEtapes[i].arbreTypeId!,
      demarcheType,
      titreEtapes.slice(0, i),
      titre
    )
    if (titreArbreTypeIdErrors.length) {
      return titreArbreTypeIdErrors.join('\n')
    }
  }

  return null
}

const titreArbreTypeIdValidate = (
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  titre: ITitre,
  titreEtape: ITitreEtape,
  supprimer = false
) => {
  const arbreDemarche = arbreDemarcheGet(titre.typeId, demarcheType.id)
  // pas de validation pour les démarches qui n'ont pas d'arbre de restrictions
  if (!arbreDemarche) return null

  // pas de validation si l'étape est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (titreEtape.date && titreEtape.date < '2019-10-31') return null

  if (!titreEtape.date) {
    titreEtape.date = '2300-01-01'
  }

  let titreEtapes = JSON.parse(
    JSON.stringify(titreDemarcheEtapes)
  ) as ITitreEtape[]

  // Si nous n’ajoutons pas une nouvelle étape
  if (titreEtape.id) {
    // On supprime l’étape en cours de modification ou de suppression
    titreEtapes = titreEtapes.filter(e => e.id !== titreEtape.id)
  }

  // Si nous ne sommes pas en cours de suppression de l’étape
  if (!supprimer) {
    // On ajoute la nouvelle étape à la démarche que l’on souhaite ajouter
    titreEtapes.push(titreEtape)
  }

  // On vérifie que la nouvelle démarche respecte son arbre d’instructions
  return titreDemarcheArbreValidate(
    arbreDemarche,
    demarcheType,
    titreEtapes,
    titre
  )
}

export {
  titreArbreTypeIdValidate,
  etapesSuivantesEnAttenteGet,
  titreDemarcheArbreValidate,
  titreEtapesSortAsc,
  titreArbreTypeIdRestrictionsFind
}

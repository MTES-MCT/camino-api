// valide la date et la position de l'étape en fonction des autres étapes
import { ITitre, ITitreEtape, IDemarcheType, ITitreDemarche } from '../../types'

import {
  demarcheDefinitionFind,
  IDemarcheDefinitionRestrictions
} from '../rules-demarches/definitions'
import { contenusTitreEtapesIdsFind } from '../utils/props-titre-etapes-ids-find'
import { titreContenuFormat } from '../../database/models/_format/titres-contenu'
import titreEtapesSortAscByDate from '../utils/titre-etapes-sort-asc-by-date'
import { titreEtapeEtatValidate } from './titre-etape-etat-validate'
import { titreDemarcheDepotDemandeDateFind } from '../rules/titre-demarche-depot-demande-date-find'
import { objectClone } from '../../tools/index'

const titreDemarcheEtapesBuild = (
  titreEtape: ITitreEtape,
  suppression: boolean,
  titreDemarcheEtapes?: ITitreEtape[] | null
) => {
  if (!titreDemarcheEtapes?.length) {
    return [titreEtape]
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

// vérifie que  la démarche est valide par rapport aux définitions des types d'étape
const titreDemarcheEtatValidate = (
  demarcheDefinitionRestrictions: IDemarcheDefinitionRestrictions[],
  demarcheType: IDemarcheType,
  titreEtapes: ITitreEtape[],
  titre: ITitre
) => {
  // Si on tente d’insérer ou de modifier une étape, il faut regarder
  // qu’on puisse la mettre avec son nouveau etapeTypeId à la nouvelle date souhaitée
  // et que les étapes après celle-ci soient toujours possibles

  // Vérifie que toutes les étapes existent dans l’arbre
  const etapeTypeIdsValid = demarcheDefinitionRestrictions.map(
    r => r.etapeTypeId
  )
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

  // on copie les démarches car on va les modifier en ajoutant les étapes une à une
  const titreDemarches = titre.demarches
    ? (objectClone(titre.demarches) as ITitreDemarche[])
    : []

  const titreDemarche = titreDemarches.find(d => d.typeId === demarcheType.id)

  if (!titreDemarche) {
    throw new Error(
      'le titre ne contient pas la démarche en cours de modification'
    )
  }

  for (let i = 0; i < titreEtapes.length; i++) {
    // On doit recalculer les sections de titre pour chaque étape,
    // car elles ont peut-être été modifiées après l’étape en cours
    const etapes = titreEtapes.slice(0, i)
    titreDemarche.etapes = etapes

    const contenusTitreEtapesIds = contenusTitreEtapesIdsFind(
      titre.statutId!,
      [titreDemarche],
      titre.type!.contenuIds
    )

    let contenu = null
    if (contenusTitreEtapesIds) {
      contenu = titreContenuFormat(contenusTitreEtapesIds, [titreDemarche])
    }

    const titreEtapeErrors = titreEtapeEtatValidate(
      demarcheDefinitionRestrictions,
      titreEtapes[i].typeId!,
      etapes,
      contenu
    )

    if (titreEtapeErrors.length) {
      return titreEtapeErrors
    }
  }

  return []
}

// vérifie que la modification de la démarche
// est valide par rapport aux définitions des types d'étape
const titreDemarcheUpdatedEtatValidate = (
  demarcheType: IDemarcheType,
  titre: ITitre,
  titreEtape: ITitreEtape,
  titreDemarcheEtapes?: ITitreEtape[] | null,
  suppression = false
) => {
  const demarcheDefinition = demarcheDefinitionFind(
    titre.typeId,
    demarcheType.id
  )

  // pas de validation pour les démarches qui n'ont pas d'arbre d’instructions
  if (!demarcheDefinition) return []

  const titreDemarcheEtapesNew = titreDemarcheEtapesBuild(
    titreEtape,
    suppression,
    titreDemarcheEtapes
  )

  // pas de validation si la démarche est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (
    titreDemarcheDepotDemandeDateFind(titreDemarcheEtapesNew) <
    demarcheDefinition.dateDebut
  )
    return []

  // On vérifie que la nouvelle démarche respecte son arbre d’instructions
  const titreDemarchesErrors = titreDemarcheEtatValidate(
    demarcheDefinition.restrictions,
    demarcheType,
    titreDemarcheEtapesNew,
    titre
  )

  return titreDemarchesErrors
}

export { titreDemarcheUpdatedEtatValidate, titreDemarcheEtatValidate }

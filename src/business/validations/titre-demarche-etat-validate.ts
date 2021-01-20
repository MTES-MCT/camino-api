// valide la date et la position de l'étape en fonction des autres étapes
import { ITitre, ITitreEtape, IDemarcheType, ITitreDemarche } from '../../types'

import {
  demarcheDefinitionFind,
  IDemarcheDefinitionRestrictions
} from '../rules-demarches/definitions'
import { propsTitreEtapesIdsFind } from '../utils/props-titre-etapes-ids-find'
import { titreContenuFormat } from '../../database/models/_format/titres-contenu'
import titreEtapesSortAscByDate from '../utils/titre-etapes-sort-asc-by-date'
import { titreEtapeEtatValidate } from './titre-etape-etat-validate'
import { titreDemarcheDepotDemandeDateFind } from '../rules/titre-demarche-depot-demande-date-find'

const titreDemarcheEtapesBuild = (
  titreEtape: ITitreEtape,
  suppression: boolean,
  titreDemarcheEtapes?: ITitreEtape[] | null
) => {
  // quand on ajoute une étape, on ne connaît pas encore sa date.
  // on doit donc proposer tous les types d'étape possibles
  if (!titreEtape.date) {
    titreEtape.date = '2300-01-01'
  }

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
    ? (JSON.parse(JSON.stringify(titre.demarches)) as ITitreDemarche[])
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

    const propsTitreEtapesIds = propsTitreEtapesIdsFind(
      titre.statutId!,
      titreDemarches!,
      titre.type!.propsEtapesTypes
    )

    let contenu = null
    if (propsTitreEtapesIds) {
      contenu = titreContenuFormat(propsTitreEtapesIds, titre.demarches)
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

  // pas de validation si la démarche est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (
    titreDemarcheEtapes &&
    titreDemarcheDepotDemandeDateFind(titreDemarcheEtapes) <
      demarcheDefinition.dateDebut
  )
    return []

  const titreDemarcheEtapesNew = titreDemarcheEtapesBuild(
    titreEtape,
    suppression,
    titreDemarcheEtapes
  )

  // On vérifie que la nouvelle démarche respecte son arbre d’instructions
  return titreDemarcheEtatValidate(
    demarcheDefinition.restrictions,
    demarcheType,
    titreDemarcheEtapesNew,
    titre
  )
}

export { titreDemarcheUpdatedEtatValidate, titreDemarcheEtatValidate }

// valide la date et la position de l'étape en fonction des autres étapes
import { ITitre, ITitreEtape, IDemarcheType, ITitreDemarche } from '../../types'

import {
  demarcheDefinitionFind,
  IDemarcheDefinitionRestrictions
} from '../rules-demarches/definitions'
import { contenusTitreEtapesIdsFind } from '../utils/props-titre-etapes-ids-find'
import { titreContenuFormat } from '../../database/models/_format/titre-contenu'
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
  demarcheDefinitionRestrictions: IDemarcheDefinitionRestrictions,
  demarcheType: IDemarcheType,
  titreDemarche: ITitreDemarche,
  titreEtapes: ITitreEtape[],
  titre: ITitre
) => {
  // Si on tente d’insérer ou de modifier une étape, il faut regarder
  // qu’on puisse la mettre avec son nouveau etapeTypeId à la nouvelle date souhaitée
  // et que les étapes après celle-ci soient toujours possibles

  titreEtapes = titreEtapesSortAscByDate(
    titreEtapes,
    'demarches',
    demarcheType,
    titre.typeId
  )

  // on copie la démarche car on va les modifier en ajoutant les étapes une à une
  const demarche = objectClone(titreDemarche)

  for (let i = 0; i < titreEtapes.length; i++) {
    // On doit recalculer les sections de titre pour chaque étape,
    // car elles ont peut-être été modifiées après l’étape en cours
    const etapes = titreEtapes.slice(0, i)
    demarche.etapes = etapes

    const contenusTitreEtapesIds = contenusTitreEtapesIdsFind(
      titre.statutId!,
      [demarche],
      titre.type!.contenuIds
    )

    let contenu = null
    if (contenusTitreEtapesIds) {
      contenu = titreContenuFormat(contenusTitreEtapesIds, [demarche])
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

  let titreDemarcheEtapesNew = titreDemarcheEtapesBuild(
    titreEtape,
    suppression,
    titreDemarcheEtapes
  )

  // pas de validation si la démarche est antérieure ou égale au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (
    titreDemarcheDepotDemandeDateFind(titreDemarcheEtapesNew) <=
    demarcheDefinition.dateDebut
  )
    return []

  // vérifie que toutes les étapes existent dans l’arbre
  const etapeTypeIdsValid = Object.keys(demarcheDefinition.restrictions)

  const etapeInconnue = titreDemarcheEtapesNew.find(
    etape => !etapeTypeIdsValid.includes(etape.typeId!)
  )
  if (etapeInconnue) {
    return [`l’étape ${etapeInconnue.typeId} n’existe pas dans l’arbre`]
  }

  // vérifie que la démarche existe dans le titre
  const titreDemarche = titre.demarches?.find(d => d.typeId === demarcheType.id)
  if (!titreDemarche) {
    throw new Error(
      'le titre ne contient pas la démarche en cours de modification'
    )
  }

  // si on essaye d’ajouter ou de modifier une demande non déposée
  if (
    titreEtape.typeId === 'mfr' &&
    titreEtape.statutId !== 'dep' &&
    !suppression
  ) {
    const etapesDemande = titreDemarcheEtapes?.filter(te => te.typeId === 'mfr')

    // si c’est la création de la première demande, pas besoin de faire de vérification avec l’arbre
    if (!etapesDemande || !etapesDemande.length) {
      return []
    }

    // ou si on modifie la demande déja en construction, pas besoin de faire de vérification avec l’arbre
    if (etapesDemande.length === 1 && titreEtape.id === etapesDemande[0].id) {
      return []
    }

    throw new Error('il y a déjà une demande en construction')
  } else {
    // on supprime la demande en construction de la liste des étapes, car elle n’est pas gérée par les arbres
    titreDemarcheEtapesNew = titreDemarcheEtapesNew.filter(
      te => te.typeId !== 'mfr' || te.statutId !== 'aco'
    )
  }
  // On vérifie que la nouvelle démarche respecte son arbre d’instructions
  const titreDemarchesErrors = titreDemarcheEtatValidate(
    demarcheDefinition.restrictions,
    demarcheType,
    titreDemarche,
    titreDemarcheEtapesNew,
    titre
  )

  return titreDemarchesErrors
}

export { titreDemarcheUpdatedEtatValidate, titreDemarcheEtatValidate }

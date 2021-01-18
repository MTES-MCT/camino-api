// valide la date et la position de l'étape en fonction des autres étapes
import { ITitre, ITitreEtape, IDemarcheType } from '../types'

import {
  etapeTypeIdDefinitionsGet,
  IEtapeTypeIdDefinition
} from './demarches-etats-definitions/demarches-etats-definitions'
import { propsTitreEtapesIdsFind } from './utils/props-titre-etapes-ids-find'
import { titreContenuFormat } from '../api/_format/titres-contenu'
import titreEtapesSortAscByDate from './utils/titre-etapes-sort-asc-by-date'
import { titreEtapeEtatValidate } from './utils/titre-etape-etat-validate'
import { titreDemarcheEtapesBuild } from './titre-demarche-etape-build'

// vérifie que  la démarche est valide par rapport aux définitions des types d'étape
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

    const propsTitreEtapesIds = propsTitreEtapesIdsFind(
      titre.statutId!,
      titre.demarches!,
      titreTemp.type!.propsEtapesTypes
    )

    if (propsTitreEtapesIds) {
      titreTemp.contenu = titreContenuFormat(
        propsTitreEtapesIds,
        titre.demarches
      )
    }

    const titreEtapeErrors = titreEtapeEtatValidate(
      etapeTypeIdDefinitions,
      titreEtapes[i].typeId!,
      etapes,
      titreTemp
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
  if (!etapeTypeIdDefinitions) return []

  // pas de validation si la démarche est antérieure au 31 octobre 2019
  // pour ne pas bloquer l'édition du cadastre historique (moins complet)
  if (
    titreDemarcheEtapes.length &&
    titreDemarcheEtapes.reverse()[0].date < '2019-10-31'
  )
    return []

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

export { titreDemarcheUpdatedEtatValidate, titreDemarcheEtatValidate }

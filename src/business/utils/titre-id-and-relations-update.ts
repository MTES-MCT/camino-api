import idsUpdate from './ids-update'
import titreDemarcheOrTravauxAscSort from './titre-elements-asc-sort'
import titreEtapesAscSort from './titre-etapes-asc-sort'
import { titrePropsEtapes } from '../processes/titres-props-etape-id-update'
import titreIdFind from './titre-id-find'
import { ITitre, ITitreDemarche, ITitreEtape, ITitreTravaux } from '../../types'

const titrePropsEtapesNames = titrePropsEtapes.map(p => p.name)

const titreDemarcheIdFind = (titreDemarche: ITitreDemarche, titre: ITitre) => {
  const titreDemarcheTypeOrder =
    titreDemarcheOrTravauxAscSort(
      titre.demarches!.filter(d => d.typeId === titreDemarche.typeId)
    ).findIndex(d => d === titreDemarche) + 1

  return `${titre.id}-${
    titreDemarche.typeId
  }${titreDemarcheTypeOrder.toString().padStart(2, '0')}`
}

const titreTravauxIdFind = (titreTravaux: ITitreTravaux, titre: ITitre) => {
  const titreTravauxTypeOrder =
    titreDemarcheOrTravauxAscSort(
      titre.travaux!.filter(d => d.typeId === titreTravaux.typeId)
    ).findIndex(d => d.id === titreTravaux.id) + 1

  return `${titre.id}-${
    titreTravaux.typeId
  }${titreTravauxTypeOrder.toString().padStart(2, '0')}`
}

const titreEtapeIdFind = (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche
) => {
  const titreEtapeTypeOrder =
    titreEtapesAscSort(
      titreDemarche.etapes!.filter(e => e.typeId === titreEtape.typeId)
    ).findIndex(e => e === titreEtape) + 1

  return `${titreDemarche.id}-${
    titreEtape.typeId
  }${titreEtapeTypeOrder.toString().padStart(2, '0')}`
}

const titreRelation = {
  name: 'titre',
  idFind: titreIdFind,
  relations: [
    {
      name: 'demarches',
      props: ['titreId'],
      idFind: titreDemarcheIdFind,
      relations: [
        {
          name: 'etapes',
          props: ['titreDemarcheId'],
          idFind: titreEtapeIdFind,
          relations: [
            {
              name: 'titre',
              props: titrePropsEtapesNames,
              path: []
            },
            {
              name: 'titre',
              contenus: ['propsTitreEtapesIds'],
              path: []
            },
            {
              name: 'points',
              props: ['id', 'titreEtapeId'],
              relations: [
                {
                  name: 'references',
                  props: ['id', 'titrePointId']
                }
              ]
            },
            {
              name: 'documents',
              props: ['id', 'titreEtapeId']
            },
            {
              name: 'incertitudes',
              props: ['id', 'titreEtapeId']
            }
          ]
        },
        {
          name: 'phase',
          props: ['titreDemarcheId']
        },
        {
          name: 'demarches',
          path: ['titre']
        }
      ]
    },
    {
      name: 'activites',
      props: ['id', 'titreId']
    },
    {
      name: 'travaux',
      props: ['titreId'],
      idFind: titreTravauxIdFind,
      relations: [
        {
          name: 'etapes',
          props: ['titreTravauxId'],
          idFind: titreEtapeIdFind,
          relations: [
            {
              name: 'documents',
              props: ['id', 'titreTravauxEtapeId']
            }
          ]
        }
      ]
    }
  ]
}

const titreIdAndRelationsUpdate = (
  titre: ITitre,
  titreIdFindCustom?: (titre: ITitre) => string
) => {
  if (titreIdFindCustom) {
    titreRelation.idFind = titreIdFindCustom
  } else {
    titreRelation.idFind = titreIdFind
  }

  // permet de référencer tous les changements d'ids par type de relation
  // un index nom de relations => (index noueaux ids => anciens ids)
  const relationsIdsChangedIndex = {}

  // met à jour les ids par effet de bord
  // retourne true si un id a changé
  const hasChanged = idsUpdate(relationsIdsChangedIndex, titre, titreRelation, {
    titre
  })

  return { titre, hasChanged, relationsIdsChangedIndex }
}

export default titreIdAndRelationsUpdate

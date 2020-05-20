import idsUpdate from './ids-update'
import titreDemarchesAscSort from './titre-demarches-asc-sort'
import titreEtapesAscSort from './titre-etapes-asc-sort'
import { titrePropsEtapes } from '../processes/titres-props-etape-id-update'
import titreIdFind from './titre-id-find'
import { ITitre, ITitreDemarche, ITitreEtape } from '../../types'

const titrePropsEtapesNames = titrePropsEtapes.map(p => p.name)

const titreDemarcheIdFind = (titreDemarche: ITitreDemarche, titre: ITitre) => {
  const titreDemarcheTypeOrder =
    titreDemarchesAscSort(
      titre.demarches!.filter(d => d.typeId === titreDemarche.typeId)
    ).findIndex(d => d === titreDemarche) + 1

  return `${titre.id}-${
    titreDemarche.typeId
  }${titreDemarcheTypeOrder.toString().padStart(2, '0')}`
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
          props: ['annulationTitreDemarcheId'],
          path: ['titre']
        }
      ]
    },
    {
      name: 'activites',
      props: ['id', 'titreId']
    }
  ]
}

const titreIdAndRelationsUpdate = (
  titre: ITitre,
  titreIdFindCustom = titreIdFind
) => {
  titreRelation.idFind = titreIdFindCustom

  // met à jour les ids par effet de bord
  // retourne true si un id a changé
  const hasChanged = idsUpdate(titre, titreRelation, { titre })

  return { titre, hasChanged }
}

export default titreIdAndRelationsUpdate

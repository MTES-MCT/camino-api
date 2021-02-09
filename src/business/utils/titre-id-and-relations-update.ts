import { ITitre, ITitreDemarche, ITitreEtape, ITitreTravaux } from '../../types'
import * as slugify from '@sindresorhus/slugify'
import idsUpdate from './ids-update'
import titreDemarcheOrTravauxSortAsc from './titre-elements-sort-asc'
import titreEtapesSortAsc from './titre-etapes-sort-asc'
import titreDemarcheOctroiDateDebutFind from '../rules/titre-demarche-octroi-date-debut-find'

const titreIdFind = (titre: ITitre) => {
  const { domaineId, type, nom } = titre
  const demarcheOctroiDateDebut = titreDemarcheOctroiDateDebutFind(
    titre.demarches
  )

  return slugify(
    `${domaineId}-${type!.typeId}-${nom}-${demarcheOctroiDateDebut.slice(0, 4)}`
  )
}

const titreIdFindHashAdd = (hash: string) => (titre: ITitre) =>
  `${titreIdFind(titre)}-${hash}`

const titreDemarcheIdFind = (titreDemarche: ITitreDemarche, titre: ITitre) => {
  const titreDemarcheTypeOrder =
    titreDemarcheOrTravauxSortAsc(
      titre.demarches!.filter(d => d.typeId === titreDemarche.typeId)
    ).findIndex(d => d === titreDemarche) + 1

  return `${titre.id}-${
    titreDemarche.typeId
  }${titreDemarcheTypeOrder.toString().padStart(2, '0')}`
}

const titreTravauxIdFind = (titreTravaux: ITitreTravaux, titre: ITitre) => {
  const titreTravauxTypeOrder =
    titreDemarcheOrTravauxSortAsc(
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
    titreEtapesSortAsc(
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
            // {
            //   name: 'etapes',
            //   props: ['propsTitreEtapesIds'],
            //   depth: 1,
            //   path: []
            // },
            // {
            //   name: 'etapes',
            //   props: ['contenusTitreEtapesIds'],
            //   depth: 2,
            //   path: []
            // },
            {
              name: 'titre',
              props: ['propsTitreEtapesIds'],
              depth: 1,
              path: []
            },
            {
              name: 'titre',
              props: ['contenusTitreEtapesIds'],
              depth: 2,
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

const titreIdAndRelationsUpdate = (titre: ITitre, hash?: string) => {
  if (hash) {
    titreRelation.idFind = titreIdFindHashAdd(hash)
  } else {
    // si la propriété idFind a été écrasé lors d'un appel précédent
    // on doit la réinitialiser
    titreRelation.idFind = titreIdFind
  }

  // permet de référencer tous les changements d'ids par type de relation
  // un index nom de relations => (index nouveaux ids => anciens ids)
  const relationsIdsUpdatedIndex = {}

  // met à jour les ids par effet de bord
  // retourne true si un id a changé
  const hasChanged = idsUpdate(relationsIdsUpdatedIndex, titre, titreRelation, {
    titre
  })

  // l'objet `titre` n'est retourné que pour les tests,
  // il est modifié par effet de bord de toute façon
  return { titre, hasChanged, relationsIdsUpdatedIndex }
}

export default titreIdAndRelationsUpdate

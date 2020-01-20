import idsUpdate from './ids-update'
import titreDemarchesAscSort from './titre-demarches-asc-sort'
import titreEtapesAscSort from './titre-etapes-asc-sort'
import { titrePropsEtapes } from '../processes/titres-props-etape-id-update'

const titrePropsEtapesNames = titrePropsEtapes.map(p => p.name)

const titreDemarcheIdFind = (titreDemarche, titre) => {
  const titreDemarcheTypeOrder =
    titreDemarchesAscSort(
      titre.demarches.filter(d => d.typeId === titreDemarche.typeId)
    ).findIndex(d => d === titreDemarche) + 1

  return `${titre.id}-${
    titreDemarche.typeId
  }${titreDemarcheTypeOrder.toString().padStart(2, '0')}`
}

const titreEtapeIdFind = (titreEtape, titreDemarche) => {
  const titreEtapeTypeOrder =
    titreEtapesAscSort(
      titreDemarche.etapes.filter(e => e.typeId === titreEtape.typeId)
    ).findIndex(e => e === titreEtape) + 1

  return `${titreDemarche.id}-${
    titreEtape.typeId
  }${titreEtapeTypeOrder.toString().padStart(2, '0')}`
}

const titreRelation = {
  name: 'titre',
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

const titreIdAndRelationsUpdate = (titreOld, titreIdFind) => {
  const titreRelationNew = { ...titreRelation, idFind: titreIdFind }

  const titre = JSON.parse(JSON.stringify(titreOld))

  // met à jour les ids
  idsUpdate(titre, titreRelationNew, { titre })

  return titre
}

export default titreIdAndRelationsUpdate

import { ITitre } from '../../../types'

const titresDemarchesDesordonnees = [
  {
    demarches: [
      {
        id: 'm-pr-saint-pierre-2014-oct01',
        titreId: 'm-pr-saint-pierre-2014',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 2,
        etapes: [
          {
            id: 'm-pr-saint-pierre-2014-oct01-dpu01',
            titreDemarcheId: 'm-pr-saint-pierre-2014-oct01',
            typeId: 'dpu',
            statutId: 'acc'
          }
        ]
      },
      {
        id: 'm-pr-saint-pierre-2014-pro01',
        titreId: 'm-pr-saint-pierre-2014',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 3,
        etapes: [
          {
            id: 'm-pr-saint-pierre-2014-pro01-dpu01',
            titreDemarcheId: 'm-pr-saint-pierre-2014-pro01',
            typeId: 'dpu',
            statutId: 'acc'
          }
        ]
      }
    ]
  }
] as ITitre[]

const titresDemarchesOrdonnees = [
  {
    demarches: [
      {
        id: 'm-pr-saint-pierre-2014-oct01',
        titreId: 'm-pr-saint-pierre-2014',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'm-pr-saint-pierre-2014-oct01-dpu01',
            titreDemarcheId: 'm-pr-saint-pierre-2014-oct01',
            typeId: 'dpu',
            statutId: 'acc'
          }
        ]
      },
      {
        id: 'm-pr-saint-pierre-2014-pro01',
        titreId: 'm-pr-saint-pierre-2014',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 2,
        etapes: [
          {
            id: 'm-pr-saint-pierre-2014-pro01-dpu01',
            titreDemarcheId: 'm-pr-saint-pierre-2014-pro01',
            typeId: 'dpu',
            statutId: 'acc'
          }
        ]
      }
    ]
  }
] as ITitre[]

export { titresDemarchesDesordonnees, titresDemarchesOrdonnees }

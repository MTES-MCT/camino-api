const titreValide = {
  id: 'm-prx-saint-pierre-2014',
  statutId: 'val',
  dateDebut: new Date('2008-12-12T23:00:00.000Z'),
  demarches: [
    {
      id: 'm-prx-saint-pierre-2014-oct01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1,
      annulationTitreDemarcheId: null,
      type: {
        id: 'oct',
        nom: 'octroi',
        ordre: 1,
        duree: true,
        points: true,
        substances: true,
        titulaires: true,
        renouvelable: null,
        exception: null
      },
      statut: {
        id: 'acc',
        nom: 'acceptée',
        couleur: 'success'
      },
      phase: {
        titreDemarcheId: 'm-prx-saint-pierre-2014-oct01',
        statutId: 'val',
        dateDebut: '2014-11-01T23:00:00.000Z',
        dateFin: '2019-11-01T23:00:00.000Z',
        statut: {
          id: 'val',
          nom: 'valide',
          couleur: 'success'
        }
      },
      etapes: [
        {
          id: 'm-prx-saint-pierre-2014-oct01-dpu01',
          titreDemarcheId: 'm-prx-saint-pierre-2014-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          points: [
            {
              id: 'm-prx-saint-pierre-2014-oct01-dpu01-g01-c01-p001',
              titreEtapeId: 'm-prx-saint-pierre-2014-oct01-dpu01',
              coordonnees: {
                x: -0.785933141030109,
                y: 47.3154989295901
              },
              groupe: 1,
              contour: 1,
              point: 1,
              nom: '1',
              description: null,
              securite: null,
              references: []
            }
          ],
          substances: [
            {
              id: 'arge',
              nom: 'argent',
              symbole: 'Ag',
              gerep: null,
              description: null,
              ordre: null,
              connexe: null
            }
          ]
        }
      ]
    }
  ],
  pointsTitreEtapeId: 'm-prx-saint-pierre-2014-xxx-dpu01',
  substancesTitreEtapeId: 'm-prx-saint-pierre-2014-oct01-dpu01'
}

const titreOldId = 'm-prx-saint-pierre-2014'

const titreOld = {
  id: titreOldId
}

const titreNew = {
  id: 'm-prx-saint-pierre-2015'
}

export { titreValide, titreOld, titreOldId, titreNew }

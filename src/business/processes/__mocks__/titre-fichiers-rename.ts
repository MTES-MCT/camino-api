import { ITitre } from '../../../types'

const titreNew = {
  id: 'new-titre-id',
  demarches: [
    {
      id: 'new-titre-id-demarche-01',
      etapes: [
        {
          id: 'new-titre-id-demarche-01-etape-01',
          documents: [
            {
              id: 'new-titre-id-demarche-01-etape-01-document-01',
              fichier: true,
              fichierTypeId: 'pdf'
            },
            {
              id: 'new-titre-id-demarche-01-etape-01-document-02'
            },
            {
              id: 'new-titre-id-demarche-01-etape-01-document-03',
              fichier: true,
              fichierTypeId: 'pdf'
            }
          ]
        }
      ]
    }
  ]
} as ITitre

const titreNewSansDemarches = { id: 'new-titre-id' } as ITitre

const titreNewDemarchesVides = ({
  id: 'new-titre-id',
  demarches: []
} as unknown) as ITitre

const titreNewSansEtapes = {
  id: 'new-titre-id',
  demarches: [
    { id: 'new-titre-id-demarche-01', etapes: [] },
    { id: 'new-titre-id-demarche-02' },
    {
      id: 'new-titre-id-demarche-03',
      etapes: [
        { id: 'new-titre-id-demarche-03-etape-01', documents: [] },
        { id: 'new-titre-id-demarche-03-etape-02' }
      ]
    }
  ]
} as ITitre

const titreSansDocuments = ({
  id: 'new-titre-id',
  demarches: [
    {
      id: 'new-titre-id-demarche-01',
      etapes: [
        {
          id: 'new-titre-id-demarche-01-etape-01'
        }
      ]
    }
  ]
} as unknown) as ITitre

const titreDocumentsVide = ({
  id: 'new-titre-id',
  demarches: [
    {
      id: 'new-titre-id-demarche-01',
      etapes: [
        {
          id: 'new-titre-id-demarche-01-etape-01',
          documents: []
        },
        {
          id: 'new-titre-id-demarche-01-etape-02'
        }
      ]
    }
  ]
} as unknown) as ITitre

const titreNewDemarchesSansChangement = {
  id: 'old-titre-id',
  demarches: [
    {
      id: 'old-titre-id-demarche-01',
      etapes: [
        {
          id: 'old-titre-id-demarche-01-etape-01',
          documents: [
            {
              id: 'old-titre-id-demarche-01-etape-01-document-01',
              fichier: true,
              fichierTypeId: 'pdf'
            },
            {
              id: 'old-titre-id-demarche-01-etape-01-document-02'
            },
            {
              id: 'old-titre-id-demarche-01-etape-01-document-03',
              fichier: true,
              fichierTypeId: 'pdf'
            }
          ]
        }
      ]
    }
  ]
} as ITitre

export {
  titreNew,
  titreNewSansDemarches,
  titreNewDemarchesVides,
  titreNewSansEtapes,
  titreSansDocuments,
  titreDocumentsVide,
  titreNewDemarchesSansChangement
}

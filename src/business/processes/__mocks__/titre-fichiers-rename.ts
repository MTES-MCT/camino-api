import { ITitres } from '../../../types'

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
} as ITitres

const titreNewSansDemarches = ({
  id: 'new-titre-id'
} as unknown) as ITitres

const titreNewDemarchesVides = ({
  id: 'new-titre-id',
  demarches: []
} as unknown) as ITitres

const titreNewSansEtapes = ({
  id: 'new-titre-id',
  demarches: [
    {
      id: 'new-titre-id-demarche-01',
      etapes: []
    },
    {
      id: 'new-titre-id-demarche-02'
    },
    {
      id: 'new-titre-id-demarche-03',
      etapes: [
        {
          id: 'new-titre-id-demarche-03-etape-01',
          documents: []
        },
        {
          id: 'new-titre-id-demarche-03-etape-02'
        }
      ]
    }
  ]
} as unknown) as ITitres

export {
  titreNew,
  titreNewSansDemarches,
  titreNewDemarchesVides,
  titreNewSansEtapes
}

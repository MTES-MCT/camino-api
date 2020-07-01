import { ITitre } from '../../../types'

const titreSansDemarche = ({
  id: 'test'
} as unknown) as ITitre

const titreDemarcheIndefini = ({
  id: 'test',
  demarches: [
    {
      statutId: 'ind'
    }
  ]
} as unknown) as ITitre

const titreValide = ({
  id: 'm-pr-saint-pierre-2014',
  demarches: [
    {
      id: 'm-pr-saint-pierre-2014-oct01',
      titreId: 'm-pr-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1,
      etapes: [
        {
          id: 'm-pr-saint-pierre-2014-oct01-dex01',
          titreDemarcheId: 'm-pr-saint-pierre-2014-oct01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1,
          date: '2014-04-01',
          dateDebut: null,
          dateFin: '3014-04-01'
        }
      ]
    }
  ]
} as unknown) as ITitre

const titreEchu = ({
  id: 'm-pr-saint-pierre-1914',
  demarches: [
    {
      id: 'm-pr-saint-pierre-1914-oct01',
      titreId: 'm-pr-saint-pierre-1914',
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1,
      etapes: [
        {
          id: 'm-pr-saint-pierre-2014-oct01-dex01',
          titreDemarcheId: 'm-pr-saint-pierre-2014-oct01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1,
          date: '1014-04-01',
          dateDebut: null,
          dateFin: '2014-04-01'
        }
      ]
    }
  ]
} as unknown) as ITitre

const titreOctroiInstruction = ({
  id: 'm-pr-saint-pierre-2014',
  demarches: [
    {
      id: 'm-pr-saint-pierre-2014-oct01',
      titreId: 'm-pr-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'ins',
      ordre: 1
    }
  ]
} as unknown) as ITitre

const titreOctroiDepose = ({
  id: 'm-pr-saint-pierre-2014',
  demarches: [
    {
      id: 'm-pr-saint-pierre-2014-oct01',
      titreId: 'm-pr-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'dep',
      ordre: 1
    }
  ]
} as unknown) as ITitre

const titreOctroiRejete = ({
  id: 'm-pr-saint-pierre-2014',
  demarches: [
    {
      id: 'm-pr-saint-pierre-2014-oct01',
      titreId: 'm-pr-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'rej',
      ordre: 1
    }
  ]
} as unknown) as ITitre

const titreOctroiClasse = ({
  id: 'm-pr-saint-pierre-2014',
  demarches: [
    {
      id: 'm-pr-saint-pierre-2014-oct01',
      titreId: 'm-pr-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'cls',
      ordre: 1
    }
  ]
} as unknown) as ITitre

const titreOctroiRetire = ({
  id: 'm-pr-saint-pierre-2014',
  demarches: [
    {
      id: 'm-pr-saint-pierre-2014-oct01',
      titreId: 'm-pr-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'des',
      ordre: 1
    }
  ]
} as unknown) as ITitre

const titreDemarcheInstruction = ({
  id: 'm-pr-saint-pierre-2014',
  demarches: [
    {
      id: 'm-pr-saint-pierre-2014-mut01',
      titreId: 'm-pr-saint-pierre-2014',
      typeId: 'mut',
      statutId: 'ins',
      ordre: 1
    },
    {
      id: 'm-pr-saint-pierre-2014-oct01',
      titreId: 'm-pr-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitre

export {
  titreSansDemarche,
  titreDemarcheIndefini,
  titreValide,
  titreEchu,
  titreOctroiInstruction,
  titreOctroiDepose,
  titreOctroiRejete,
  titreOctroiClasse,
  titreOctroiRetire,
  titreDemarcheInstruction
}

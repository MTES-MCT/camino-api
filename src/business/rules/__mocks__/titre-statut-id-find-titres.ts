import { ITitreDemarche } from '../../../types'

const titreDemarchesIndefini = [{ statutId: 'ind' }] as ITitreDemarche[]

const titreDemarchesValide = [
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
] as ITitreDemarche[]

const titreDemarchesEchu = [
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
] as ITitreDemarche[]

const titreDemarchesOctroiInstruction = [
  {
    id: 'm-pr-saint-pierre-2014-oct01',
    titreId: 'm-pr-saint-pierre-2014',
    typeId: 'oct',
    statutId: 'ins',
    ordre: 1
  }
] as ITitreDemarche[]

const titreDemarchesOctroiDepose = [
  {
    id: 'm-pr-saint-pierre-2014-oct01',
    titreId: 'm-pr-saint-pierre-2014',
    typeId: 'oct',
    statutId: 'dep',
    ordre: 1
  }
] as ITitreDemarche[]

const titreDemarchesOctroiRejete = [
  {
    id: 'm-pr-saint-pierre-2014-oct01',
    titreId: 'm-pr-saint-pierre-2014',
    typeId: 'oct',
    statutId: 'rej',
    ordre: 1
  }
] as ITitreDemarche[]

const titreDemarchesOctroiClasse = [
  {
    id: 'm-pr-saint-pierre-2014-oct01',
    titreId: 'm-pr-saint-pierre-2014',
    typeId: 'oct',
    statutId: 'cls',
    ordre: 1
  }
] as ITitreDemarche[]

const titreDemarchesOctroiRetire = [
  {
    id: 'm-pr-saint-pierre-2014-oct01',
    titreId: 'm-pr-saint-pierre-2014',
    typeId: 'oct',
    statutId: 'des',
    ordre: 1
  }
] as ITitreDemarche[]

const titreDemarchesInstruction = [
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
] as ITitreDemarche[]

export {
  titreDemarchesIndefini,
  titreDemarchesValide,
  titreDemarchesEchu,
  titreDemarchesOctroiInstruction,
  titreDemarchesOctroiDepose,
  titreDemarchesOctroiRejete,
  titreDemarchesOctroiClasse,
  titreDemarchesOctroiRetire,
  titreDemarchesInstruction
}

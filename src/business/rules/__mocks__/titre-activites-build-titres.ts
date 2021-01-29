import { ITitre, IActiviteType } from '../../../types'

const titreVide = ({} as unknown) as ITitre

const titreModificationEnInstance = ({ statutId: 'mod' } as unknown) as ITitre

const titreAvecActivite201801 = ({
  activites: [{ typeId: 'grp', annee: 2018, frequencePeriodeId: 1 }]
} as unknown) as ITitre

const activiteTypeXxx = {
  id: 'xxx',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] },
  sections: [
    {
      id: 'renseignements',
      elements: [
        {
          id: 'orBrut',
          nom: 'Or brut extrait (g)',
          type: 'number',
          dateDebut: '2018-01-01',
          description: 'Masse d’or brut'
        },
        {
          id: 'orExtrait',
          nom: 'Or extrait (g)',
          type: 'number',
          dateFin: '2018-01-01',
          description: "Masse d'or brut extrait au cours du trimestre."
        }
      ]
    }
  ]
} as IActiviteType

const activiteTypeGrp = {
  id: 'grp',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] },
  sections: [
    {
      id: 'renseignements',
      elements: [
        {
          id: 'orBrut',
          nom: 'Or brut extrait (g)',
          type: 'number',
          description: 'Masse d’or brut'
        },
        {
          id: 'orExtrait',
          nom: 'Or extrait (g)',
          type: 'number',
          description: "Masse d'or brut extrait au cours du trimestre."
        }
      ]
    }
  ]
} as IActiviteType

export {
  titreVide,
  titreModificationEnInstance,
  titreAvecActivite201801,
  activiteTypeXxx,
  activiteTypeGrp
}

import { ITitre, IActiviteType } from '../../../types'

const titreVide = ({} as unknown) as ITitre

const titreModificationEnInstance = ({
  statutId: 'mod'
} as unknown) as ITitre

const titreAvecActivite201801 = ({
  activites: [{ typeId: 'grp', annee: 2018, frequencePeriodeId: 1 }]
} as unknown) as ITitre

const activiteTypeXxx = {
  id: 'xxx',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] }
} as IActiviteType

const activiteTypeGrp = {
  id: 'grp',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] }
} as IActiviteType

export {
  titreVide,
  titreModificationEnInstance,
  titreAvecActivite201801,
  activiteTypeXxx,
  activiteTypeGrp
}

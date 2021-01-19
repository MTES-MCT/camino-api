import { ITitreEtape } from '../../types'

// si il y a une demande
// -> retourne la date de cette étape
// sinon
// retourne la date de la première étape

const titreDemarcheDemandeDateFind = (titreEtapes: ITitreEtape[]) => {
  const titreEtapeDemande = titreEtapes.find(te => te.typeId === 'mfr')

  if (titreEtapeDemande) {
    return titreEtapeDemande.date
  }

  return titreEtapes.map(te => te.date).sort()[0]
}

export { titreDemarcheDemandeDateFind }

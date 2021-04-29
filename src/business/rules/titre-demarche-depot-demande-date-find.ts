import { ITitreEtape } from '../../types'

// si il y a un dépot de la demande
// -> retourne la date de cette étape
// sinon
// retourne la date de la première étape

const titreDemarcheDepotDemandeDateFind = (titreEtapes: ITitreEtape[]) => {
  const titreEtapeDemande = titreEtapes.find(
    te => ['mfr', 'mfm'].includes(te.typeId) && te.statutId === 'dep'
  )

  if (titreEtapeDemande) {
    return titreEtapeDemande.date
  }

  return titreEtapes.map(te => te.date).sort()[0]
}

export { titreDemarcheDepotDemandeDateFind }

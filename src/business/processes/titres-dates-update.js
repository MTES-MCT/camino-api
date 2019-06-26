import { titrePropUpdate } from '../queries/titres'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'
import titreDateDemandeFind from '../rules/titre-date-demande-find'

const titresDatesUpdate = async titres => {
  const titresDateDebutDateFinQueries = titres.reduce((acc, titre) => {
    const dateFin = titreDateFinFind(titre.demarches)
    const titreDateFinUpdated = titrePropUpdate(titre, 'dateFin', dateFin)

    if (titreDateFinUpdated) {
      acc.push(titreDateFinUpdated)
    }

    const dateDebut = titreDateDebutFind(titre.demarches, titre.type.id)
    const titreDateDebutUpdated = titrePropUpdate(titre, 'dateDebut', dateDebut)

    if (titreDateDebutUpdated) {
      acc.push(titreDateDebutUpdated)
    }

    const dateDemande = titreDateDemandeFind(titre.demarches, titre.statut.id)
    const titreDateDemandeUpdated = titrePropUpdate(
      titre,
      'dateDemande',
      dateDemande
    )

    if (titreDateDemandeUpdated) {
      acc.push(titreDateDemandeUpdated)
    }

    return acc
  }, [])

  if (titresDateDebutDateFinQueries.length) {
    const titreUpdateQueries = titresDateDebutDateFinQueries.map(q =>
      q.then(log => console.log(log))
    )

    await Promise.all(titreUpdateQueries)
  }

  return `Mise à jour: ${titresDateDebutDateFinQueries.length} dates de titres.`
}

export default titresDatesUpdate

import { titrePropUpdate } from '../queries/titres'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'

const titresDateDebutDateFinUpdate = async titres => {
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

export default titresDateDebutDateFinUpdate

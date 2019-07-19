import * as dateFormat from 'dateformat'
import { titrePropsUpdate } from '../queries/titres'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'
import titreDateDemandeFind from '../rules/titre-date-demande-find'

const datesDiffer = (dateOld, dateNew) =>
  dateOld !== dateFormat(dateNew, 'yyyy-mm-dd')

const titresDatesUpdate = async titres => {
  const titresDateDebutDateFinQueries = titres.reduce((acc, titre) => {
    const props = {}

    const dateFin = titreDateFinFind(titre.demarches)

    if (datesDiffer(titre[dateFin], dateFin)) {
      props.dateFin = dateFin
    }

    const dateDebut = titreDateDebutFind(titre.demarches, titre.type.id)

    if (datesDiffer(titre[dateDebut], dateDebut)) {
      props.dateDebut = dateDebut
    }

    const dateDemande = titreDateDemandeFind(titre.demarches, titre.statut.id)

    if (datesDiffer(titre[dateDemande], dateDemande)) {
      props.dateDemande = dateDemande
    }

    return Object.keys(props).length
      ? () => titrePropsUpdate(titre, props)
      : acc
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

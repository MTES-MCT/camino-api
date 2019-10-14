import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import titreEtapePublicationFilter from './titre-etape-publication-filter'

const titreDemarcheDateDebutFind = (titreDemarche, titreTypeId) => {
  // retourne la dernière étape de publication si celle-ci possède une date de début
  const etapePublicationHasDateDebut = titreEtapesDescSort(
    titreDemarche.etapes
  ).find(
    titreEtape =>
      titreEtapePublicationFilter(titreEtape, titreTypeId) &&
      titreEtape.dateDebut
  )

  // si cette démarche a une étape de publication qui possède une date de début
  if (etapePublicationHasDateDebut) {
    // la date de début est égale à la date de début de l'étape de publication
    return etapePublicationHasDateDebut.dateDebut
  }

  // retourne la première étape de publication de la démarche
  const titreEtapePublicationFirst = titreEtapesAscSort(
    titreDemarche.etapes
  ).find(te => titreEtapePublicationFilter(te, titreTypeId))

  // si la démarche n'a pas d'étape de publication, ou que l'étape n'a pas de date
  if (!titreEtapePublicationFirst || !titreEtapePublicationFirst.date)
    return null

  // sinon la date de début est égale à la date de la première étape de publication
  return titreEtapePublicationFirst.date
}

const titreDateDebutFind = (titreDemarches, titreTypeId) => {
  // la première démarche d'octroi dont le statut est acceptée ou terminée
  const titreDemarchesAscSorted = titreDemarchesAscSort(titreDemarches)
  const titreDemarche = titreDemarchesAscSorted.find(
    titreDemarche =>
      ['acc', 'ter'].includes(titreDemarche.statutId) &&
      ['oct', 'vut', 'vct'].includes(titreDemarche.typeId)
  )

  if (!titreDemarche) return null

  return titreDemarcheDateDebutFind(titreDemarche, titreTypeId)
}

export default titreDateDebutFind

import * as dateFormat from 'dateformat'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'

const titreDemarcheDateDebutFind = (titreDemarche, titreTypeId) => {
  // retourne la dernière étape de dpu si celle-ci possède une date de début
  const etapeDpuHasDateDebut = titreEtapesDescSort(titreDemarche.etapes)
    .filter(
      titreEtape =>
        titreEtape.typeId === 'dpu' ||
        (titreTypeId === 'axm' && titreEtape.typeId === 'dex') ||
        (titreTypeId === 'prx' && titreEtape.typeId === 'rpu')
    )
    .find(te => te.dateDebut)

  // si cette démarche a une étape dpu qui possède une date de début
  if (etapeDpuHasDateDebut) {
    // la date de début est égale à la date de début de la dpu
    return dateFormat(etapeDpuHasDateDebut.dateDebut, 'yyyy-mm-dd')
  }

  // retourne la première étape de dpu
  const titreEtapeDpuDate = titreEtapesAscSort(titreDemarche.etapes).find(
    titreEtape =>
      titreEtape.typeId === 'dpu' ||
      (titreTypeId === 'axm' && titreEtape.typeId === 'dex') ||
      (titreTypeId === 'prx' && titreEtape.typeId === 'rpu')
  )

  // si l'étape de dpu existe
  if (titreEtapeDpuDate) {
    // la date de début est égale à la date de la dpu
    return dateFormat(titreEtapeDpuDate.date, 'yyyy-mm-dd')
  }

  // sinon retourne null
  return null
}

const titreDateDebutFind = (titreDemarches, titreTypeId) => {
  // la première démarche d'octroi dont le statut est acceptée ou terminée
  const titreDemarchesAscSorted = titreDemarchesAscSort(titreDemarches)
  const titreDemarche = titreDemarchesAscSorted.find(
    titreDemarche =>
      ['acc', 'ter'].includes(titreDemarche.statutId) &&
      titreDemarche.typeId === 'oct'
  )

  return titreDemarche && titreDemarcheDateDebutFind(titreDemarche, titreTypeId)
}

export default titreDateDebutFind

import * as dateFormat from 'dateformat'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'

const titreDemarcheDateDebutFind = (titreDemarche, titreTypeId) => {
  // retourne une étape de dpu si celle-ci possède une date de début
  const etapeDpuHasDateDebut = titreEtapesDescSort(titreDemarche.etapes)
    .filter(
      titreEtape =>
        titreEtape.typeId === 'dpu' ||
        (titreTypeId === 'axm' && titreEtape.typeId === 'dex') ||
        (titreTypeId === 'prx' && titreEtape.typeId === 'rpu')
    )
    .find(te => te.dateDebut)

  // si
  // - la démarche est un octroi
  // - cette démarche a une étape dpu qui possède une date de début
  if (etapeDpuHasDateDebut) {
    // la date de début est égale à la date de début de la dpu
    return dateFormat(etapeDpuHasDateDebut.dateDebut, 'yyyy-mm-dd')
  }

  // sinon, la date de début est égale à la date de la première étape de dpu
  const titreEtapeDpuFirst = titreEtapesAscSort(titreDemarche.etapes).find(
    titreEtape =>
      titreEtape.typeId === 'dpu' ||
      (titreTypeId === 'axm' && titreEtape.typeId === 'dex') ||
      (titreTypeId === 'prx' && titreEtape.typeId === 'rpu')
  )

  return titreEtapeDpuFirst && dateFormat(titreEtapeDpuFirst.date, 'yyyy-mm-dd')
}

const titreDateDebutFind = (titreDemarches, titreTypeId) => {
  // la première démarche dont le statut est acceptée ou terminée
  const titreDemarchesAscSorted = titreDemarchesAscSort(titreDemarches)
  const titreDemarche = titreDemarchesAscSorted.find(titreDemarche =>
    ['acc', 'ter'].includes(titreDemarche.statutId)
  )

  return titreDemarche && titreDemarcheDateDebutFind(titreDemarche, titreTypeId)
}

export default titreDateDebutFind

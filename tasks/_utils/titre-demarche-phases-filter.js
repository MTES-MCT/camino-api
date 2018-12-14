const titreEtapesSortAsc = require('./titre-etapes-sort-asc')

// si
// - la démarche est un octroi ou une prolongation ou une prolongation 1
// ou une prolongation 2 ou une prolongation exceptionnelle
// - le statut de la démarche est acceptée
// - la démarche a une étape de dpu
// - le statut de l'étape de dpu est acceptée

const titreDemarchePhasesFilter = (titreDemarche, titreIsAxm) => {
  // retourne l'étape de dpu de la démarche si elle existe
  // si il existe une dpu et une dpu rectificative, on prend en compte l'originale
  const etapeDpuFirst = titreEtapesSortAsc(titreDemarche).find(
    titreEtape =>
      titreEtape.typeId === 'dpu' || (titreIsAxm && titreEtape.typeId === 'dex')
  )

  return (
    (titreDemarche.typeId === 'oct' ||
      titreDemarche.typeId === 'pro' ||
      titreDemarche.typeId === 'pr1' ||
      titreDemarche.typeId === 'pr2' ||
      titreDemarche.typeId === 'pre') &&
    titreDemarche.statutId === 'acc' &&
    etapeDpuFirst &&
    etapeDpuFirst.statutId === 'acc'
  )
}

module.exports = titreDemarchePhasesFilter

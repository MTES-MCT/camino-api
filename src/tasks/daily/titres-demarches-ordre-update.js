import { titreDemarchesOrdreUpdate } from '../titre-demarches'

const titresDemarchesOrdreUpdate = async titresDemarches => {
  const titresDemarchesByTitre = titresDemarchesByTitreGroup(titresDemarches)
  const titresDemarchesUpdated = Object.keys(titresDemarchesByTitre)
    .reduce((res, titreId) => {
      const titreDemarchesOrdreUpdated = titreDemarchesOrdreUpdate(
        titresDemarchesByTitre[titreId]
      )

      return [...res, ...titreDemarchesOrdreUpdated]
    }, [])
    .map(q => q.then(log => console.log(log)))

  await Promise.all(titresDemarchesUpdated)

  return `Mise à jour: ${titresDemarchesUpdated.length} ordres de démarches.`
}

const titresDemarchesByTitreGroup = titresDemarches =>
  titresDemarches.reduce((res, titreDemarche) => {
    res[titreDemarche.titreId] = res[titreDemarche.titreId]
      ? [...res[titreDemarche.titreId], titreDemarche]
      : [titreDemarche]

    return res
  }, {})

export default titresDemarchesOrdreUpdate

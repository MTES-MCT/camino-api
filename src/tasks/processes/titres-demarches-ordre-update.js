import { titreDemarchesOrdreUpdate } from '../queries/titre-demarches'

const titresDemarchesOrdreUpdate = async titres => {
  const titresDemarchesUpdated = titres
    .reduce((res, titre) => {
      const titreDemarchesOrdreUpdated = titreDemarchesOrdreUpdate(
        titre.demarches.slice().reverse()
      )

      return !titreDemarchesOrdreUpdated.length
        ? res
        : [...res, ...titreDemarchesOrdreUpdated]
    }, [])
    .map(q => q.then(log => console.log(log)))

  await Promise.all(titresDemarchesUpdated)

  return `Mise à jour: ${titresDemarchesUpdated.length} ordres de démarches.`
}

export default titresDemarchesOrdreUpdate

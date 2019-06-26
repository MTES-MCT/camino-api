import { titreDemarcheStatutIdUpdate } from '../queries/titre-demarches'
import titreDemarcheStatutIdFind from '../rules/titre-demarche-statut-id-find'

// met à jour le statut des démarches d'un titre
const titresDemarchesUpdate = async titres => {
  const titresDemarchesUpdated = titres
    .reduce(
      (arr, titre) =>
        titre.demarches.reduce((arr, titreDemarche) => {
          const statutId = titreDemarcheStatutIdFind(
            {
              ...titreDemarche,
              etapes: titreDemarche.etapes && titreDemarche.etapes.reverse()
            },
            titre.typeId
          )

          const titreDemarcheUpdated = titreDemarcheStatutIdUpdate(
            titreDemarche,
            statutId
          )

          return titreDemarcheUpdated ? [...arr, titreDemarcheUpdated] : arr
        }, arr),
      []
    )
    .map(q => q.then(log => console.log(log)))

  await Promise.all(titresDemarchesUpdated)

  return `Mise à jour: ${titresDemarchesUpdated.length} statuts de démarches.`
}

export default titresDemarchesUpdate

import { titreDemarcheUpdate } from '../queries/titre-demarches'
import titreDemarcheStatutIdFind from '../rules/titre-demarche-statut-id-find'
import PQueue from 'p-queue'

const titreDemarcheStatutUpdate = (titreDemarche, titre) => {
  const statutId = titreDemarcheStatutIdFind(
    {
      ...titreDemarche,
      etapes: titreDemarche.etapes && titreDemarche.etapes.reverse()
    },
    titre.typeId
  )

  return titreDemarche.statutId !== statutId
    ? () =>
        titreDemarcheUpdate(titreDemarche.id, {
          statutId
        }).then(console.log)
    : null
}

// met à jour le statut des démarches d'un titre
const titresDemarchesStatutUpdate = async titres => {
  const titresDemarchesStatutUpdated = titres.reduce(
    (arr, titre) =>
      titre.demarches.reduce((arr, titreDemarche) => {
        const titreDemarcheUpdated = titreDemarcheStatutUpdate(
          titreDemarche,
          titre
        )

        return titreDemarcheUpdated ? [...arr, titreDemarcheUpdated] : arr
      }, arr),
    []
  )

  if (titresDemarchesStatutUpdated.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresDemarchesStatutUpdated)
  }

  return `Mise à jour: ${titresDemarchesStatutUpdated.length} démarche(s) (statut).`
}

export default titresDemarchesStatutUpdate

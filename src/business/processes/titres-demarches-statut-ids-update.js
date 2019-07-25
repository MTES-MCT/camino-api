import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
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
    ? async () => {
        await titreDemarcheUpdate(titreDemarche.id, {
          statutId
        })
        console.log(
          `mise à jour: démarche ${titreDemarche.id}, ${JSON.stringify({
            statutId
          })}`
        )
      }
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

  return `mise à jour: ${titresDemarchesStatutUpdated.length} démarche(s) (statut)`
}

export default titresDemarchesStatutUpdate

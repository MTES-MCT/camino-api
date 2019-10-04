import PQueue from 'p-queue'

import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import titreDemarcheStatutIdFind from '../rules/titre-demarche-statut-id-find'

// met à jour le statut des démarches d'un titre
const titresDemarchesStatutUpdate = async titres => {
  const queue = new PQueue({ concurrency: 100 })

  const titresDemarchesUpdated = titres.reduce(
    (titresDemarchesUpdated, titre) =>
      titre.demarches.reduce((titresDemarchesUpdated, titreDemarche) => {
        titreDemarche.etapes =
          titreDemarche.etapes && titreDemarche.etapes.reverse()

        const statutId = titreDemarcheStatutIdFind(titreDemarche, titre.typeId)

        if (titreDemarche.statutId === statutId) return titresDemarchesUpdated

        queue.add(async () => {
          await titreDemarcheUpdate(titreDemarche.id, {
            statutId
          })

          console.log(
            `mise à jour: démarche ${titreDemarche.id}, ${JSON.stringify({
              statutId
            })}`
          )

          titresDemarchesUpdated.push(titreDemarche.id)
        })

        return titresDemarchesUpdated
      }, titresDemarchesUpdated),
    []
  )

  await queue.onIdle()

  return titresDemarchesUpdated
}

export default titresDemarchesStatutUpdate

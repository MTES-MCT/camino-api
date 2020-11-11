import PQueue from 'p-queue'

import { titresGet } from '../../database/queries/titres'
import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import titreDemarcheStatutIdFind from '../rules/titre-demarche-statut-id-find'

// met à jour le statut des démarches d'un titre
const titresDemarchesStatutUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('statut des démarches…')

  const queue = new PQueue({ concurrency: 100 })
  const titres = await titresGet(
    { ids: titresIds },
    { fields: { demarches: { etapes: { id: {} } } } },
    'super'
  )

  // TODO: forcer la présence des démarches sur le titre
  // https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198
  const titresDemarchesUpdated = [] as string[]

  titres.forEach(titre => {
    titre.demarches!.forEach(titreDemarche => {
      const titreDemarcheEtapes = titreDemarche.etapes?.reverse() || []

      const statutId = titreDemarcheStatutIdFind(
        titreDemarche.typeId,
        titreDemarcheEtapes,
        titre.typeId
      )

      if (titreDemarche.statutId !== statutId) {
        queue.add(async () => {
          await titreDemarcheUpdate(
            titreDemarche.id,
            { statutId },
            { fields: { id: {} } },
            'super',
            titre
          )

          const log = {
            type: 'titre / démarche : statut (mise à jour) ->',
            value: `${titreDemarche.id}: ${statutId}`
          }

          console.info(log.type, log.value)
        })

        titresDemarchesUpdated.push(titreDemarche.id)
      }
    })
  })

  await queue.onIdle()

  return titresDemarchesUpdated
}

export default titresDemarchesStatutUpdate

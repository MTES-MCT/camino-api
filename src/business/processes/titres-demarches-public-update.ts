import PQueue from 'p-queue'

import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import { titreDemarchePublicFind } from '../rules/titre-demarche-public-find'
import { titresGet } from '../../database/queries/titres'
import { userSuper } from '../../database/user-super'

type ITitreDemarchePatch = {
  publicLecture: boolean
  entreprisesLecture: boolean
}

// met à jour la publicité des démarches d'un titre
const titresDemarchesPublicUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('publicité des démarches…')

  const queue = new PQueue({ concurrency: 100 })
  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: {
          type: { etapesTypes: { id: {} } },
          etapes: { id: {} }
        }
      }
    },
    userSuper
  )

  // TODO: forcer la présence des démarches sur le titre
  // https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198

  const titresDemarchesUpdated = [] as string[]

  titres.forEach(titre => {
    titre.demarches!.forEach(titreDemarche => {
      const titreDemarcheEtapes = titreDemarche.etapes?.reverse() || []

      const demarcheTypeEtapesTypes = titreDemarche.type!.etapesTypes!.filter(
        et => et.titreTypeId === titre.typeId
      )

      const { publicLecture, entreprisesLecture } = titreDemarchePublicFind(
        titreDemarche.typeId,
        demarcheTypeEtapesTypes,
        titreDemarcheEtapes,
        titre.id,
        titre.typeId
      )

      const patch = {} as ITitreDemarchePatch

      if (titreDemarche.publicLecture !== publicLecture) {
        patch.publicLecture = publicLecture
      }

      if (titreDemarche.entreprisesLecture !== entreprisesLecture) {
        patch.entreprisesLecture = entreprisesLecture
      }

      if (Object.keys(patch).length) {
        queue.add(async () => {
          await titreDemarcheUpdate(titreDemarche.id, patch)

          const log = {
            type: 'titre / démarche : publique (mise à jour) ->',
            value: `${titreDemarche.id}: ${JSON.stringify(patch)}`
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

export { titresDemarchesPublicUpdate }

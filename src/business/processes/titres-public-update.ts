import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import titrePublicFind from '../rules/titre-public-find'

type IPublicUpdate = { publicLecture: boolean; entreprisesLecture: boolean }

// met à jour la publicité d'un titre
const titresPublicUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('publicité des titres…')
  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        type: { autorisationsTitresStatuts: { id: {} } },
        demarches: { id: {} }
      }
    },
    'super'
  )

  // TODO: forcer la présence des démarches sur le titre
  // https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198
  const titresUpdated = [] as string[]

  titres.forEach(titre => {
    const { publicLecture, entreprisesLecture } = titrePublicFind(
      titre.statutId!,
      titre.type!.autorisationsTitresStatuts!,
      titre.demarches || []
    )

    const publicUpdate = {} as IPublicUpdate

    if (titre.publicLecture !== publicLecture) {
      publicUpdate.publicLecture = publicLecture
    }

    if (titre.entreprisesLecture !== entreprisesLecture) {
      publicUpdate.entreprisesLecture = entreprisesLecture
    }

    if (Object.keys(publicUpdate).length) {
      queue.add(async () => {
        await titreUpdate(titre.id, publicUpdate)

        const log = {
          type: 'titre : public (mise à jour) ->',
          value: `${titre.id} : ${JSON.stringify(publicUpdate)}`
        }

        console.info(log.type, log.value)

        titresUpdated.push(titre.id)
      })
    }
  })

  await queue.onIdle()

  return titresUpdated
}

export default titresPublicUpdate

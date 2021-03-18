import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import { userSuper } from '../../database/user-super'
import titrePublicFind from '../rules/titre-public-find'

type ITitrePatch = {
  publicLecture: boolean
  entreprisesLecture: boolean
}

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
    userSuper
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

    const patch = {} as ITitrePatch

    if (titre.publicLecture !== publicLecture) {
      patch.publicLecture = publicLecture
    }

    if (titre.entreprisesLecture !== entreprisesLecture) {
      patch.entreprisesLecture = entreprisesLecture
    }

    if (Object.keys(patch).length) {
      queue.add(async () => {
        await titreUpdate(titre.id, patch)

        const log = {
          type: 'titre : public (mise à jour) ->',
          value: `${titre.id} : ${JSON.stringify(patch)}`
        }

        console.info(log.type, log.value)

        titresUpdated.push(titre.id)
      })
    }
  })

  await queue.onIdle()

  return titresUpdated
}

export { titresPublicUpdate }

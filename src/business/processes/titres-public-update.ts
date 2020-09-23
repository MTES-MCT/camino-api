import { ITitre } from '../../types'
import PQueue from 'p-queue'

import { titreUpdate } from '../../database/queries/titres'
import titrePublicFind from '../rules/titre-public-find'

type IPublicUpdate = { publicLecture: boolean; entreprisesLecture: boolean }

// met à jour la publicité d'un titre
const titresPublicUpdate = async (titres: ITitre[]) => {
  const queue = new PQueue({ concurrency: 100 })

  // TODO: forcer la présence des démarches sur le titre
  // https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198
  const titresUpdated = titres.reduce((titresUpdated: string[], titre) => {
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

        console.info(
          `mise à jour: titre ${titre.id}, ${JSON.stringify(publicUpdate)}`
        )

        titresUpdated.push(titre.id)
      })
    }

    return titresUpdated
  }, [])

  await queue.onIdle()

  return titresUpdated
}

export default titresPublicUpdate

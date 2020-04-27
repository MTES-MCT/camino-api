import { ITitre } from '../../types'
import PQueue from 'p-queue'

import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import titreDemarchePublicFind from '../rules/titre-demarche-public-find'

type IPublicUpdate = { publicLecture: boolean; entreprisesLecture: boolean }

// met à jour la publicité des démarches d'un titre
const titresDemarchesPublicUpdate = async (titres: ITitre[]) => {
  const queue = new PQueue({ concurrency: 100 })

  // TODO: forcer la présence des démarches sur le titre
  // https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198
  const titresDemarchesUpdated = titres.reduce(
    (titresDemarchesUpdated: string[], titre) =>
      titre.demarches!.reduce(
        (titresDemarchesUpdated: string[], titreDemarche) => {
          const titreDemarcheEtapes = titreDemarche.etapes?.reverse() || []

          const demarcheTypeEtapesTypes = titreDemarche.type!.etapesTypes!.filter(
            et => et.titreTypeId === titre.typeId
          )

          const { publicLecture, entreprisesLecture } = titreDemarchePublicFind(
            titreDemarche.typeId,
            demarcheTypeEtapesTypes,
            titreDemarcheEtapes,
            titre.typeId
          )

          const publicUpdate = {} as IPublicUpdate

          if (titreDemarche.publicLecture !== publicLecture) {
            publicUpdate.publicLecture = publicLecture
          }

          if (titreDemarche.entreprisesLecture !== entreprisesLecture) {
            publicUpdate.entreprisesLecture = entreprisesLecture
          }

          if (Object.keys(publicUpdate).length) {
            queue.add(async () => {
              await titreDemarcheUpdate(titreDemarche.id, publicUpdate)

              console.info(
                `mise à jour: démarche ${titreDemarche.id}, ${JSON.stringify(
                  publicUpdate
                )}`
              )

              titresDemarchesUpdated.push(titreDemarche.id)
            })
          }

          return titresDemarchesUpdated
        },
        titresDemarchesUpdated
      ),
    []
  )

  await queue.onIdle()

  return titresDemarchesUpdated
}

export default titresDemarchesPublicUpdate

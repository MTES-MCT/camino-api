import PQueue from 'p-queue'

import { ITitreEtape, IUtilisateur } from '../../types'

import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import {
  etapeSectionsDictionaryBuild,
  titreEtapeHeritageContenuFind
} from '../utils/titre-etape-heritage-contenu-find'
import { userSuper } from '../../database/user-super'

const titresEtapesHeritageContenuUpdate = async (
  user: IUtilisateur,
  titresDemarchesIds?: string[]
) => {
  console.info()
  console.info('héritage des contenus des étapes…')
  const queue = new PQueue({ concurrency: 100 })

  const titresDemarches = await titresDemarchesGet(
    { titresDemarchesIds },
    {
      fields: {
        etapes: { type: { id: {} } }
      }
    },
    userSuper
  )

  // lorsqu'une étape est mise à jour par un utilisateur,
  // l'objet heritageContenu reçu ne contient pas d'id d'étape
  // l'étape est donc toujours mise à jour

  const titresEtapesIdsUpdated = [] as string[]

  titresDemarches.forEach(titreDemarche => {
    if (titreDemarche.etapes?.length) {
      const etapeSectionsDictionary = etapeSectionsDictionaryBuild(
        titreDemarche.etapes
      )

      const titreEtapes = titreDemarche.etapes
        ?.filter(e => etapeSectionsDictionary[e.id])
        .reverse()

      if (titreEtapes) {
        titreEtapes.forEach((titreEtape: ITitreEtape, index: number) => {
          const titreEtapesFiltered = titreEtapes.slice(0, index).reverse()

          const { contenu, heritageContenu, hasChanged } =
            titreEtapeHeritageContenuFind(
              titreEtapesFiltered,
              titreEtape,
              etapeSectionsDictionary
            )

          if (hasChanged) {
            queue.add(async () => {
              await titreEtapeUpdate(
                titreEtape.id,
                {
                  contenu,
                  heritageContenu
                },
                user,
                titreDemarche.titreId
              )

              const log = {
                type: 'titre / démarche / étape : héritage du contenu (mise à jour) ->',
                value: `${titreEtape.id}`
              }

              console.info(log.type, log.value)

              titresEtapesIdsUpdated.push(titreEtape.id)
            })

            titreEtape.contenu = contenu
            titreEtape.heritageContenu = heritageContenu
          }
        })
      }
    }
  })

  await queue.onIdle()

  return titresEtapesIdsUpdated
}

export { titresEtapesHeritageContenuUpdate }

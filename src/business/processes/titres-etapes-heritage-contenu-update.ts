import { IContenu, IHeritageContenu, ISection, ITitreEtape } from '../../types'

import PQueue from 'p-queue'

import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { etapeTypeSectionsFormat } from '../../api/_format/etapes-types'
import { titreEtapeHeritageContenuFind } from '../utils/titre-etape-heritage-contenu-find'

const titresEtapesHeritageContenuUpdate = async (
  titresDemarchesIds?: string[]
) => {
  console.info()
  console.info('héritage des contenus des étapes…')
  const queue = new PQueue({ concurrency: 100 })

  const titresDemarches = await titresDemarchesGet(
    { titresDemarchesIds },
    {
      fields: {
        type: { etapesTypes: { id: {} } },
        etapes: { type: { id: {} } },
        titre: { id: {} }
      }
    },
    'super'
  )

  // lorsqu'une étape est mise à jour par un utilisateur,
  // l'objet heritageContenu reçu ne contient pas d'id d'étape
  // l'étape est donc toujours mise à jour

  const titresEtapesIdsUpdated = [] as string[]

  titresDemarches.forEach(titreDemarche => {
    if (titreDemarche.etapes?.length) {
      const etapeSectionsIndex = titreDemarche.etapes.reduce(
        (acc: { [id: string]: ISection[] }, e) => {
          const sections = etapeTypeSectionsFormat(
            e.type!,
            titreDemarche.type!.etapesTypes!,
            titreDemarche.titre!.typeId
          )

          if (sections.length) {
            acc[e.id] = sections
          }

          return acc
        },
        {}
      )

      const titreEtapes = titreDemarche.etapes
        ?.filter(e => etapeSectionsIndex[e.id])
        .reverse()

      if (titreEtapes) {
        titreEtapes.forEach((titreEtape: ITitreEtape, index: number) => {
          const sections = etapeSectionsIndex[titreEtape.id]

          let titreEtapeHasChanged = false
          let contenu = titreEtape.contenu as IContenu
          const heritageContenu = titreEtape.heritageContenu as IHeritageContenu

          sections.forEach(section => {
            if (section.elements?.length) {
              section.elements.forEach(element => {
                // parmi les étapes précédentes,
                // trouve l'étape qui contient section / element
                const prevTitreEtape = titreEtapes
                  .slice(0, index)
                  .reverse()
                  .find(e =>
                    etapeSectionsIndex[e.id]?.find(
                      s =>
                        s.id === section.id &&
                        s.elements!.find(e => e.id === element.id)
                    )
                  )

                const {
                  hasChanged,
                  value,
                  etapeId
                } = titreEtapeHeritageContenuFind(
                  section.id,
                  element.id,
                  titreEtape,
                  prevTitreEtape
                )

                if (hasChanged) {
                  if (value || value === 0) {
                    if (!contenu) {
                      contenu = {}
                    }

                    if (!contenu[section.id]) {
                      contenu[section.id] = {}
                    }

                    contenu![section.id][element.id] = value
                  } else if (contenu && contenu[section.id]) {
                    delete contenu[section.id][element.id]
                  }

                  heritageContenu[section.id][element.id].etapeId = etapeId

                  titreEtapeHasChanged = true
                }
              })
            }
          })

          if (titreEtapeHasChanged) {
            queue.add(async () => {
              await titreEtapeUpdate(titreEtape.id, {
                contenu,
                heritageContenu
              })

              const log = {
                type:
                  'titre / démarche / étape : héritage du contenu (mise à jour) ->',
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

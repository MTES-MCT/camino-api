import { IContenu, IHeritageContenu, ISection, ITitreEtape } from '../../types'

import PQueue from 'p-queue'

import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { etapeTypeSectionsFormat } from '../../api/_format/etapes-types'
import { objectClone } from '../../tools'
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
        etapes: {
          type: { id: {} }
        },
        titre: { id: {} }
      }
    },
    'super'
  )

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

          const { hasChanged, contenu, heritageContenu } = sections.reduce(
            (
              acc: {
                hasChanged: boolean
                contenu?: IContenu | null
                heritageContenu: IHeritageContenu
              },
              section
            ) => {
              if (!section.elements) return acc

              section.elements.forEach(element => {
                const prevEtapes = objectClone(
                  titreEtapes.slice(0, index)
                ) as ITitreEtape[]

                const tePrecedente = prevEtapes.reverse().find(e => {
                  // si etapeSectionsIndex de l'étape contient section / element
                  if (
                    etapeSectionsIndex[e.id]?.find(
                      s =>
                        s.id === section.id &&
                        s.elements!.find(e => e.id === element.id)
                    )
                  ) {
                    return true
                  }

                  return false
                })

                const {
                  hasChanged,
                  value,
                  etapeId
                } = titreEtapeHeritageContenuFind(
                  section.id,
                  element.id,
                  titreEtape,
                  tePrecedente
                )

                if (hasChanged) {
                  if (value || value === 0) {
                    if (!acc.contenu) {
                      acc.contenu = {}
                    }

                    if (!acc.contenu[section.id]) {
                      acc.contenu[section.id] = {}
                    }

                    acc.contenu![section.id][element.id] = value
                  } else if (acc.contenu && acc.contenu[section.id]) {
                    delete acc.contenu[section.id][element.id]
                  }

                  acc.hasChanged = acc.hasChanged || hasChanged
                  acc.heritageContenu[section.id][element.id].etapeId = etapeId
                }
              })

              return acc
            },
            {
              hasChanged: false,
              contenu: titreEtape.contenu,
              heritageContenu: titreEtape.heritageContenu!
            }
          )

          if (hasChanged) {
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

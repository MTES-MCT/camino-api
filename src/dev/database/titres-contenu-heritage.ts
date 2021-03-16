import { ISection, ITitreEtape } from '../../types'
import '../../init'
import { knex } from '../../knex'

import { titresGet } from '../../database/queries/titres'
import TitresEtapes from '../../database/models/titres-etapes'
import { etapeTypeSectionsFormat } from '../../api/_format/etapes-types'
import { objectClone } from '../../tools'

async function main() {
  await knex.schema.alterTable('titresEtapes', table => {
    table.dropColumn('contenuHeritage')
    table.dropColumn('sourceIndisponible')
    table.jsonb('heritageContenu')
  })

  const titres = await titresGet(
    {},
    {
      fields: {
        demarches: {
          type: { etapesTypes: { id: {} } },
          etapes: {
            type: { id: {} }
          }
        }
      }
    },
    'super'
  )

  for (const t of titres) {
    if (t.demarches?.length) {
      for (const td of t.demarches) {
        if (td.etapes?.length) {
          // construit un index des sections d'étapes
          const etapeSectionsIndex = td.etapes.reduce(
            (acc: { [id: string]: ISection[] }, e) => {
              const sections = etapeTypeSectionsFormat(
                e.type!,
                td.type!.etapesTypes!,
                t.typeId
              )

              if (sections.length) {
                acc[e.id] = sections
              }

              return acc
            },
            {}
          )

          const etapes = td.etapes
            .filter(e => etapeSectionsIndex[e.id])
            .reverse()

          for (let i = 0; i < etapes.length; i++) {
            const te = etapes[i]

            if (!te.heritageContenu) {
              te.heritageContenu = {}
            }

            const sections = etapeSectionsIndex[te.id]

            sections.forEach(section => {
              if (!te.heritageContenu![section.id]) {
                te.heritageContenu![section.id] = {}
              }

              if (section.elements) {
                section.elements.forEach(element => {
                  const prevEtapes = objectClone(
                    etapes.slice(0, i)
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

                  te.heritageContenu![section.id][element.id] = {
                    etapeId: tePrecedente?.id || null,
                    actif: false
                  }
                })
              }
            })

            await TitresEtapes.query()
              .patch({ heritageContenu: te.heritageContenu })
              .where('id', te.id)
          }
        }
      }
    }
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

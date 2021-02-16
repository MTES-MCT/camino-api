import 'dotenv/config'
import { ITitreEtape } from '../../src/types'

import knex from '../../src/init'

import { titresGet } from '../../src/database/queries/titres'
import TitresEtapes from '../../src/database/models/titres-etapes'

const titreEtapeProps = [
  'points',
  'titulaires',
  'amodiataires',
  'substances',
  'surface',
  'dateFin',
  'dateDebut',
  'duree'
] as (keyof ITitreEtape)[]

async function main() {
  await knex.schema.alterTable('titresEtapes', table => {
    table.dropColumn('propsTitreEtapesIds')
    table.jsonb('propsHeritage')
    table.dropColumn('contenusTitreEtapesIds')
    table.jsonb('contenuHeritage')
  })

  const titres = await titresGet(
    {},
    {
      fields: {
        demarches: {
          etapes: {
            type: { id: {} },
            points: { id: {} },
            titulaires: { id: {} },
            amodiataires: { id: {} },
            substances: { id: {} },
            administrations: { id: {} }
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
          const etapes = td.etapes.filter(e => e.type!.fondamentale).reverse()
          for (let i = 0; i < etapes.length; i++) {
            const te = etapes[i]

            const tePrecedenteId = i > 0 ? etapes[i - 1].id : null

            if (!te.propsHeritage) {
              te.propsHeritage = {}
            }

            titreEtapeProps.forEach(prop => {
              te.propsHeritage![prop] = {
                etapeId: tePrecedenteId,
                actif: false
              }
            })

            await TitresEtapes.query()
              .patch({ propsHeritage: te.propsHeritage })
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

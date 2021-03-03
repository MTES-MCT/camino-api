import 'dotenv/config'
import { ITitreEtape } from '../../types'

import knex from '../../init'

import { titresGet } from '../../database/queries/titres'
import TitresEtapes from '../../database/models/titres-etapes'

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
    table.jsonb('heritageProps')
    table.dropColumn('contenusTitreEtapesIds')
    table.jsonb('heritageContenu')
  })

  await knex.schema.alterTable('titresSubstances', table => {
    table.dropColumn('connexe')
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
            substances: { id: {} }
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

            if (!te.heritageProps) {
              te.heritageProps = {}
            }

            titreEtapeProps.forEach(prop => {
              te.heritageProps![prop] = {
                etapeId: tePrecedenteId,
                actif: false
              }
            })

            await TitresEtapes.query()
              .patch({ heritageProps: te.heritageProps })
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

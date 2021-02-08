import 'dotenv/config'
import '../../src/init'
import { ITitreEtape } from '../../src/types'

import { titresGet } from '../../src/database/queries/titres'
import TitresEtapes from '../../src/database/models/titres-etapes'

const titrePropsEtapes = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'substances',
  'surface',
  'dateFin',
  'dateDebut'
] as (keyof ITitreEtape)[]

async function main() {
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
            const tePrecedente = i ? etapes[i - 1] : undefined

            if (!te.propsTitreEtapesIds) {
              te.propsTitreEtapesIds = {}
            }

            titrePropsEtapes.forEach(prop => {
              if (
                te[prop] &&
                (!Array.isArray(te[prop]) || (te[prop] as any[]).length)
              ) {
                te.propsTitreEtapesIds[prop] = te.id
              } else if (tePrecedente?.propsTitreEtapesIds[prop]) {
                te.propsTitreEtapesIds[prop] =
                  tePrecedente.propsTitreEtapesIds[prop]
              }
            })

            await TitresEtapes.query().patchAndFetchById(te.id, {
              propsTitreEtapesIds: te.propsTitreEtapesIds
            })
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

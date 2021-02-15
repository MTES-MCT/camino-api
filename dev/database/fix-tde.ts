import 'dotenv/config'
import '../../src/init'

import { titresDemarchesGet } from '../../src/database/queries/titres-demarches'
import TitresEtapes from '../../src/database/models/titres-etapes'

async function main() {
  let demarches = await titresDemarchesGet(
    { titresDomainesIds: ['m'], titresTypesIds: ['ax'], typesIds: ['oct'] },
    { fields: { etapes: { id: {} } } },
    'super'
  )

  console.log('migration des étapes d’oct d’AXM')
  for (const d of demarches) {
    const etapes = d.etapes!.filter(
      e => e.typeId === 'rco' || e.typeId === 'mco'
    )
    for (const e of etapes) {
      const typeId = e.typeId === 'rco' ? 'rca' : 'mca'
      await TitresEtapes.query().patch({ typeId }).where('id', e.id)
      console.log(`migration du type de l’étape ${e.id} => ${typeId}`)
    }
  }

  demarches = await titresDemarchesGet(
    { titresDomainesIds: ['m'], titresTypesIds: ['ar'], typesIds: ['oct'] },
    { fields: { etapes: { id: {} } } },
    'super'
  )

  console.log('migration des étapes d’oct d’ARM')
  for (const d of demarches) {
    const etapes = d.etapes!.filter(e => e.typeId === 'rco')
    for (const e of etapes) {
      const typeId = 'rcm'
      await TitresEtapes.query().patch({ typeId }).where('id', e.id)
      console.log(`migration du type de l’étape ${e.id} => ${typeId}`)
    }
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

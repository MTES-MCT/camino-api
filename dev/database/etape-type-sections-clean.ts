import 'dotenv/config'
import '../../src/init'
import {
  titresTypesDemarchesTypesEtapesTypesGet,
  titreTypeDemarcheTypeEtapeTypeUpdate
} from '../../src/database/queries/metas'

const main = async () => {
  const titresTypesDemarchesTypesEtapesTypes = await titresTypesDemarchesTypesEtapesTypesGet()

  for (const ttdtet of titresTypesDemarchesTypesEtapesTypes) {
    let hasChanged = null
    if (ttdtet.sections?.length) {
      ttdtet.sections.forEach(s => {
        if (s.id === 'cxx' && s.elements?.length) {
          s.elements.forEach(e => {
            if (e.id === 'volume') {
              delete e.description
              hasChanged = true
            }
          })
        }
      })

      if (hasChanged) {
        await titreTypeDemarcheTypeEtapeTypeUpdate(
          ttdtet.titreTypeId,
          ttdtet.demarcheTypeId,
          ttdtet.etapeTypeId,
          { sections: ttdtet.sections }
        )

        console.info(
          ttdtet.titreTypeId,
          ttdtet.demarcheTypeId,
          ttdtet.etapeTypeId,
          'modifiée'
        )
      }
    }
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

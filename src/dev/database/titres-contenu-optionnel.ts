import '../../init'

import EtapesTypes from '../../database/models/etapes-types'
import TitresTypesDemarchesTypesEtapesTypes from '../../database/models/titres-types--demarches-types-etapes-types'

async function main() {
  const etapeTypes = await EtapesTypes.query()
  for (const et of etapeTypes) {
    et.sections?.forEach(s => s.elements?.forEach(e => (e.optionnel = true)))
    await EtapesTypes.query()
      .patch({ sections: et.sections })
      .where('id', et.id)
  }

  const tdes = await TitresTypesDemarchesTypesEtapesTypes.query()
  for (const tde of tdes) {
    tde.sections?.forEach(s => s.elements?.forEach(e => (e.optionnel = true)))
    await TitresTypesDemarchesTypesEtapesTypes.query()
      .patch({ sections: tde.sections })
      .where('titreTypeId', tde.titreTypeId)
      .andWhere('demarcheTypeId', tde.demarcheTypeId)
      .andWhere('etapeTypeId', tde.etapeTypeId)
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

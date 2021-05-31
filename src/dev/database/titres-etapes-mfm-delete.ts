import '../../init'

import TitresEtapes from '../../database/models/titres-etapes'
import EtapesTypesEtapesStatuts from '../../database/models/etapes-types--etapes-statuts'
import EtapesTypes from '../../database/models/etapes-types'
import AdministrationsTitresTypesEtapesTypes from '../../database/models/administrations-titres-types-etapes-types'
import TitresTypesDemarchesTypesEtapesTypes from '../../database/models/titres-types--demarches-types-etapes-types'
import EtapesTypesDocumentsTypes from '../../database/models/etapes-types--documents-types'
import { contenuElementFilesDelete } from '../../business/utils/contenu-element-file-process'
import { objectClone } from '../../tools'
import { etapeTypeSectionsFormat } from '../../api/_format/etapes-types'

const main = async () => {
  const etapes = await TitresEtapes.query()
    .whereRaw("(contenu->>'arm')::json->>'materiel' is not null")
    .withGraphFetched({
      demarche: { type: { etapesTypes: {} }, titre: {} },
      type: {}
    })

  for (const etape of etapes) {
    const oldContenu = objectClone(etape.contenu)

    delete etape.contenu!.arm.materiel
    delete etape.heritageContenu!.arm.materiel
    await TitresEtapes.query()
      .patch({ contenu: etape.contenu })
      .where('id', etape.id)

    const sections = etapeTypeSectionsFormat(
      etape.type!,
      etape.demarche!.type!.etapesTypes,
      etape.demarche!.titre!.typeId
    )

    await contenuElementFilesDelete(
      'demarches',
      etape.id,
      sections,
      [etape],
      oldContenu
    )
  }

  await TitresEtapes.query().patch({ typeId: 'mfr' }).where('typeId', 'mfm')

  const mfrTDE = await TitresTypesDemarchesTypesEtapesTypes.query()
    .where('titreTypeId', 'arm')
    .andWhere('demarcheTypeId', 'oct')
    .andWhere('etapeTypeId', 'mfr')
    .first()

  const mfmTDE = await TitresTypesDemarchesTypesEtapesTypes.query()
    .where('titreTypeId', 'arm')
    .andWhere('demarcheTypeId', 'oct')
    .andWhere('etapeTypeId', 'mfm')
    .first()

  mfrTDE.sections = mfmTDE.sections!.map(section => {
    if (section.id === 'arm') {
      section.elements = section.elements!.filter(({ id }) => id !== 'materiel')
    }

    return section
  })
  await TitresTypesDemarchesTypesEtapesTypes.query().upsertGraph(mfrTDE)

  await EtapesTypesEtapesStatuts.query().delete().where('etapeTypeId', 'mfm')
  await AdministrationsTitresTypesEtapesTypes.query()
    .delete()
    .where('etapeTypeId', 'mfm')
  await TitresTypesDemarchesTypesEtapesTypes.query()
    .delete()
    .where('etapeTypeId', 'mfm')
  await EtapesTypesDocumentsTypes.query().delete().where('etapeTypeId', 'mfm')
  await EtapesTypes.query().deleteById('mfm')

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

import '../../init'
import EtapesTypes from '../../database/models/etapes-types'
import TitresEtapes from '../../database/models/titres-etapes'
import { ISectionElement } from '../../types'

const main = async () => {
  const etapeTypeRde = await EtapesTypes.query().where('id', 'rde').first()

  const sectionDealElementNumeroRecipisse = etapeTypeRde.sections
    ?.find(s => s.id === 'deal')!
    .elements?.find(e => e.id === 'numero-recepice') as ISectionElement

  sectionDealElementNumeroRecipisse.id = 'numero-recepisse'

  await EtapesTypes.query().patch(etapeTypeRde).where('id', 'rde')

  const titresEtapesRde = await TitresEtapes.query().where('typeId', 'rde')

  for (const te of titresEtapesRde) {
    let hasChanged = false

    if (te.contenu?.deal) {
      te.contenu.deal['numero-recepisse'] = te.contenu.deal['numero-recepice']
      delete te.contenu.deal['numero-recepice']
      hasChanged = true
    }

    if (te.heritageContenu?.deal) {
      te.heritageContenu.deal['numero-recepisse'] =
        te.heritageContenu.deal['numero-recepice']
      delete te.heritageContenu?.deal['numero-recepice']
      hasChanged = true
    }

    if (hasChanged) {
      await TitresEtapes.query().patch(te).where('id', te.id)
    }
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

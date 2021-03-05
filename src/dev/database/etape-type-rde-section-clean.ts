import 'dotenv/config'
import '../../init'
import EtapesTypes from '../../database/models/etapes-types'
import TitresEtapes from '../../database/models/titres-etapes'
import { IContenuElement, ISectionElement } from '../../types'

const main = async () => {
  const etapeTypeRde = await EtapesTypes.query().where('id', 'rde').first()

  const numeroRecepisseSectionDeal = etapeTypeRde.sections
    ?.find(s => s.id === 'deal')!
    .elements?.find(e => e.id === 'numero-recepice') as ISectionElement

  numeroRecepisseSectionDeal.id = 'numero-recepisse'
  numeroRecepisseSectionDeal.nom = 'Numéro de récépissé'
  numeroRecepisseSectionDeal.description =
    'Numéro de récépissé émis par la DEAL Service eau'

  await EtapesTypes.query().patch(etapeTypeRde).where('id', 'rde')

  const titresEtapesRde = await (
    await TitresEtapes.query().where('typeId', 'rde')
  ).filter(te => te.contenu && te.contenu && te.contenu.deal)

  for (const te of titresEtapesRde) {
    const contenu = te.contenu

    if (contenu) {
      const deal = contenu.deal as IContenuElement
      deal['numero-recepisse'] = deal['numero-recepice']
      delete deal['numero-recepice']

      contenu.deal = deal
      te.contenu = contenu
    }

    const heritageContenu = te.heritageContenu

    if (heritageContenu) {
      const deal = heritageContenu.deal
      deal['numero-recepisse'] = deal['numero-recepice']
      delete deal['numero-recepice']

      heritageContenu.deal = deal
      te.heritageContenu = heritageContenu
    }

    await TitresEtapes.query().patch(te).where('id', te.id)
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

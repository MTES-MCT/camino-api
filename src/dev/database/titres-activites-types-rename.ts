import 'dotenv/config'
import '../../init'
import ActivitesTypes from '../../database/models/activites-types'
import DocumentsTypes from '../../database/models/documents-types'

const main = async () => {
  const activiteTypeGra = await ActivitesTypes.query()
    .where('id', 'gra')
    .first()

  activiteTypeGra.nom = "rapport annuel d'exploitation"

  const sectionGra = activiteTypeGra.sections.find(
    s => s.id === 'substancesFiscales'
  )!

  sectionGra.nom = 'Production annuelle'

  await ActivitesTypes.query().patch(activiteTypeGra).where('id', 'gra')

  const activiteTypeGrx = await ActivitesTypes.query()
    .where('id', 'grx')
    .first()
  activiteTypeGrx.nom = "rapport annuel d'exploitation"

  const sectionGrx = activiteTypeGrx.sections.find(
    s => s.id === 'substancesFiscales'
  )!
  sectionGrx.nom = 'Production annuelle'

  await ActivitesTypes.query().patch(activiteTypeGrx).where('id', 'grx')

  const documentTypeRgr = await DocumentsTypes.query()
    .where('id', 'rgr')
    .first()

  documentTypeRgr.nom = "rapport annuel d'exploitation"

  await DocumentsTypes.query().patch(documentTypeRgr).where('id', 'rgr')

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

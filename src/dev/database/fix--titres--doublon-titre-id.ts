import '../../init'
import Titres from '../../database/models/titres'

const main = async () => {
  const titres = await Titres.query().whereNotNull('doublonTitreId')

  for (const titre of titres) {
    const doublonTitre = await Titres.query()
      .whereRaw('?? = ?', ['slug', titre.doublonTitreId])
      .first()

    await Titres.query()
      .patch({ doublonTitreId: doublonTitre.id })
      .where('id', titre.id)
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

import 'dotenv/config'
import '../../init'

import Titres from '../../database/models/titres'
import options from '../../database/queries/_options'
import Entreprises from '../../database/models/entreprises'

const titres = require('../../../sources/reprise-titres.json')

const main = async () => {
  console.time('Import Titres')

  let entrepriseNumber = 200000000
  let nb = 0
  for (const titre of titres) {
    const etape = titre.demarches[0].etapes[0]

    const titulairesNoms: string[] = etape.titulaires
    if (titulairesNoms && titulairesNoms.length) {
      const titulaires = []
      for (const titulaireNom of titulairesNoms) {
        const titulairesBdd = await Entreprises.query().where(
          'nom',
          titulaireNom
        )
        let titulaireId
        if (titulairesBdd.length === 0) {
          titulaireId = `xx-${entrepriseNumber}`
          entrepriseNumber++
          await Entreprises.query().insertGraph({
            id: titulaireId,
            nom: titulaireNom,
            archive: true
          })
        } else if (titulairesBdd.length === 1) {
          titulaireId = titulairesBdd[0].id
          console.info(
            `Entreprise existante trouvée : ${titulaireId} ${titulaireNom}`
          )
        } else {
          console.error(
            `Le titulaire ${titulaireNom} est en double, il faut le rattacher manuellement au titre ${titre.id}`
          )
        }

        titulaires.push({ id: titulaireId })
      }

      for (const etape of titre.demarches[0].etapes) {
        etape.titulaires = titulaires
      }
    }

    await Titres.query().insertGraph(titre, options.titres.update)
    nb++
  }

  console.info('Entreprises crées', entrepriseNumber - 199999999)
  console.info('Titres importés', nb)
  console.timeEnd('Import Titres')

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

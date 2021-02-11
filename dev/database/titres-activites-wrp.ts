import 'dotenv/config'
import '../../src/init'

import TitresActivites from '../../src/database/models/titres-activites'
import { ITitreActivite } from '../../src/types'

const main = async () => {
  const titresActivites = await TitresActivites.query().where('typeId', 'wrp')

  for (const ta of titresActivites) {
    const dateAnnee = Number(ta.date.slice(0, 4))

    if (dateAnnee === ta.annee) {
      const patch = {} as Partial<ITitreActivite>
      patch.date = `${dateAnnee + 1}${ta.date.slice(4)}`

      if (ta.dateSaisie && patch.date > ta.dateSaisie) {
        patch.dateSaisie = patch.date
      }
      console.info(ta.id)
      await TitresActivites.query().patch(patch).where('id', ta.id)
    }
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

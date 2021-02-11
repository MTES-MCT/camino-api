import 'dotenv/config'
import '../../src/init'

import TitresActivites from '../../src/database/models/titres-activites'

const main = async () => {
  const titresActivites = await TitresActivites.query().where(
    'suppression',
    true
  )

  const titresActivitesSupprimeesIds = [] as string[]
  const titresActivitesConserveesIds = [] as string[]
  for (const ta of titresActivites) {
    if (
      !ta.contenu?.renseignements ||
      (ta.typeId === 'grp' &&
        Object.keys(ta.contenu.renseignements).every(
          propId => !ta.contenu!.renseignements![propId]
        ))
    ) {
      titresActivitesSupprimeesIds.push(ta.id)
      console.log('activité supprimée', ta.id)
      await TitresActivites.query().where('id', ta.id).del()
    } else {
      titresActivitesConserveesIds.push(ta.id)
    }
  }

  console.info('activités conservées:', titresActivitesConserveesIds.join(', '))
  console.info('activités suprrimées:', titresActivitesSupprimeesIds.length)

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

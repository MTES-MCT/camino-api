import '../../init'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import TitresActivites from '../../database/models/titres-activites'

async function main() {
  console.info(
    `rend les documents optionnels sur les types d'activités rie, rfe, ree, rse`
  )

  const titresActivites = await titresActivitesGet(
    { typesIds: ['gra', 'grx'] },
    { fields: {} },
    'super'
  )

  for (const ta of titresActivites) {
    if (
      ta.dateSaisie &&
      ta.dateSaisie < '2021-02-08' &&
      ta.contenu &&
      ta.contenu.substancesFiscales &&
      ta.contenu.substancesFiscales.auru
    ) {
      ta.contenu.substancesFiscales.auru =
        Number(ta.contenu.substancesFiscales.auru) / 1000

      await TitresActivites.query()
        .patch({ contenu: ta.contenu })
        .where('id', ta.id)

      console.info(`activité ${ta.id} modifiée`)
    }
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

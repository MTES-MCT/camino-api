import 'dotenv/config'
import '../../init'
import fileCreate from '../../tools/file-create'

import { titreGet } from '../../database/queries/titres'

async function main() {
  // const userId = 'super'

  // admin dea-guyane-01
  // const userId = 'f5922d'

  // admin dea-guyane-01 et ONF
  //   const userId = 'f455dd'

  // admin onf uniquement
  //   const userId = '5c0d2b'

  // admin ptmg uniquement
  const userId = 'super'

  // admin dgpr
  //   const userId = '80dcfd'

  // entreprise titulaire sainte-helene
  // const userId = 'd343f9'

  // entreprise titulaire boeuf mort
  // const userId = '8e8a19'

  // entreprise titulaire d'auror
  // const userId = 'd6378e'

  // non-logué
  // const userId = undefined

  // titre echu public
  const titreId = 'w-cx-chassiron-d-2002'

  // titre non-public
  // const titreId =
  //   'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019'

  // titre avec activités
  // const titreId = 'm-ax-auror-2018'

  console.info({ userId, titreId })

  console.time('toto')
  const res = await titreGet(
    titreId,
    {
      fields: {
        demarches: {
          etapes: { id: {} }
        }
      },
      fetchHeritage: true
    },
    userId
  )
  console.timeEnd('toto')

  // const res = await TitresEtapes.query()
  //   .alias('te')
  //   .where('te.id', titreEtapeId)
  //   .select(
  //     raw('false').as('modification'),
  //     raw('CASE WHEN (te.modification is not null) THEN ?? END as tutu', [
  //       'te.id'
  //     ])
  //   )

  console.info(res)

  await fileCreate('test-titre-etape.json', JSON.stringify(res, null, 2))

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

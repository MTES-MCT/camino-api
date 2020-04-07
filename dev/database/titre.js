import 'dotenv/config'
import '../../src/database/index'
import fileCreate from '../../src/tools/file-create'

import { titreGet, titresGet } from '../../src/database/queries/titres'

async function main() {
  const userId = 'super'

  // admin dea-guyane-01
  // const userId = 'f5922d'

  // admin dgaln
  // const userId = 'f455dd'

  // admin onf uniquement
  // const userId = '5c0d2b'

  // admin ptmg uniquement
  // const userId = '1ee94a'

  // admin dgpr
  // const userId = '80dcfd'

  // admin dgpr
  // const userId = '80dcfd'

  // entreprise titulaire sainte-helene
  // const userId = 'd343f9'

  // entreprise titulaire boeuf mort
  // const userId = '8e8a19'

  // entreprise titulaire d'auror
  // const userId = 'd6378e'

  // non-logué
  // const userId = undefined

  // titre ARM echu mod
  // const titreId = 'm-ar-crique-grand-moussinga-2019'

  // titre echu public
  // const titreId = 'm-ar-sainte-helene-2019'

  // titre non-public
  // const titreId =
  //   'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019'

  // titre avec activités
  const titreId = 'm-ax-auror-2018'

  //
  // const titreId = 'm-ax-crique-marie-hilaire-2018'

  console.log({ userId, titreId })

  // console.time('titres')
  // const titres = await titresGet(
  //   {},
  //   {
  //     fields: {
  //       demarches: { etapes: { id: {} } },
  //       activites: { id: {} }
  //     }
  //   },
  //   userId
  // )
  // console.timeEnd('titres')

  // process.exit(0)

  const res = await titreGet(
    titreId,
    {
      fields: {
        demarches: { etapes: { id: {} } },
        activites: { id: {} }
      }
    },
    userId
  )

  console.log('type:', res.typeId)
  console.log('statut:', res.statutId)

  console.log('etapes:')

  res.demarches.forEach(d => {
    console.log(
      'demarche:',
      d.id,
      `modification: ${d.modification}, etapesCreation: ${d.etapesCreation}`
    )

    d.etapes.forEach(e => {
      console.log(`etape.${e.id}, modification: ${e.modification}`)
    })
  })

  console.log('activites:')
  console.log(
    res.activites
      .map(
        e =>
          `activite.id: ${e.id}, statut: ${e.statutId}, modification: ${e.modification}`
      )
      .join('\n')
  )

  console.log('titre.modification:', res.modification)

  console.log('titre.activitesAbsentes:', res.activitesAbsentes)
  console.log('titre.activitesEnConstruction:', res.activitesEnConstruction)
  console.log('titre.activitesDeposees:', res.activitesDeposees)

  await fileCreate('tmp/test-titre.json', JSON.stringify(res, null, 2))

  process.exit(0)
}

main().catch(console.error)

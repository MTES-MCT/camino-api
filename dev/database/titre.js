import 'dotenv/config'
import '../../src/database/index'
import fileCreate from '../../src/tools/file-create'

import { userGet } from '../../src/database/queries/utilisateurs'
import { titreGet, titresGet } from '../../src/database/queries/titres'

async function main() {
  // const userId = 'super'

  // admin dea-guyane-01
  // const userId = 'f5922d'

  // admin dgaln
  // const userId = '511478'

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

  // entreprise AMAZON RESSOURCE titulaire de crique mousse
  const userId = '0eea48'

  // non-logué
  // const userId = undefined

  // titre ARM echu mod
  // const titreId = 'm-ar-crique-grand-moussinga-2019'

  // titre echu public
  // const titreId = 'm-ar-sainte-helene-2019'

  // titre non-public
  // const titreId =
  //   'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019'

  // titre avec pfd
  const titreId = 'm-ar-crique-mousse-2019'

  // titre avec activités
  // const titreId = 'm-ax-auror-2018'

  // titre
  // const titreId = 'm-cx-bon-espoir-2016'

  //
  // const titreId = 'm-ax-crique-marie-hilaire-2018'

  console.info({ userId, titreId })

  const user = await userGet(userId)

  console.info(
    'user:',
    user.id,
    'permission:',
    user.permissionId,
    'admin:',
    user.administrations?.map(a => a.id).join(', ')
  )

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

  console.info(`titre: ${res.id}, type: ${res.typeId}, statut: ${res.statutId}`)

  res.demarches.forEach(d => {
    console.info(
      `demarche: ${d.id}, modification: ${d.modification}, etapesCreation: ${d.etapesCreation}`
    )

    d.etapes.forEach(e => {
      console.info(`etape: ${e.id}, modification: ${e.modification}`)
    })
  })

  console.info(
    res.activites
      .map(
        e =>
          `activite: ${e.id}, statut: ${e.statutId}, modification: ${e.modification}`
      )
      .join('\n')
  )

  console.info('titre.modification:', res.modification)

  console.info('titre.activitesAbsentes:', res.activitesAbsentes)
  console.info('titre.activitesEnConstruction:', res.activitesEnConstruction)
  console.info('titre.activitesDeposees:', res.activitesDeposees)

  await fileCreate('dev/tmp/test-titre.json', JSON.stringify(res, null, 2))

  process.exit(0)
}

main().catch(console.error)

import 'dotenv/config'
import '../../src/init'
import fileCreate from '../../src/tools/file-create'

import {
  userGet,
  utilisateurGet
} from '../../src/database/queries/utilisateurs'

async function main() {
  // const userId = 'super'

  // admin dea-guyane-01
  // const userId = 'f5922d'

  // admin dgaln
  //   const userId = '511478'

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

  // defaut
  const userId = '015465'

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
  // const titreId = 'm-ax-auror-2018'

  const user = await userGet(userId)

  console.info(
    'user:',
    user.id,
    'permission:',
    user.permissionId,
    'admins:',
    user.administrations?.map(a => a.id).join(', '),
    'entreprises:',
    user.entreprises?.map(a => a.id).join(', ')
  )

  const utilisateurId = userId

  const utilisateur = await utilisateurGet(utilisateurId, {}, userId)

  console.info(
    'utilisateur:',
    utilisateur.id,
    'modification:',
    utilisateur.modification,
    'suppression:',
    utilisateur.suppression,
    'permissionModification:',
    utilisateur.permissionModification,
    'permission:',
    utilisateur.permissionId,
    'admins:',
    utilisateur.administrations?.map(a => a.id).join(', '),
    'entreprises:',
    utilisateur.entreprises?.map(a => a.id).join(', ')
  )

  await fileCreate(
    'dev/tmp/test-utilisateur.json',
    JSON.stringify(utilisateur, null, 2)
  )

  process.exit(0)
}

main().catch(console.error)

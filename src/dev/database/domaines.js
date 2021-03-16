import '../../database/init'
import fileCreate from '../../tools/file-create'

import { domainesGet } from '../../database/queries/metas'

async function main() {
  // const userId = 'super'

  // admin dea-guyane-01
  // const userId = 'f5922d'

  // admin dea-guyane-01 et ONF
  // const userId = 'f455dd'

  // admin onf uniquement
  //   const userId = '5c0d2b'

  // admin ptmg uniquement
  // const userId = '1ee94a'

  // admin dgpr
  // const userId = '80dcfd'

  // admin dgaln
  //   const userId = '511478'

  // admin dgec
  const userId = '0586bc'

  // entreprise titulaire sainte-helene
  // const userId = 'd343f9'

  // entreprise titulaire boeuf mort
  // const userId = '8e8a19'

  // entreprise titulaire d'auror
  // const userId = 'd6378e'

  // non-logué
  //   const userId = undefined

  // titre echu public
  // const titreId = 'm-ar-sainte-helene-2019'

  // titre ARM echu dmi
  const titreId = 'm-ar-crique-grand-moussinga-2019'

  // titre non-public
  // const titreId =
  //   'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019'

  // titre avec activités
  // const titreId = 'm-ax-auror-2018'

  console.info({ userId, titreId })

  const res = await domainesGet(
    {},
    { fields: { titresTypes: { id: {} } } },
    userId
  )

  res.forEach(d => {
    console.info('domaine.id:', d.id)

    console.info('domaine.titresModification:', d.titresModification)

    console.info(
      d.titresTypes
        .map(
          t =>
            `domaine.titesTypes: ${t.id}, modification: ${t.titresModification}`
        )
        .join('\n')
    )
  })

  await fileCreate(
    'dev/tmp/test-demarches-types.json',
    JSON.stringify(res, null, 2)
  )

  process.exit(0)
}

main()

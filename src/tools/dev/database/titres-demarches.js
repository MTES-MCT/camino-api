import 'dotenv/config'
import '../../../database/index'
import { titreGet } from '../../../database/queries/titres'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'

async function main() {
  let typeId = 'pro'
  let titreDemarcheId = `h-prh-tarbes-val-d-adour-2008-pr101`
  let titreDemarche = await titreDemarcheGet(titreDemarcheId)

  if (!titreDemarche) {
    typeId = 'pr1'
    titreDemarcheId = `h-prh-tarbes-val-d-adour-2008-pro01`
    titreDemarche = await titreDemarcheGet(titreDemarcheId)
  }

  const titre = await titreGet(titreDemarche.titreId)

  const titreDemarcheOld = titre.demarches.find(d => d.id === titreDemarcheId)

  titreDemarcheOld.typeId = typeId

  process.exit()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})

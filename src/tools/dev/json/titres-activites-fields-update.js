import fileCreate from '../../file-create'
import { join } from 'path'

const titresActivitesPath = 'sources/titres-activites.json'
const titresActivites = require(join('../../../..', titresActivitesPath))

async function main() {
  titresActivites.forEach(ta => {
    ta.type_id = ta.activite_type_id
    delete ta.activite_type_id

    ta.statut_id = ta.activite_statut_id
    delete ta.activite_statut_id
  })

  await fileCreate(
    `${titresActivitesPath}.json`,
    JSON.stringify(titresActivites, null, 2)
  )
}

main()

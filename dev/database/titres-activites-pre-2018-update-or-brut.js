import 'dotenv/config'
import '../../src/database/index'

import {
  titresActivitesGet,
  titreActivitesUpsert
} from '../../src/database/queries/titres-activites'

async function main() {
  const titresActivites = await titresActivitesGet()

  const activitesToUpdate = titresActivites.reduce((activitesToUpdate, a) => {
    if (a.annee >= 2018) return activitesToUpdate

    if ('orBrut' in a.contenu.renseignements) {
      a.contenu.renseignements.orExtrait = a.contenu.renseignements.orBrut

      delete a.contenu.renseignements.orBrut

      activitesToUpdate.push(a)
    }

    return activitesToUpdate
  }, [])

  console.log('Activités à mettre à jour :', activitesToUpdate.length)

  if (activitesToUpdate.length) {
    console.log(activitesToUpdate.map(({ id }) => id).join('\n'))

    await titreActivitesUpsert(activitesToUpdate)
  }

  process.exit()
}

main()

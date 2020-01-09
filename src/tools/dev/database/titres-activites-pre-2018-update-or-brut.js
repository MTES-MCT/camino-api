import 'dotenv/config'
import '../../../database/index'

import {
  titresActivitesGet,
  titresActivitesUpsert
} from '../../../database/queries/titres-activites'

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

    await titresActivitesUpsert(activitesToUpdate)
  }

  process.exit()
}

main()

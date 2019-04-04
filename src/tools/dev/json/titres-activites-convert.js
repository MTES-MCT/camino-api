import fileCreate from '../../file-create'
import { join } from 'path'

const titresActivitesPath = 'sources/titres-activites.json'
const titresActivites = require(join('../../../..', titresActivitesPath))

async function main() {
  const titresActivitesNew = JSON.stringify(
    titresActivites.map(ta => {
      if (ta.contenu && ta.contenu.travaux) {
        ta.contenu.travaux = Object.keys(ta.contenu.travaux).reduce(
          (res, key) =>
            Object.assign(res, { [key]: ta.contenu.travaux[key].split(',') }),
          {}
        )
      }

      return ta
    }),
    null,
    2
  )

  await fileCreate(titresActivitesPath, titresActivitesNew)
}

main()

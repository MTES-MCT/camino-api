import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import titreCoordoneesFind from '../rules/titre-coordonnees-find'

const titresCoordonneesUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('coordonnées des titres…')
  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    { fields: { points: { id: {} } } },
    'super'
  )

  const titresCoordonneesUpdated = [] as string[]

  titres.forEach(titre => {
    const coordonnees = titreCoordoneesFind(titre.points)

    if (
      (coordonnees &&
        titre.coordonnees &&
        (coordonnees.x !== titre.coordonnees.x ||
          coordonnees.y !== titre.coordonnees.y)) ||
      !coordonnees !== !titre.coordonnees
    ) {
      queue.add(async () => {
        await titreUpdate(titre.id, { coordonnees })

        const log = {
          type: 'titre : coordonnées (mise à jour) ->',
          value: `${titre.id} : ${coordonnees?.x}, ${coordonnees?.y}`
        }

        console.info(log.type, log.value)

        titresCoordonneesUpdated.push(titre.id)
      })
    }
  })

  await queue.onIdle()

  return titresCoordonneesUpdated
}

export { titresCoordonneesUpdate }

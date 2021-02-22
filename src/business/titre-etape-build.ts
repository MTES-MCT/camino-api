import { IHeritageProps, ITitreEtape } from '../types'
import {
  titreEtapePropsHeritageFind,
  titreEtapePropsIds
} from './utils/titre-etape-props-heritage-find'

const titreEtapeBuild = (date: string, titreEtapes?: ITitreEtape[] | null) => {
  const titreEtape = {
    date,
    heritageProps: titreEtapePropsIds.reduce((acc: IHeritageProps, id) => {
      acc[id] = { actif: !!titreEtapesFiltered.length }

      return acc
    }, {})
  } as ITitreEtape

  const titreEtapesFiltered =
    titreEtapes
      ?.filter(e => e.type?.fondamentale && e.date <= date)
      .reverse() || []

  titreEtapesFiltered.push(titreEtape)

  titreEtapesFiltered.forEach((te: ITitreEtape, index: number) => {
    const titreEtapePrecedente =
      index > 0 ? titreEtapesFiltered[index - 1] : null

    const { titreEtape } = titreEtapePropsHeritageFind(te, titreEtapePrecedente)

    te = titreEtape
  })

  const newTitreEtape = titreEtapesFiltered[titreEtapesFiltered.length - 1]

  if (newTitreEtape.heritageProps) {
    Object.keys(newTitreEtape.heritageProps).forEach(id => {
      const etapeId =
        newTitreEtape.heritageProps && newTitreEtape.heritageProps[id].etapeId

      console.log(etapeId)

      if (etapeId) {
        newTitreEtape.heritageProps![id].etape = titreEtapesFiltered.find(
          ({ id }) => id === etapeId
        )
      }
    })
  }

  return newTitreEtape
}

export { titreEtapeBuild }

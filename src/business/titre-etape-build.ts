import { IHeritageProps, ITitreEtape } from '../types'
import {
  titreEtapeHeritagePropsFind,
  titreEtapePropsIds
} from './utils/titre-etape-heritage-props-find'

const titreEtapeBuild = (date: string, titreEtapes?: ITitreEtape[] | null) => {
  const titreEtapesFiltered =
    titreEtapes?.filter(e => e.type?.fondamentale && e.date < date).reverse() ||
    []

  const heritageProps = titreEtapePropsIds.reduce((acc: IHeritageProps, id) => {
    acc[id] = { actif: !!titreEtapesFiltered.length }

    return acc
  }, {})

  const titreEtape = { date, heritageProps } as ITitreEtape

  titreEtapesFiltered.push(titreEtape)

  titreEtapesFiltered.forEach((te: ITitreEtape, index: number) => {
    const titreEtapePrecedente =
      index > 0 ? titreEtapesFiltered[index - 1] : null

    const { titreEtape } = titreEtapeHeritagePropsFind(te, titreEtapePrecedente)

    titreEtapesFiltered[index] = titreEtape
  })

  const newTitreEtape = titreEtapesFiltered[titreEtapesFiltered.length - 1]

  if (newTitreEtape.heritageProps) {
    Object.keys(newTitreEtape.heritageProps).forEach(id => {
      const etapeId =
        newTitreEtape.heritageProps && newTitreEtape.heritageProps[id].etapeId

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

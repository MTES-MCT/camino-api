import {
  ITitreEtape,
  IEntreprise,
  ITitrePoint,
  ITitreIncertitudes,
  ITitreSubstance
} from '../../types'
import { objectClone } from '../../tools'

const titreEtapePropsIds: (keyof ITitreEtape)[] = [
  'points',
  'titulaires',
  'amodiataires',
  'substances',
  'surface',
  'dateFin',
  'dateDebut',
  'duree'
]

const titrePointsIdsUpdate = (
  titrePoints: ITitrePoint[],
  oldTitreEtapeId: string,
  newTitreEtapeId: string
) =>
  titrePoints.map(p => {
    p.id = p.id.replace(oldTitreEtapeId, newTitreEtapeId)
    p.titreEtapeId = newTitreEtapeId

    p.references = p.references.map(r => {
      r.id = r.id.replace(oldTitreEtapeId, newTitreEtapeId)
      r.titrePointId = p.id

      return r
    })

    return p
  })

const propertyArrayCheck = (
  newValue: IPropValueArray,
  prevValue: IPropValueArray,
  propId: string
) => {
  if (prevValue?.length !== newValue?.length) {
    return false
  }

  if (prevValue?.length && newValue?.length) {
    if (propId === 'points') {
      const comparator = ({ coordonnees }: ITitrePoint) =>
        `(${coordonnees.x}, ${coordonnees.y})`

      return (
        (newValue as ITitrePoint[]).map(comparator).sort().toString() ===
        (prevValue as ITitrePoint[]).map(comparator).sort().toString()
      )
    } else {
      const comparator = ((propValueArray: { id: string; ordre: number }) =>
        propValueArray.id + propValueArray.ordre) as (obj: {
        id: string
        ordre: number
      }) => string

      return (
        (newValue as { id: string; ordre: number }[])
          .map(comparator)
          .sort()
          .toString() ===
        (prevValue as { id: string; ordre: number }[])
          .map(comparator)
          .sort()
          .toString()
      )
    }
  }

  return true
}

type IPropValueArray =
  | undefined
  | null
  | IEntreprise[]
  | ITitrePoint[]
  | ITitreSubstance[]

type IPropValue = number | string | IPropValueArray

const titreEtapePropCheck = (
  propId: string,
  oldValue?: IPropValue | null,
  newValue?: IPropValue | null
) => {
  if (['titulaires', 'amodiataires', 'substances', 'points'].includes(propId)) {
    return propertyArrayCheck(
      oldValue as IPropValueArray,
      newValue as IPropValueArray,
      propId
    )
  }

  return oldValue === newValue
}

const titreEtapeHeritagePropsFind = (
  titreEtape: ITitreEtape,
  prevTitreEtape?: ITitreEtape | null
) => {
  let hasChanged = false

  let newTitreEtape = titreEtape

  titreEtapePropsIds.forEach(propId => {
    const heritage = titreEtape.heritageProps![propId]
    const prevHeritage = prevTitreEtape?.heritageProps![propId]
    const etapeId =
      prevHeritage?.etapeId && prevHeritage?.actif
        ? prevHeritage.etapeId
        : prevTitreEtape?.id

    if (heritage.actif && prevTitreEtape) {
      const oldValue = titreEtape[propId] as IPropValue | undefined | null
      const newValue = prevTitreEtape[propId] as IPropValue | undefined | null

      if (!titreEtapePropCheck(propId, oldValue, newValue)) {
        hasChanged = true
        newTitreEtape = objectClone(newTitreEtape)

        if (propId === 'points') {
          newTitreEtape.points = titrePointsIdsUpdate(
            newValue as ITitrePoint[],
            prevTitreEtape.id,
            newTitreEtape.id
          )
        } else if (propId === 'amodiataires' || propId === 'titulaires') {
          newTitreEtape[propId] = newValue as IEntreprise[]
        } else if (propId === 'substances') {
          newTitreEtape[propId] = newValue as ITitreSubstance[]
        } else if (propId === 'dateDebut' || propId === 'dateFin') {
          newTitreEtape[propId] = newValue as string
        } else if (propId === 'duree' || propId === 'surface') {
          newTitreEtape[propId] = newValue as number
        }
      }

      const incertitudePropId = propId as keyof ITitreIncertitudes
      // si l’incertitude est déjà présente, on la supprime
      if (
        newTitreEtape.incertitudes &&
        newTitreEtape.incertitudes[incertitudePropId]
      ) {
        hasChanged = true
        newTitreEtape = objectClone(newTitreEtape)
        delete newTitreEtape.incertitudes![incertitudePropId]
      }
      // si il y a une incertitude sur l’étape précédente, alors on la recopie
      if (
        prevTitreEtape.incertitudes &&
        prevTitreEtape.incertitudes[incertitudePropId]
      ) {
        hasChanged = true
        newTitreEtape = objectClone(newTitreEtape)
        if (!newTitreEtape.incertitudes) {
          newTitreEtape.incertitudes = {}
        }

        newTitreEtape.incertitudes![incertitudePropId] =
          prevTitreEtape.incertitudes[incertitudePropId]
      }
    }

    if ((etapeId || heritage.etapeId) && etapeId !== heritage.etapeId) {
      hasChanged = true
      newTitreEtape = objectClone(newTitreEtape)
      newTitreEtape.heritageProps![propId].etapeId = etapeId
    }
  })

  return { hasChanged, titreEtape: newTitreEtape }
}

export { titreEtapeHeritagePropsFind, titreEtapePropsIds }

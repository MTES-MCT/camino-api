import { ITitreEtape, IEntreprise, ITitrePoint, ISubstance } from '../../types'
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
      const comparator = ((propValueArray: { id: string }) =>
        propValueArray.id) as (obj: { id: string }) => string

      return (
        (newValue as { id: string }[]).map(comparator).sort().toString() ===
        (prevValue as { id: string }[]).map(comparator).sort().toString()
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
  | ISubstance[]

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

const titreEtapePropsHeritageFind = (
  titreEtape: ITitreEtape,
  prevTitreEtape?: ITitreEtape | null
) => {
  let hasChanged = false

  let newTitreEtape = titreEtape

  titreEtapePropsIds.forEach(propId => {
    const titreEtapePropHeritage = titreEtape.heritageProps![propId]
    const prevTitreEtapePropHeritage = prevTitreEtape?.heritageProps![propId]
    const etapeId =
      prevTitreEtapePropHeritage?.etapeId && prevTitreEtapePropHeritage?.actif
        ? prevTitreEtapePropHeritage.etapeId
        : prevTitreEtape?.id

    if (titreEtapePropHeritage.actif && prevTitreEtape) {
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
          newTitreEtape[propId] = newValue as ISubstance[]
        } else if (propId === 'dateDebut' || propId === 'dateFin') {
          newTitreEtape[propId] = newValue as string
        } else if (propId === 'duree' || propId === 'surface') {
          newTitreEtape[propId] = newValue as number
        }
      }
    }

    if (
      (etapeId || titreEtapePropHeritage.etapeId) &&
      etapeId !== titreEtapePropHeritage.etapeId
    ) {
      hasChanged = true
      newTitreEtape = objectClone(newTitreEtape)
      newTitreEtape.heritageProps![propId].etapeId = etapeId
    }
  })

  return { hasChanged, titreEtape: newTitreEtape }
}

export { titreEtapePropsHeritageFind, titreEtapePropsIds }

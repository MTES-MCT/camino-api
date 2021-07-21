import {
  ITitreEtape,
  IEntreprise,
  ITitrePoint,
  ITitreIncertitudes,
  ITitreSubstance,
  ITitreEntreprise
} from '../../types'
import { objectClone } from '../../tools/index'
import { idGenerate } from '../../database/models/_format/id-create'

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
  newTitreEtapeId: string
) =>
  titrePoints.map(p => {
    p.id = idGenerate()
    p.titreEtapeId = newTitreEtapeId

    p.references = p.references.map(r => {
      r.id = idGenerate()
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
    } else if (propId === 'substances') {
      const comparator = (propValueArray: { id: string; ordre: number }) =>
        propValueArray.id + propValueArray.ordre

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
    } else if (['titulaires', 'amodiataires'].includes(propId)) {
      const comparator = (propValueArray: ITitreEntreprise) =>
        propValueArray.id + propValueArray.operateur

      return (
        (newValue as ITitreEntreprise[]).map(comparator).sort().toString() ===
        (prevValue as ITitreEntreprise[]).map(comparator).sort().toString()
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

  const partialTitreEtape: Partial<ITitreEtape> = {
    heritageProps: titreEtape.heritageProps
  }

  if (!titreEtape.heritageProps) {
    partialTitreEtape.heritageProps = {}
    hasChanged = true
  }

  titreEtapePropsIds.forEach(propId => {
    const heritage = partialTitreEtape.heritageProps![propId]

    if (!heritage) {
      hasChanged = true
      partialTitreEtape.heritageProps![propId] = { actif: false, etapeId: null }
    }

    const prevHeritage = prevTitreEtape?.heritageProps
      ? prevTitreEtape?.heritageProps[propId]
      : null

    const etapeId =
      prevHeritage?.etapeId && prevHeritage?.actif
        ? prevHeritage.etapeId
        : prevTitreEtape?.id

    if (heritage?.actif) {
      if (prevTitreEtape) {
        const oldValue = titreEtape[propId] as IPropValue | undefined | null
        const newValue = prevTitreEtape[propId] as IPropValue | undefined | null

        if (!titreEtapePropCheck(propId, oldValue, newValue)) {
          hasChanged = true

          if (propId === 'points') {
            partialTitreEtape.points = titrePointsIdsUpdate(
              newValue as ITitrePoint[],
              titreEtape.id
            )
          } else if (propId === 'amodiataires' || propId === 'titulaires') {
            partialTitreEtape[propId] = newValue as IEntreprise[]
          } else if (propId === 'substances') {
            partialTitreEtape[propId] = newValue as ITitreSubstance[]
          } else if (propId === 'dateDebut' || propId === 'dateFin') {
            partialTitreEtape[propId] = newValue as string
          } else if (propId === 'duree' || propId === 'surface') {
            partialTitreEtape[propId] = newValue as number
          }
        }

        const incertitudePropId = propId as keyof ITitreIncertitudes

        if (
          titreEtape.incertitudes &&
          prevTitreEtape.incertitudes &&
          titreEtape.incertitudes[incertitudePropId] !==
            prevTitreEtape.incertitudes[incertitudePropId]
        ) {
          hasChanged = true
          partialTitreEtape.incertitudes = {
            [incertitudePropId]: prevTitreEtape.incertitudes[incertitudePropId]
          }
        } else if (titreEtape.incertitudes && !prevTitreEtape.incertitudes) {
          hasChanged = true
          partialTitreEtape.incertitudes = null
        } else if (
          prevTitreEtape.incertitudes &&
          prevTitreEtape.incertitudes[incertitudePropId] &&
          !titreEtape.incertitudes
        ) {
          hasChanged = true
          partialTitreEtape.incertitudes = {
            [incertitudePropId]: prevTitreEtape.incertitudes[incertitudePropId]
          }
        }
      } else {
        // l’étape précédente a été supprimée, il faut donc désactiver l’héritage
        hasChanged = true
        partialTitreEtape.heritageProps![propId].actif = false
      }
    }

    if ((etapeId || heritage?.etapeId) && etapeId !== heritage?.etapeId) {
      hasChanged = true
      partialTitreEtape.heritageProps![propId].etapeId = etapeId
    }
  })

  let titreEtapeUpdated = titreEtape
  if (hasChanged) {
    titreEtapeUpdated = objectClone(titreEtape)

    Object.keys(partialTitreEtape).forEach(
      (key: string) =>
        ((titreEtapeUpdated as any)[key] = (partialTitreEtape as any)[key])
    )
  }

  return {
    hasChanged,
    titreEtapeUpdated,
    partialTitreEtape
  }
}

export { titreEtapeHeritagePropsFind, titreEtapePropsIds }

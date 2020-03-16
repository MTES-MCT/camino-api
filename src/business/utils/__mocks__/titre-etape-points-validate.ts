import { ITitrePoint } from '../../../types'

const titreEtapePointsValides = ([{
  point: 'point',
  contour: 'contour',
  group: 'group',
  references: [{
    coordonnees: {
      x: 1,
      y: 2
    }
  }]
}] as unknown) as ITitrePoint[]

const titreEtapePointsReferenceManquante = ([{
  point: 'point-ref-manquante',
  contour: 'contour-ref-manquante',
  group: 'group-ref-manquante',
  references: [{}]
}] as unknown) as ITitrePoint[]

export { titreEtapePointsValides, titreEtapePointsReferenceManquante }

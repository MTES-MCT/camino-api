import { ITitrePoint } from '../../../types'

const titreEtapePointsValides = [
  {
    point: 'point',
    contour: 'contour',
    groupe: 'group',
    references: [{ coordonnees: { x: 1, y: 2 } }]
  }
] as unknown as ITitrePoint[]

const titreEtapePointsReferenceManquante = [
  {
    point: 'point-ref-manquante',
    contour: 'contour-ref-manquante',
    groupe: 'group-ref-manquante',
    references: [{}]
  }
] as unknown as ITitrePoint[]

export { titreEtapePointsValides, titreEtapePointsReferenceManquante }

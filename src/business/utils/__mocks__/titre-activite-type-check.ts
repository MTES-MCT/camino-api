import { IActiviteType, ITitre } from '../../../types'

const activiteTypeMAxmPxmGuyane = {
  titresTypes: [{ id: 'axm' }, { id: 'pxm' }],
  pays: [{ id: 'GF' }]
} as IActiviteType

const activiteTypeMPrmMetropole = {
  titresTypes: [{ id: 'prm' }],
  pays: [{ id: 'FR' }]
} as IActiviteType

const activiteTypeWPrwSansPays = {
  titresTypes: [{ id: 'prw' }]
} as IActiviteType

const titreMAxmGuyane = {
  id: 'm-ax-saint-pierre-2015',
  typeId: 'axm',
  pays: [{ id: 'GF' }]
} as ITitre

const titreMAxmMetropole = {
  id: 'm-ax-ile-de-france-2015',
  typeId: 'axm',
  pays: [{ id: 'FR' }]
} as ITitre

const titreMPrmMetropole = {
  id: 'm-pr-saint-jean-2016',
  typeId: 'prm',
  pays: [{ id: 'FR' }]
} as ITitre

const titreSansPays = {
  id: 'm-ax-saint-jacques-2016',
  typeId: 'axm'
} as ITitre

const titrePrwSansPays = {
  id: 'w-pr-grande-normandie-2018',
  typeId: 'prw'
} as ITitre

export {
  activiteTypeMAxmPxmGuyane,
  activiteTypeMPrmMetropole,
  activiteTypeWPrwSansPays,
  titreSansPays,
  titreMAxmGuyane,
  titreMAxmMetropole,
  titreMPrmMetropole,
  titrePrwSansPays
}

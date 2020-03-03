const activiteTypeMAxmPxmGuyane = {
  titresTypes: [{ id: 'axm' }, { id: 'pxm' }],
  pays: [{ id: 'GF' }]
}

const activiteTypeMPrmMetropole = {
  titresTypes: [{ id: 'prm' }],
  pays: [{ id: 'FR' }]
}

const activiteTypeWPrwSansPays = {
  titresTypes: [{ id: 'prw' }]
}

const titreMAxmGuyane = {
  id: 'm-ax-saint-pierre-2015',
  typeId: 'axm',
  pays: [{ id: 'GF' }]
}

const titreMAxmMetropole = {
  id: 'm-ax-ile-de-france-2015',
  typeId: 'axm',
  pays: [{ id: 'FR' }]
}

const titreMPrmMetropole = {
  id: 'm-pr-saint-jean-2016',
  typeId: 'prm',
  pays: [{ id: 'FR' }]
}

const titreSansPays = {
  id: 'm-ax-saint-jacques-2016',
  typeId: 'axm'
}

const titrePrwSansPays = {
  id: 'w-pr-grande-normandie-2018',
  typeId: 'prw'
}

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

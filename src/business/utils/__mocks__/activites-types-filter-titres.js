const titreMAxmGuf = {
  id: 'm-ax-saint-pierre-2015',
  domaineId: 'm',
  typeId: 'axm',
  pays: [{ id: 'GUF' }]
}

const titreMPrmFra = {
  id: 'm-pr-saint-jean-2016',
  domaineId: 'm',
  typeId: 'prm',
  pays: [{ id: 'FRA' }]
}

const titreAucunPays = {
  id: 'm-ax-saint-jacques-2016',
  domaineId: 'm',
  typeId: 'axm'
}

const activiteTypeMAxmPxmGuf = {
  titresTypes: [
    {
      domaineId: 'm',
      id: 'axm'
    },
    {
      domaineId: 'm',
      id: 'pxm'
    }
  ],
  pays: [{ id: 'GUF' }]
}

const activiteTypeMPrmFra = {
  titresTypes: [
    {
      domaineId: 'm',
      id: 'prm'
    }
  ],
  pays: [{ id: 'FRA' }]
}

const activiteSansPays = {
  titresTypes: [
    {
      domaineId: 'm',
      id: 'prm'
    }
  ]
}

export {
  titreAucunPays,
  titreMAxmGuf,
  titreMPrmFra,
  activiteTypeMAxmPxmGuf,
  activiteTypeMPrmFra,
  activiteSansPays
}

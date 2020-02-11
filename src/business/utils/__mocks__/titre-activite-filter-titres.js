const titreMAxmGuf = {
  id: 'm-ax-saint-pierre-2015',
  domaineId: 'm',
  typeId: 'axm',
  pays: [{ id: 'GUF' }]
}

const titreGPrxFra = {
  id: 'g-pr-saint-jean-2016',
  domaineId: 'g',
  typeId: 'prx',
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

const activiteTypeGPrxFra = {
  titresTypes: [
    {
      domaineId: 'g',
      id: 'prx'
    }
  ],
  pays: [{ id: 'FRA' }]
}

export {
  titreAucunPays,
  titreMAxmGuf,
  titreGPrxFra,
  activiteTypeMAxmPxmGuf,
  activiteTypeGPrxFra
}

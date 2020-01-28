const titreMAxmGuf = {
  id: 'm-axm-saint-pierre-2015',
  domaineId: 'm',
  typeId: 'axm',
  pays: [{ id: 'GUF' }]
}

const titreGPrxFra = {
  id: 'g-prx-saint-jean-2016',
  domaineId: 'g',
  typeId: 'prx',
  pays: [{ id: 'FRA' }]
}

const titreAucunPays = {
  id: 'm-axm-saint-jacques-2016',
  domaineId: 'm',
  typeId: 'axm'
}

const activiteTypeMAxmPxmGuf = {
  types: [
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
  types: [
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

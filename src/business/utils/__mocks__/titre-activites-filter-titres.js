const titreHCxxFra = {
  id: 'h-cxx-saint-paul-2014',
  domaineId: 'h',
  typeId: 'cxx',
  pays: [{ id: 'FRA' }]
}

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

const activitesTypes = [activiteTypeMAxmPxmGuf, activiteTypeGPrxFra]

export {
  titreHCxxFra,
  titreMAxmGuf,
  titreGPrxFra,
  activitesTypes,
  activiteTypeMAxmPxmGuf,
  activiteTypeGPrxFra
}

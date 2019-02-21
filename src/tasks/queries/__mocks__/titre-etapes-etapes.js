const titreEtapes = [
  {
    id: 'm-prx-saint-pierre-2014-pro01-dpu01',
    titreDemarcheId: 'm-prx-saint-pierre-2014-pro01',
    ordre: 1,
    typeId: 'dpu',
    statutId: 'acc',
    date: '1988-03-11T23:00:00.000Z'
  },
  {
    id: 'm-prx-saint-pierre-2014-pro01-dex01',
    titreDemarcheId: 'm-prx-saint-pierre-2014-pro01',
    ordre: 2,
    typeId: 'dex',
    statutId: 'acc',
    date: '1988-03-06T23:00:00.000Z'
  }
]

const titreEtapesEgales = [
  {
    id: 'm-prx-saint-pierre-2014-pro01-dpu01',
    titreDemarcheId: 'm-prx-saint-pierre-2014-pro01',
    ordre: 3,
    typeId: 'dpu',
    statutId: 'acc',
    date: '1988-03-06T23:00:00.000Z'
  },
  {
    id: 'm-prx-saint-pierre-2014-pro01-dex01',
    titreDemarcheId: 'm-prx-saint-pierre-2014-pro01',
    ordre: 2,
    typeId: 'dex',
    statutId: 'acc',
    date: '1988-03-06T23:00:00.000Z'
  }
]

const titreEtapesOrdonnees = [
  {
    id: 'm-prx-saint-pierre-2014-pro01-dpu01',
    titreDemarcheId: 'm-prx-saint-pierre-2014-pro01',
    ordre: 1,
    typeId: 'dpu',
    statutId: 'acc',
    date: '1988-03-06T23:00:00.000Z'
  },
  {
    id: 'm-prx-saint-pierre-2014-pro01-dex01',
    titreDemarcheId: 'm-prx-saint-pierre-2014-pro01',
    ordre: 2,
    typeId: 'dex',
    statutId: 'acc',
    date: '1988-03-11T23:00:00.000Z'
  }
]

const titreEtapeCommunesParis = {
  communes: [{ id: 'Paris' }]
}

const titreEtapeCommunesMetz = {
  communes: [{ id: 'Metz' }]
}

export {
  titreEtapes,
  titreEtapesEgales,
  titreEtapesOrdonnees,
  titreEtapeCommunesParis,
  titreEtapeCommunesMetz
}

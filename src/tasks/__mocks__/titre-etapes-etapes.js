const titreEtapesByDemarche = [
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

const titreEtapesByDemarcheEgales = [
  {
    id: 'm-prx-saint-pierre-2014-pro01-dpu01',
    titreDemarcheId: 'm-prx-saint-pierre-2014-pro01',
    ordre: 2,
    typeId: 'dpu',
    statutId: 'acc',
    date: '1988-03-06T23:00:00.000Z'
  },
  {
    id: 'm-prx-saint-pierre-2014-pro01-dex01',
    titreDemarcheId: 'm-prx-saint-pierre-2014-pro01',
    ordre: 1,
    typeId: 'dex',
    statutId: 'acc',
    date: '1988-03-06T23:00:00.000Z'
  }
]

const titreEtapesByDemarcheOrdonnees = [
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
  titreEtapesByDemarche,
  titreEtapesByDemarcheEgales,
  titreEtapesByDemarcheOrdonnees,
  titreEtapeCommunesParis,
  titreEtapeCommunesMetz
}

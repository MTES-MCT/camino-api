const titreEtapesSortedAsc = [
  {
    typeId: 'dex',
    ordre: 1,
    date: '1988-03-06'
  },
  {
    typeId: 'dpu',
    ordre: 2,
    date: '1988-03-11'
  }
]

const titreEtapesSortedDesc = [
  {
    typeId: 'dpu',
    ordre: 2,
    date: '1988-03-11'
  },
  {
    typeId: 'dex',
    ordre: 1,
    date: '1988-03-06'
  }
]

const titreEtapesSortedAscResult = [
  {
    typeId: 'dex',
    ordre: 1,
    date: '1988-03-06'
  },
  {
    typeId: 'dpu',
    ordre: 2,
    date: '1988-03-11'
  }
]

const titreEtapesMemesDatesOrdreDesc = [
  {
    typeId: 'dpu',
    ordre: 2,
    date: '1988-03-06'
  },
  {
    typeId: 'dex',
    ordre: 1,
    date: '1988-03-06'
  }
]

const titreEtapesMemesDatesOrdreAscResult = [
  {
    typeId: 'dex',
    ordre: 1,
    date: '1988-03-06'
  },
  {
    typeId: 'dpu',
    ordre: 2,
    date: '1988-03-06'
  }
]

const titreEtapesMemesDatesOrdreEtapesTypesDesc = [
  {
    typeId: 'dpu',
    ordre: 2,
    date: '1988-03-06'
  },
  {
    typeId: 'dex',
    ordre: 2,
    date: '1988-03-06'
  },
  {
    typeId: 'xxx',
    ordre: 2,
    date: '1988-03-06'
  }
]

const titreEtapesMemesDatesOrdreEtapesTypesAscResult = [
  {
    typeId: 'dex',
    ordre: 2,
    date: '1988-03-06'
  },
  {
    typeId: 'dpu',
    ordre: 2,
    date: '1988-03-06'
  },
  {
    typeId: 'xxx',
    ordre: 2,
    date: '1988-03-06'
  }
]

const titreEtapesMemesDatesMemeOrdreDesc = [
  {
    typeId: 'dex',
    ordre: 2,
    date: '1988-03-06'
  },
  {
    typeId: 'dex',
    ordre: 1,
    date: '1988-03-06'
  }
]

const titreEtapesMemesDatesMemeOrdreAscResult = [
  {
    typeId: 'dex',
    ordre: 1,
    date: '1988-03-06'
  },
  {
    typeId: 'dex',
    ordre: 2,
    date: '1988-03-06'
  }
]

const etapesTypes = [{ id: 'dex', ordre: 100 }, { id: 'dpu', ordre: 200 }]

export {
  titreEtapesSortedAsc,
  titreEtapesSortedDesc,
  titreEtapesSortedAscResult,
  titreEtapesMemesDatesOrdreDesc,
  titreEtapesMemesDatesOrdreAscResult,
  titreEtapesMemesDatesOrdreEtapesTypesDesc,
  titreEtapesMemesDatesOrdreEtapesTypesAscResult,
  titreEtapesMemesDatesMemeOrdreDesc,
  titreEtapesMemesDatesMemeOrdreAscResult,
  etapesTypes
}

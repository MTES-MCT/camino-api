import { ITitreEtape, IEtapeType } from '../../../types'

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
] as ITitreEtape[]

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
] as ITitreEtape[]

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
] as ITitreEtape[]

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
] as ITitreEtape[]

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
] as ITitreEtape[]

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
] as ITitreEtape[]

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
] as ITitreEtape[]

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
] as ITitreEtape[]

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
] as ITitreEtape[]

const etapesTypes = [
  { id: 'dex', nom: 'dex', ordre: 100, titreTypeId: 'titre-type-id' },
  { id: 'dpu', nom: 'dpu', ordre: 200, titreTypeId: 'titre-type-id' }
] as IEtapeType[]

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

import fs from 'fs'
import decamelize from 'decamelize'
import camelcase from 'camelcase'
import { mocked } from 'ts-jest/utils'

import {
  IDemarcheType,
  IEtapeType,
  ITitre,
  ITitreDemarche,
  ITitreEtape,
  ITitreType,
  IContenu,
  ITitreTypeDemarcheTypeEtapeType
} from '../../types'

import { titreDemarcheEtatValidate } from '../validations/titre-demarche-etat-validate'
import { demarcheDefinitionFind } from './definitions'
import { titreContenuFormat } from '../../database/models/_format/titre-contenu'
import { contenusTitreEtapesIdsFind } from '../utils/props-titre-etapes-ids-find'

test('teste EtatsValidate', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'arm')

  expect(octEtatsValidate).toBeTruthy()
  expect(octEtatsValidate([], {})).toHaveLength(0)
})

jest.mock('../../database/models/_format/titre-contenu', () => ({
  __esModule: true,
  titreContenuFormat: jest.fn()
}))

jest.mock('../utils/props-titre-etapes-ids-find', () => ({
  __esModule: true,
  contenusTitreEtapesIdsFind: jest.fn()
}))

const titreContenuFormatMock = mocked(titreContenuFormat, true)
const contenusTitreEtapesIdsFindMock = mocked(contenusTitreEtapesIdsFind, true)

const elementsGet = <T>(fileName: string): T[] => {
  fileName = decamelize(fileName, { separator: '-' })
  const filePath = `./sources/${fileName}`
  const results = JSON.parse(fs.readFileSync(filePath).toString())

  return results.map((result: any) =>
    Object.keys(result).reduce((acc: { [key: string]: any }, key) => {
      acc[camelcase(key)] = result[key]

      return acc
    }, {})
  )
}

const etapesTypesGet = (demarcheTypeId: string, titreTypeId: string) => {
  const titresTypesDemarchesTypesEtapesTypes = elementsGet<ITitreTypeDemarcheTypeEtapeType>(
    'titres-types--demarches-types--etapes-types.json'
  ).filter(
    tde =>
      tde.titreTypeId === titreTypeId && tde.demarcheTypeId === demarcheTypeId
  )

  return elementsGet<IEtapeType>('etapes-types.json').filter(etapeType =>
    titresTypesDemarchesTypesEtapesTypes.find(
      tde => tde.etapeTypeId === etapeType.id
    )
  )
}

const demarcheEtatsValidate = (demarcheTypeId: string, titreTypeId: string) => {
  const etapesTypes = etapesTypesGet(demarcheTypeId, titreTypeId)

  return (
    titreDemarcheEtapes: Partial<ITitreEtape>[],
    titre: Partial<ITitre> = {}
  ) => {
    contenusTitreEtapesIdsFindMock.mockReturnValue({})
    titreContenuFormatMock.mockReturnValue(titre.contenu as IContenu)

    const demarcheDefinitionRestrictions = demarcheDefinitionFind(
      titreTypeId,
      demarcheTypeId
    )!.restrictions

    const titreDemarche = { typeId: demarcheTypeId } as ITitreDemarche
    titre = {
      ...titre,
      typeId: titreTypeId,
      type: ({
        id: titreTypeId,
        contenuIds: []
      } as unknown) as ITitreType,
      demarches: [titreDemarche] as ITitreDemarche[]
    }

    return titreDemarcheEtatValidate(
      demarcheDefinitionRestrictions!,
      {
        id: demarcheTypeId,
        etapesTypes
      } as IDemarcheType,
      titreDemarche,
      titreDemarcheEtapes as ITitreEtape[],
      titre as ITitre
    )
  }
}

export { demarcheEtatsValidate, etapesTypesGet }

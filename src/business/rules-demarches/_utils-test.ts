import * as fs from 'fs'
import decamelize from '../../tools/decamelize'
import * as camelcase from 'camelcase'
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
import { titreContenuFormat } from '../../database/models/_format/titres-contenu'
import { propsTitreEtapesIdsFind } from '../utils/props-titre-etapes-ids-find'

jest.mock('../../database/models/_format/titres-contenu', () => ({
  __esModule: true,
  titreContenuFormat: jest.fn()
}))

jest.mock('../utils/props-titre-etapes-ids-find', () => ({
  __esModule: true,
  propsTitreEtapesIdsFind: jest.fn()
}))

const titreContenuFormatMock = mocked(titreContenuFormat, true)
const propsTitreEtapesIdsFindMock = mocked(propsTitreEtapesIdsFind, true)

const elementsGet = <T>(fileName: string): T[] => {
  fileName = decamelize(fileName, '-')
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
    propsTitreEtapesIdsFindMock.mockReturnValue({})
    titreContenuFormatMock.mockReturnValue(titre.contenu as IContenu)

    const etapeTypeIdDefinitions = demarcheDefinitionFind(
      titreTypeId,
      demarcheTypeId
    )?.restrictions

    titre = {
      ...titre,
      typeId: titreTypeId,
      type: ({
        id: titreTypeId,
        propsEtapesTypes: []
      } as unknown) as ITitreType,
      demarches: [{ typeId: demarcheTypeId }] as ITitreDemarche[]
    }

    return titreDemarcheEtatValidate(
      etapeTypeIdDefinitions!,
      {
        id: demarcheTypeId,
        etapesTypes
      } as IDemarcheType,
      titreDemarcheEtapes as ITitreEtape[],
      titre as ITitre
    )
  }
}

export { demarcheEtatsValidate, etapesTypesGet }

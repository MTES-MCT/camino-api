import * as fs from 'fs'
import * as camelcase from 'camelcase'
import {
  IDemarcheType,
  IEtapeType,
  ITitre,
  ITitreEtape,
  ITitreTypeDemarcheTypeEtapeType
} from '../../types'
import { titreDemarcheEtatsValidate } from '../utils/titre-demarche-etats-validate'
import { demarcheEtatsDefinitionGet } from './demarches-etats-definitions'
import decamelize = require('decamelize')

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
    const demarcheEtatsDefinition = demarcheEtatsDefinitionGet(
      titreTypeId,
      demarcheTypeId
    )

    return titreDemarcheEtatsValidate(
      demarcheEtatsDefinition!,
      {
        id: demarcheTypeId,
        etapesTypes
      } as IDemarcheType,
      titreDemarcheEtapes as ITitreEtape[],
      {
        ...titre,
        typeId: titreTypeId
      } as ITitre
    )
  }
}

export { demarcheEtatsValidate, etapesTypesGet }
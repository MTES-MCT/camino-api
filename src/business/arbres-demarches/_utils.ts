import * as fs from 'fs'
import * as camelcase from 'camelcase'
import {
  IDemarcheType,
  IEtapeType,
  ITitre,
  ITitreEtape,
  ITitreTypeDemarcheTypeEtapeType
} from '../../types'
import { titreArbreTypeIdValidate } from '../utils/titre-arbre-type-validate'
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

const arbreErreursGet = (demarcheTypeId: string, titreTypeId: string) => {
  const etapesTypes = etapesTypesGet(demarcheTypeId, titreTypeId)

  return (
    arbreTypeId: string,
    titreDemarcheEtapes: Partial<ITitreEtape>[],
    titre: Partial<ITitre> = {},
    titreEtape: Partial<ITitreEtape> = { date: '3000-01-01' }
  ) => {
    const etapeTypeId = arbreTypeId.split('-')[0]

    if (!etapesTypes.find(etapesTypes => etapesTypes.id === etapeTypeId)) {
      /* istanbul ignore next */
      throw new Error(
        `L’étape "${etapeTypeId}" n’existe pas pour les démarches "${demarcheTypeId}" des titres "${titreTypeId}"`
      )
    }

    return titreArbreTypeIdValidate(
      {
        id: demarcheTypeId,
        etapesTypes
      } as IDemarcheType,
      titreDemarcheEtapes as ITitreEtape[],
      {
        ...titre,
        typeId: titreTypeId
      } as ITitre,
      { ...titreEtape, arbreTypeId } as ITitreEtape
    )
  }
}

export { arbreErreursGet, etapesTypesGet }

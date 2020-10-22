import titreEtapeDateValidate from '../../../utils/titre-etape-date-validate'
import {
  IDemarcheType,
  IEtapeType,
  ITitre,
  ITitreEtape,
  ITitreTypeDemarcheTypeEtapeType
} from '../../../../types'
import * as fs from 'fs'
import * as camelcase from 'camelcase'
import decamelize = require('decamelize')
const each = require('jest-each').default

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

describe('vérifie l’arbre de retrait d’ARM', () => {
  let etapesTypes = [] as IEtapeType[]
  const retArbreTest = (
    etapeTypeId: string,
    etapeStatutId: string,
    titreDemarcheEtapes: ITitreEtape[]
  ) =>
    titreEtapeDateValidate(
      etapeTypeId,
      etapeStatutId,
      '3000-01-01',
      {
        id: 'ret',
        etapesTypes
      } as IDemarcheType,
      titreDemarcheEtapes,
      {
        typeId: 'arm'
      } as ITitre
    )

  beforeAll(() => {
    const titresTypesDemarchesTypesEtapesTypes = elementsGet<
      ITitreTypeDemarcheTypeEtapeType
    >('titres-types--demarches-types--etapes-types.json').filter(
      tde => tde.titreTypeId === 'arm' && tde.demarcheTypeId === 'ret'
    )

    etapesTypes = elementsGet<IEtapeType>(
      'etapes-types.json'
    ).filter(etapeType =>
      titresTypesDemarchesTypesEtapesTypes.find(
        tde => tde.etapeTypeId === etapeType.id
      )
    )
  })
  test('peut créer une étape "ide" si il n’existe pas d’autres étapes', () => {
    expect(retArbreTest('ide', '', [])).toBeNull()
  })
  test('ne peut pas créer une étape "ide" si il y a déjà une "ide"', () => {
    expect(
      retArbreTest('ide', '', [
        { typeId: 'ide', date: '2020-01-01' }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test('peut créer une "aof" juste après une "mno"', () => {
    expect(
      retArbreTest('aof', '', [
        { typeId: 'mno', date: '2020-01-01' }
      ] as ITitreEtape[])
    ).toBeNull()
  })

  test('ne peut pas créer une "css" juste après une "ide"', () => {
    expect(
      retArbreTest('css', '', [
        { typeId: 'ide', date: '2020-01-01' }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  // peut créer une "css" dés la "mno" jusqu’à la "aof"
  each(['mno', 'rif', 'mif', 'eof']).test(
    'peut créer une "css" apres une "%s"',
    (etapeTypeId: string) => {
      expect(
        retArbreTest('css', '', [
          { typeId: 'mno', date: '2020-01-01' },
          { typeId: etapeTypeId, date: '2020-01-01' }
        ] as ITitreEtape[])
      ).toBeNull()
    }
  )
  each(['aof', 'css']).test(
    'ne peut pas créer une "css" apres une "%s"',
    (etapeTypeId: string) => {
      expect(
        retArbreTest('css', '', [
          { typeId: 'mno', date: '2020-01-01' },
          { typeId: etapeTypeId, date: '2020-01-01' }
        ] as ITitreEtape[])
      ).toBeTruthy()
    }
  )
})

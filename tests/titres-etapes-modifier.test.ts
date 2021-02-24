import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils/index'
import { administrations } from './__mocks__/administrations'
import { titreDemarcheCreate } from '../src/database/queries/titres-demarches'
import { titreCreate } from '../src/database/queries/titres'
import { titreEtapeCreate } from '../src/database/queries/titres-etapes'
import { IPermissionId } from '../src/types'
import { titreEtapePropsIds } from '../src/business/utils/titre-etape-heritage-props-find'
const each = require('jest-each').default

console.info = jest.fn()
console.error = jest.fn()

beforeEach(async () => {
  await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.truncateDb()
})

afterAll(async () => {
  dbManager.closeKnex()
})

async function etapeCreate() {
  const titreId = 'titre-arm-id'
  await titreCreate(
    {
      id: 'titre-arm-id',
      nom: 'mon titre',
      domaineId: 'm',
      typeId: 'arm',
      propsTitreEtapesIds: {},
      administrationsGestionnaires: [
        administrations.ptmg,
        administrations.dgtmGuyane
      ]
    },
    {},
    'super'
  )
  const titreDemarcheId = 'demarche-test-id'
  await titreDemarcheCreate(
    {
      id: titreDemarcheId,
      titreId,
      typeId: 'oct'
    },
    {},
    'super'
  )

  const titreEtapeId = 'etape-test-id'
  await titreEtapeCreate({
    id: titreEtapeId,
    typeId: 'mfr',
    statutId: 'fai',
    titreDemarcheId,
    date: ''
  })

  return { titreDemarcheId, titreEtapeId }
}

describe('etapeModifier', () => {
  const etapeModifierQuery = queryImport('titres-etapes-modifier')

  each([undefined, 'editeur']).test(
    'ne peut pas modifier une étape (utilisateur %s)',
    async (permissionId: IPermissionId) => {
      const res = await graphQLCall(
        etapeModifierQuery,
        {
          etape: {
            id: '',
            typeId: '',
            statutId: '',
            titreDemarcheId: '',
            date: ''
          }
        },
        permissionId
      )

      expect(res.body.errors[0].message).toBe('droits insuffisants')
    }
  )

  test('ne peut pas modifier une étape sur une démarche inexistante (utilisateur super)', async () => {
    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: '',
          typeId: '',
          statutId: '',
          titreDemarcheId: '',
          date: ''
        }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe("la démarche n'existe pas")
  })

  test('peut modifier une étape mfr avec un statut fai (utilisateur super)', async () => {
    const { titreDemarcheId, titreEtapeId } = await etapeCreate()
    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: titreEtapeId,
          typeId: 'mfr',
          statutId: 'fai',
          titreDemarcheId,
          date: '',
          heritageProps: titreEtapePropsIds.reduce(
            (acc, prop) => {
              acc[prop] = { actif: false }

              return acc
            },
            {} as {
              [key: string]: { actif: boolean }
            }
          )
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
  })

  test('ne peut pas modifier une étape acg avec un statut fav (utilisateur super)', async () => {
    const { titreDemarcheId, titreEtapeId } = await etapeCreate()

    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: titreEtapeId,
          typeId: 'acg',
          statutId: 'fav',
          titreDemarcheId,
          date: ''
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
  })

  test('ne peut pas modifier une étape acg avec un statut fai (utilisateur admin)', async () => {
    const { titreDemarcheId, titreEtapeId } = await etapeCreate()

    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: titreEtapeId,
          typeId: 'acg',
          statutId: 'fai',
          titreDemarcheId,
          date: ''
        }
      },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors[0].message).toBe(
      'droits insuffisants pour modifier cette étape'
    )
  })

  test('peut modifier une étape MEN sur un titre ARM en tant que PTMG (utilisateur admin)', async () => {
    const { titreDemarcheId, titreEtapeId } = await etapeCreate()
    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: titreEtapeId,
          typeId: 'men',
          statutId: 'fai',
          titreDemarcheId,
          date: ''
        }
      },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors).toBeUndefined()
  })

  test('ne peut pas modifier une étape EDE sur un titre ARM en tant que PTMG (utilisateur admin)', async () => {
    const { titreDemarcheId, titreEtapeId } = await etapeCreate()

    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: titreEtapeId,
          typeId: 'ede',
          statutId: 'fai',
          titreDemarcheId,
          date: ''
        }
      },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors[0].message).toBe(
      'droits insuffisants pour modifier cette étape'
    )
  })
})

describe('etapeSupprimer', () => {
  const etapeSupprimerQuery = queryImport('titres-etapes-supprimer')

  each([undefined, 'admin']).test(
    'ne peut pas supprimer une étape (utilisateur %s)',
    async (permissionId: IPermissionId) => {
      const res = await graphQLCall(
        etapeSupprimerQuery,
        { id: '' },
        permissionId
      )

      expect(res.body.errors[0].message).toBe('droits insuffisants')
    }
  )

  test('ne peut pas supprimer une étape inexistante (utilisateur super)', async () => {
    const res = await graphQLCall(etapeSupprimerQuery, { id: 'toto' }, 'super')

    expect(res.body.errors[0].message).toBe("l'étape n'existe pas")
  })

  test('peut supprimer une étape (utilisateur super)', async () => {
    const { titreEtapeId } = await etapeCreate()
    const res = await graphQLCall(
      etapeSupprimerQuery,
      { id: titreEtapeId },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
  })
})

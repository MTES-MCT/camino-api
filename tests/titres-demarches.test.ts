import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import { autorisationsInit } from '../src/database/cache/autorisations'
import { titreCreate } from '../src/database/queries/titres'
import { ITitreType } from '../src/types'

console.info = jest.fn()
console.error = jest.fn()

beforeEach(async () => {
  await dbManager.populateDb()
  await autorisationsInit()
})

afterEach(async () => {
  await dbManager.truncateDb()
})

afterAll(async () => {
  dbManager.closeKnex()
})

describe('demarcheCreer', () => {
  const demarcheCreerQuery = queryImport('titres-demarches-creer')

  test('ne peut pas créer une démarche (utilisateur anonyme)', async () => {
    const res = await graphQLCall(demarcheCreerQuery, {
      demarche: {
        titreId: '',
        typeId: ''
      }
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('ne peut pas créer une démarche (utilisateur editeur)', async () => {
    const res = await graphQLCall(
      demarcheCreerQuery,
      {
        demarche: {
          titreId: '',
          typeId: ''
        }
      },
      'editeur'
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('peut créer une démarche (utilisateur super)', async () => {
    const resTitreCreer = await graphQLCall(
      queryImport('titre-creer'),
      {
        titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
      },
      'super'
    )

    const titreId = resTitreCreer.body.data.titreCreer.id

    const res = await graphQLCall(
      demarcheCreerQuery,
      {
        demarche: {
          titreId,
          typeId: 'oct'
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: {
        demarcheCreer: {}
      }
    })
  })

  test('ne peut pas créer une démarche si titre inexistant (utilisateur admin)', async () => {
    const res = await graphQLCall(
      demarcheCreerQuery,
      {
        demarche: {
          titreId: 'unknown',
          typeId: 'oct'
        }
      },
      'admin'
    )

    expect(res.body.errors[0].message).toBe("le titre n'existe pas")
  })

  test('peut créer une démarche (utilisateur admin)', async () => {
    const resTitreCreer = await graphQLCall(
      queryImport('titre-creer'),
      {
        titre: {
          nom: 'titre',
          typeId: 'arm',
          domaineId: 'm'
        }
      },
      'super'
    )

    const titreId = resTitreCreer.body.data.titreCreer.id

    const res = await graphQLCall(
      demarcheCreerQuery,
      {
        demarche: {
          titreId,
          typeId: 'oct'
        }
      },
      'admin',
      'ope-ptmg-973-01'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: {
        demarcheCreer: {}
      }
    })
  })

  test("ne peut pas créer une démarche sur un titre ARM échu (un utilisateur 'admin' PTMG)", async () => {
    await titreCreate(
      {
        id: 'titre-arm-echu',
        nom: 'mon titre échu',
        domaineId: 'm',
        typeId: 'arm',
        statutId: 'ech'
      },
      {},
      'super'
    )

    const res = await graphQLCall(
      demarcheCreerQuery,
      {
        demarche: {
          titreId: 'titre-arm-echu',
          typeId: 'oct'
        }
      },
      'admin',
      'ope-ptmg-973-01'
    )

    expect(res.body.errors[0].message).toBe(
      'droits insuffisants pour créer cette démarche'
    )
  })
})

describe('demarcheModifier', () => {
  const demarcheModifierQuery = queryImport('titres-demarches-modifier')

  test('ne peut pas modifier une démarche (utilisateur anonyme)', async () => {
    const res = await graphQLCall(demarcheModifierQuery, {
      demarche: {
        id: 'toto',
        titreId: '',
        typeId: ''
      }
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('ne peut pas modifier une démarche (utilisateur editeur)', async () => {
    const res = await graphQLCall(
      demarcheModifierQuery,
      {
        demarche: {
          id: 'toto',
          titreId: '',
          typeId: ''
        }
      },
      'editeur'
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('peut modifier une démarche (utilisateur super)', async () => {
    const { demarcheId, titreId } = await demarcheCreate()
    const res = await graphQLCall(
      demarcheModifierQuery,
      {
        demarche: {
          id: demarcheId,
          titreId,
          typeId: 'pro'
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.demarcheModifier.demarches[0].type.id).toBe('pro')
  })

  test('ne peut pas modifier une démarche avec un titre inexistant (utilisateur super)', async () => {
    const res = await graphQLCall(
      demarcheModifierQuery,
      {
        demarche: {
          id: 'toto',
          titreId: '',
          typeId: ''
        }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe("le titre n'existe pas")
  })

  test('peut modifier une démarche d’un titre ARM en PTMG (utilisateur admin)', async () => {
    const { demarcheId, titreId } = await demarcheCreate()

    const res = await graphQLCall(
      demarcheModifierQuery,
      {
        demarche: {
          id: demarcheId,
          titreId: titreId,
          typeId: 'pro'
        }
      },
      'admin',
      'ope-ptmg-973-01'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.demarcheModifier.demarches[0].type.id).toBe('pro')
  })

  test('ne peut pas modifier une démarche d’un titre ARM en DEA (utilisateur admin)', async () => {
    const { demarcheId, titreId } = await demarcheCreate()

    const res = await graphQLCall(
      demarcheModifierQuery,
      {
        demarche: {
          id: demarcheId,
          titreId: titreId,
          typeId: 'pro'
        }
      },
      'admin',
      'dea-guyane-01'
    )

    expect(res.body.errors[0].message).toBe(
      'droits insuffisants pour modifier cette démarche'
    )
  })
})

const demarcheCreate = async () => {
  const titreId = 'titre-arm-id'
  await titreCreate(
    {
      id: 'titre-arm-id',
      nom: 'mon titre',
      domaineId: 'm',
      typeId: 'arm'
    },
    {},
    'super'
  )

  const resDemarchesCreer = await graphQLCall(
    queryImport('titres-demarches-creer'),
    {
      demarche: {
        titreId,
        typeId: 'oct'
      }
    },
    'super'
  )

  expect(resDemarchesCreer.body.errors).toBeUndefined()

  return {
    titreId,
    demarcheId: resDemarchesCreer.body.data.demarcheCreer.demarches[0].id
  }
}
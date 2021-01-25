import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils/index'
import { titreCreate } from '../src/database/queries/titres'
import { administrations } from './__mocks__/administrations'
import { titreEtapeUpsert } from '../src/database/queries/titres-etapes'

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

describe('demarcheCreer', () => {
  const demarcheCreerQuery = queryImport('titres-demarches-creer')

  test('ne peut pas créer une démarche (utilisateur anonyme)', async () => {
    const res = await graphQLCall(demarcheCreerQuery, {
      demarche: { titreId: '', typeId: '' }
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('ne peut pas créer une démarche (utilisateur editeur)', async () => {
    const res = await graphQLCall(
      demarcheCreerQuery,
      { demarche: { titreId: '', typeId: '' } },
      'editeur'
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('peut créer une démarche (utilisateur super)', async () => {
    const resTitreCreer = await graphQLCall(
      queryImport('titre-creer'),
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'super'
    )

    const titreId = resTitreCreer.body.data.titreCreer.id

    const res = await graphQLCall(
      demarcheCreerQuery,
      { demarche: { titreId, typeId: 'oct' } },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({ data: { demarcheCreer: {} } })
  })

  test('ne peut pas créer une démarche si titre inexistant (utilisateur admin)', async () => {
    const res = await graphQLCall(
      demarcheCreerQuery,
      { demarche: { titreId: 'unknown', typeId: 'oct' } },
      'admin'
    )

    expect(res.body.errors[0].message).toBe("le titre n'existe pas")
  })

  test('peut créer une démarche (utilisateur admin)', async () => {
    const resTitreCreer = await graphQLCall(
      queryImport('titre-creer'),
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'super'
    )

    const titreId = resTitreCreer.body.data.titreCreer.id

    const res = await graphQLCall(
      demarcheCreerQuery,
      { demarche: { titreId, typeId: 'oct' } },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({ data: { demarcheCreer: {} } })
  })

  test("ne peut pas créer une démarche sur un titre ARM échu (un utilisateur 'admin' PTMG)", async () => {
    await titreCreate(
      {
        id: 'titre-arm-echu',
        nom: 'mon titre échu',
        domaineId: 'm',
        typeId: 'arm',
        statutId: 'ech',
        administrationsGestionnaires: [administrations.ptmg]
      },
      {},
      'super'
    )

    const res = await graphQLCall(
      demarcheCreerQuery,
      { demarche: { titreId: 'titre-arm-echu', typeId: 'oct' } },
      'admin',
      administrations.ptmg
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
      demarche: { id: 'toto', titreId: '', typeId: '' }
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('ne peut pas modifier une démarche (utilisateur editeur)', async () => {
    const res = await graphQLCall(
      demarcheModifierQuery,
      { demarche: { id: 'toto', titreId: '', typeId: '' } },
      'editeur'
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('peut modifier une démarche (utilisateur super)', async () => {
    const { demarcheId, titreId } = await demarcheCreate()

    const res = await graphQLCall(
      demarcheModifierQuery,
      { demarche: { id: demarcheId, titreId, typeId: 'pro' } },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.demarcheModifier.demarches[0].type.id).toBe('pro')
  })

  test('ne peut pas modifier une démarche avec un titre inexistant (utilisateur super)', async () => {
    const res = await graphQLCall(
      demarcheModifierQuery,
      { demarche: { id: 'toto', titreId: '', typeId: '' } },
      'super'
    )

    expect(res.body.errors[0].message).toBe('le titre n’existe pas')
  })

  test('peut modifier une démarche d’un titre ARM en PTMG (utilisateur admin)', async () => {
    const { demarcheId, titreId } = await demarcheCreate()

    const res = await graphQLCall(
      demarcheModifierQuery,
      { demarche: { id: demarcheId, titreId: titreId, typeId: 'pro' } },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.demarcheModifier.demarches[0].type.id).toBe('pro')
  })

  test('ne peut pas modifier une démarche d’un titre ARM en DEA (utilisateur admin)', async () => {
    const { demarcheId, titreId } = await demarcheCreate()

    const res = await graphQLCall(
      demarcheModifierQuery,
      { demarche: { id: demarcheId, titreId: titreId, typeId: 'pro' } },
      'admin',
      administrations.dgtmGuyane
    )

    expect(res.body.errors[0].message).toBe('la démarche n’existe pas')
  })

  test('ne peut modifier une démarche inexistante', async () => {
    const { titreId } = await demarcheCreate()

    const res = await graphQLCall(
      demarcheModifierQuery,
      { demarche: { id: 'wrongId', titreId, typeId: 'pro' } },
      'super'
    )

    expect(res.body.errors).toHaveLength(1)
    expect(res.body.errors[0].message).toBe('la démarche n’existe pas')
  })

  test('ne peut pas modifier le type d’une démarche si elle a au moins une étape', async () => {
    const { demarcheId, titreId } = await demarcheCreate()

    await titreEtapeUpsert({
      id: `${demarcheId}-mno01`,
      typeId: 'mno',
      titreDemarcheId: demarcheId,
      statutId: 'acc',
      date: '2020-01-01'
    })

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

    expect(res.body.errors).toHaveLength(1)
    expect(res.body.errors[0].message).toBe(
      'impossible de modifier le type d’une démarche si celle-ci a déjà une ou plusieurs étapes'
    )
  })
})

describe('demarcheSupprimer', () => {
  const demarcheSupprimerQuery = queryImport('titres-demarches-supprimer')

  test('ne peut pas supprimer une démarche (utilisateur anonyme)', async () => {
    const res = await graphQLCall(demarcheSupprimerQuery, {
      id: 'toto'
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('ne peut pas supprimer une démarche (utilisateur admin)', async () => {
    const res = await graphQLCall(
      demarcheSupprimerQuery,
      { id: 'toto' },
      'admin'
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test('ne peut pas supprimer une démarche inexistante (utilisateur super)', async () => {
    const res = await graphQLCall(
      demarcheSupprimerQuery,
      { id: 'toto' },
      'super'
    )

    expect(res.body.errors[0].message).toBe("la démarche n'existe pas")
  })

  test('peut supprimer une démarche (utilisateur super)', async () => {
    const { demarcheId } = await demarcheCreate()
    const res = await graphQLCall(
      demarcheSupprimerQuery,
      { id: demarcheId },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.demarcheSupprimer.demarches.length).toBe(0)
  })
})

const demarcheCreate = async () => {
  const titreId = 'titre-arm-id'

  await titreCreate(
    {
      id: titreId,
      nom: 'mon titre',
      domaineId: 'm',
      typeId: 'arm',
      administrationsGestionnaires: [
        administrations.ptmg,
        administrations.dgtmGuyane
      ]
    },
    {},
    'super'
  )

  const resDemarchesCreer = await graphQLCall(
    queryImport('titres-demarches-creer'),
    { demarche: { titreId, typeId: 'oct' } },
    'super'
  )

  expect(resDemarchesCreer.body.errors).toBeUndefined()

  return {
    titreId: resDemarchesCreer.body.data.demarcheCreer.id,
    demarcheId: resDemarchesCreer.body.data.demarcheCreer.demarches[0].id
  }
}

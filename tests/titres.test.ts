import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import { administrations } from './__mocks__/administrations'
import { titreWithActiviteGrp } from './__mocks__/titres'
import { titreCreate } from '../src/database/queries/titres'

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

describe('titre', () => {
  const titreQuery = queryImport('titre')

  beforeEach(async () => {
    await titreCreate(titreWithActiviteGrp, {}, 'super')
  })

  test('peut modifier les activités GRP (utilisateur DEAL Guyane)', async () => {
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.dealGuyane
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: { activites: [{ modification: true }] }
    })
  })

  test('ne peut pas voir les activités GRP (utilisateur CACEM)', async () => {
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.cacem
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: { activites: [] }
    })
  })
})

describe('titreCreer', () => {
  const titreCreerQuery = queryImport('titre-creer')

  test('ne peut pas créer un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreCreerQuery, {
      titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
    })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("ne peut pas créer un titre (un utilisateur 'entreprise')", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'entreprise'
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("crée un titre (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { titreCreer: { id: 'm-ar-titre-0000', nom: 'titre' } }
    })
  })

  test("ne peut pas créer un titre AXM (un utilisateur 'admin' PTMG)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'axm', domaineId: 'm' } },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer ce type de titre/
    )
  })

  test("ne peut pas créer un titre ARM (un utilisateur 'admin' Déal Guyane)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'admin',
      administrations.dealGuyane
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer ce type de titre/
    )
  })

  test("crée un titre ARM (un utilisateur 'admin' PTMG)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { titreCreer: { id: 'm-ar-titre-0000', nom: 'titre' } }
    })
  })
})

describe('titreModifier', () => {
  const titreModifierQuery = queryImport('titre-modifier')

  const id = 'titre-arm-0000'

  beforeEach(async () => {
    await titreCreate(
      {
        id,
        nom: 'mon titre',
        domaineId: 'm',
        typeId: 'arm',
        administrationsGestionnaires: [
          administrations.ptmg,
          administrations.dealGuyane
        ]
      },
      {},
      'super'
    )
  })

  test('ne peut pas modifier un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreModifierQuery, {
      titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
    })

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test("ne peut pas modifier un titre (un utilisateur 'entreprise')", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'entreprise'
    )

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test("modifie un titre (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        titreModifier: {
          id: 'm-ar-mon-titre-modifie-0000',
          nom: 'mon titre modifié'
        }
      }
    })
  })

  test("modifie un titre ARM (un utilisateur 'admin' PTMG)", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'admin',
      administrations.ptmg
    )

    expect(res.body).toMatchObject({
      data: {
        titreModifier: {
          id: 'm-ar-mon-titre-modifie-0000',
          nom: 'mon titre modifié'
        }
      }
    })
  })

  test("ne peut pas modifier un titre ARM échu (un utilisateur 'admin' PTMG)", async () => {
    await titreCreate(
      {
        id: 'titre-arm-echu',
        nom: 'mon titre échu',
        domaineId: 'm',
        typeId: 'arm',
        statutId: 'ech',
        administrationsGestionnaires: [
          administrations.ptmg,
          administrations.dealGuyane
        ]
      },
      {},
      'super'
    )

    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: {
          id: 'titre-arm-echu',
          nom: 'mon titre échu modifié',
          typeId: 'arm',
          domaineId: 'm'
        }
      },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour modifier ce type de titre/
    )
  })

  test("ne peut pas modifier un titre ARM (un utilisateur 'admin' DGTM)", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'admin',
      administrations.dealGuyane
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour modifier ce type de titre/
    )
  })
})

describe('titreSupprimer', () => {
  const titreSupprimerQuery = queryImport('titre-supprimer')

  const id = 'titre-arm'

  beforeEach(async () => {
    await titreCreate(
      { id, nom: 'mon titre', domaineId: 'm', typeId: 'arm' },
      {},
      'super'
    )
  })

  test('ne peut pas supprimer un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id })
    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test('peut supprimer un titre (utilisateur super)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id }, 'super')

    expect(res.body).toMatchObject({ data: { titreSupprimer: { id } } })
  })

  test('ne peut pas supprimer un titre inexistant (utilisateur super)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id: 'toto' }, 'super')

    expect(res.body.errors[0].message).toMatch(/aucun titre avec cet id/)
  })
})

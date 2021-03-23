import { graphQLCall, queryImport } from './_utils/index'

import { administrationsUpsert } from '../src/database/queries/administrations'
import { dbManager } from './init-db-manager'

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

const administration = {
  id: 'admin-id',
  nom: "Nom de l'administration",
  typeId: 'ope',
  abreviation: 'abréviation'
}

describe('administrationModifier', () => {
  const administrationModifierQuery = queryImport('administration-modifier')
  beforeEach(async () => {
    await administrationsUpsert([administration])
  })

  test('ne peut pas modifier une administration (anonyme)', async () => {
    const res = await graphQLCall(administrationModifierQuery, {
      administration: Object.assign({}, administration, { adresse1: 'adresse' })
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("modifie une administration (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      administrationModifierQuery,
      {
        administration: Object.assign({}, administration, {
          adresse1: 'adresse'
        })
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: { administrationModifier: { adresse1: 'adresse' } }
    })
    expect(res.body.errors).toBeUndefined()
  })
})

describe('administrationTitreTypeModifier', () => {
  const administrationTitreTypeModifierQuery = queryImport(
    'administration-titre-type-modifier'
  )

  beforeEach(async () => {
    await administrationsUpsert([administration])
  })

  test("ne peut pas modifier les types de titres d'une administration (anonyme)", async () => {
    const res = await graphQLCall(administrationTitreTypeModifierQuery, {
      administrationTitreType: {
        administrationId: 'admin-id',
        titreTypeId: 'arm',
        gestionnaire: true,
        associee: false
      }
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("modifie les types de titre d'une administration (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      administrationTitreTypeModifierQuery,
      {
        administrationTitreType: {
          administrationId: 'admin-id',
          titreTypeId: 'arm',
          gestionnaire: true,
          associee: false
        }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        administrationTitreTypeModifier: {
          id: 'admin-id',
          titresTypes: [{ id: 'arm', gestionnaire: true, associee: false }]
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })
})

describe('administrationTitreTypeModifier', () => {
  const administrationTitreTypeModifierQuery = queryImport(
    'administration-titre-type-modifier'
  )

  beforeEach(async () => {
    await administrationsUpsert([administration])
  })

  test("ne peut pas modifier les types de titres d'une administration (anonyme)", async () => {
    const res = await graphQLCall(administrationTitreTypeModifierQuery, {
      administrationTitreType: {
        administrationId: 'admin-id',
        titreTypeId: 'arm',
        gestionnaire: true,
        associee: false
      }
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("modifie les types de titre d'une administration (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      administrationTitreTypeModifierQuery,
      {
        administrationTitreType: {
          administrationId: 'admin-id',
          titreTypeId: 'arm',
          gestionnaire: true,
          associee: false
        }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        administrationTitreTypeModifier: {
          id: 'admin-id',
          titresTypes: [{ id: 'arm', gestionnaire: true, associee: false }]
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })
})

describe('administrationTitreTypeTitreStatutModifier', () => {
  const administrationTitreTypeTitreStatutModifierQuery = queryImport(
    'administration-titre-type-titre-statut-modifier'
  )

  beforeEach(async () => {
    await administrationsUpsert([administration])
  })

  test("ne peut pas modifier les types de titre / statuts de titre d'une administration (anonyme)", async () => {
    const res = await graphQLCall(
      administrationTitreTypeTitreStatutModifierQuery,
      {
        administrationTitreTypeTitreStatut: {
          administrationId: 'admin-id',
          titreTypeId: 'arm',
          titreStatutId: 'val',
          titresModificationInterdit: true,
          demarchesModificationInterdit: true,
          etapesModificationInterdit: true
        }
      }
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("modifie les types de titre / statuts de titre d'une administration (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      administrationTitreTypeTitreStatutModifierQuery,
      {
        administrationTitreTypeTitreStatut: {
          administrationId: 'admin-id',
          titreTypeId: 'arm',
          titreStatutId: 'val',
          titresModificationInterdit: true,
          demarchesModificationInterdit: true,
          etapesModificationInterdit: true
        }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        administrationTitreTypeTitreStatutModifier: {
          id: 'admin-id',
          titresTypesTitresStatuts: [
            {
              titreType: { id: 'arm' },
              titreStatut: { id: 'val' },
              titresModificationInterdit: true,
              demarchesModificationInterdit: true,
              etapesModificationInterdit: true
            }
          ]
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })
})

describe('administrationTitreTypeEtapeTypeModifier', () => {
  const administrationTitreTypeEtapeTypeModifierQuery = queryImport(
    'administration-titre-type-etape-type-modifier'
  )

  beforeEach(async () => {
    await administrationsUpsert([administration])
  })

  test("ne peut pas modifier les types de titre / types d'étape d'une administration (anonyme)", async () => {
    const res = await graphQLCall(
      administrationTitreTypeEtapeTypeModifierQuery,
      {
        administrationTitreTypeEtapeType: {
          administrationId: 'admin-id',
          titreTypeId: 'arm',
          etapeTypeId: 'dex',
          lectureInterdit: true,
          modificationInterdit: true,
          creationInterdit: true
        }
      }
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  test("modifie les types de titre / types d'étape d'une administration (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      administrationTitreTypeEtapeTypeModifierQuery,
      {
        administrationTitreTypeEtapeType: {
          administrationId: 'admin-id',
          titreTypeId: 'arm',
          etapeTypeId: 'dex',
          lectureInterdit: true,
          modificationInterdit: true,
          creationInterdit: true
        }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        administrationTitreTypeEtapeTypeModifier: {
          id: 'admin-id',
          titresTypesEtapesTypes: [
            {
              titreType: { id: 'arm' },
              etapeType: { id: 'dex' },
              lectureInterdit: true,
              modificationInterdit: true,
              creationInterdit: true
            }
          ]
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })
})

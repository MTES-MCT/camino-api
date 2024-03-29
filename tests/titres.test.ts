import { dbManager } from './db-manager'
import { graphQLCall, queryImport } from './_utils/index'
import { administrations } from './__mocks__/administrations'
import {
  titreWithActiviteGrp,
  titrePublicLecture,
  titrePublicLectureFalse,
  titreEtapesPubliques,
  titreDemarchesPubliques,
  titreActivites
} from './__mocks__/titres'
import { titreCreate } from '../src/database/queries/titres'

console.info = jest.fn()
console.error = jest.fn()
const knex = dbManager.getKnex()
beforeEach(async () => {
  await dbManager.populateDb(knex)
})

afterEach(async () => {
  await dbManager.truncateDb(knex)
})

afterAll(async () => {
  await dbManager.closeKnex(knex)
})

describe('titre', () => {
  const titreQuery = queryImport('titre')

  test('peut voir un titre qui est en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titrePublicLecture, {})
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: { id: 'titre-id' }
    })
  })

  test('ne peut pas voir un titre qui n\'est pas en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titrePublicLectureFalse, {})
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({ titre: null })
  })

  test('ne peut pas voir que les démarches qui sont en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titreDemarchesPubliques, {})
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [{ id: 'titre-id-demarche-oct' }]
      }
    })

    expect(res.body.data.titre.demarches.length).toEqual(1)
  })

  test('ne peut pas voir les activités (utilisateur anonyme)', async () => {
    await titreCreate(titreActivites, {})
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id'
      }
    })

    expect(res.body.data.titre.activites.length).toEqual(0)
  })

  test('ne peut voir que les étapes qui sont en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titreEtapesPubliques, {})
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [
          {
            id: 'titre-id-demarche-id',
            etapes: [{ id: 'titre-id-demarche-id-dpu' }]
          }
        ]
      }
    })
    expect(res.body.data.titre.demarches[0].etapes.length).toEqual(1)
  })

  test('ne peut pas voir certaines étapes (utilisateur DGTM)', async () => {
    await titreCreate(titreEtapesPubliques, {})
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.dgtmGuyane.id
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [
          {
            id: 'titre-id-demarche-id',
            etapes: [
              { id: 'titre-id-demarche-id-aof' },
              { id: 'titre-id-demarche-id-edm' },
              { id: 'titre-id-demarche-id-ede' },
              { id: 'titre-id-demarche-id-pfd' },
              { id: 'titre-id-demarche-id-pfc' },
              { id: 'titre-id-demarche-id-vfd' },
              { id: 'titre-id-demarche-id-vfc' },
              { id: 'titre-id-demarche-id-dpu' }
            ]
          }
        ]
      }
    })
    expect(res.body.data.titre.demarches[0].etapes.length).toEqual(8)
  })

  test('ne peut pas voir certaines étapes (utilisateur ONF)', async () => {
    await titreCreate(titreEtapesPubliques, {})
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.onf.id
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.titre.demarches[0].etapes.length).toEqual(9)
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [
          {
            id: 'titre-id-demarche-id',
            etapes: [
              { id: 'titre-id-demarche-id-aof' },
              { id: 'titre-id-demarche-id-eof' },
              { id: 'titre-id-demarche-id-edm' },
              { id: 'titre-id-demarche-id-ede' },
              { id: 'titre-id-demarche-id-pfd' },
              { id: 'titre-id-demarche-id-pfc' },
              { id: 'titre-id-demarche-id-vfd' },
              { id: 'titre-id-demarche-id-vfc' },
              { id: 'titre-id-demarche-id-dpu' }
            ]
          }
        ]
      }
    })
  })

  test('peut modifier les activités GRP (utilisateur DEAL Guyane)', async () => {
    await titreCreate(titreWithActiviteGrp, {})
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.dgtmGuyane.id
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: { activites: [{ modification: true }] }
    })
  })

  test('ne peut pas voir les activités GRP (utilisateur CACEM)', async () => {
    await titreCreate(titreWithActiviteGrp, {})
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.cacem.id
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
      data: { titreCreer: { slug: 'm-ar-titre-0000', nom: 'titre' } }
    })
  })

  test("ne peut pas créer un titre AXM (un utilisateur 'admin' PTMG)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'axm', domaineId: 'm' } },
      'admin',
      administrations.ptmg.id
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("ne peut pas créer un titre ARM (un utilisateur 'admin' Déal Guyane)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'admin',
      administrations.dgtmGuyane.id
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("crée un titre ARM (un utilisateur 'admin' PTMG)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'admin',
      administrations.ptmg.id
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { titreCreer: { slug: 'm-ar-titre-0000', nom: 'titre' } }
    })
  })
})

describe('titreModifier', () => {
  const titreModifierQuery = queryImport('titre-modifier')

  let id = ''

  beforeEach(async () => {
    const titre = await titreCreate(
      {
        nom: 'mon titre',
        domaineId: 'm',
        typeId: 'arm',
        propsTitreEtapesIds: {},
        administrationsGestionnaires: [
          administrations.ptmg,
          administrations.dgtmGuyane
        ]
      },
      {}
    )
    id = titre.id
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
          slug: 'm-ar-mon-titre-modifie-0000',
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
      administrations.ptmg.id
    )

    expect(res.body).toMatchObject({
      data: {
        titreModifier: {
          id,
          slug: 'm-ar-mon-titre-modifie-0000',
          nom: 'mon titre modifié'
        }
      }
    })
  })

  test("ne peut pas modifier un titre ARM échu (un utilisateur 'admin' PTMG)", async () => {
    const titre = await titreCreate(
      {
        nom: 'mon titre échu',
        domaineId: 'm',
        typeId: 'arm',
        statutId: 'ech',
        propsTitreEtapesIds: {},
        administrationsGestionnaires: [
          administrations.ptmg,
          administrations.dgtmGuyane
        ]
      },
      {}
    )

    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: {
          id: titre.id,
          nom: 'mon titre échu modifié',
          typeId: 'arm',
          domaineId: 'm'
        }
      },
      'admin',
      administrations.ptmg.id
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("ne peut pas modifier un titre ARM (un utilisateur 'admin' DGTM)", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'admin',
      administrations.dgtmGuyane.id
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })
})

describe('titreSupprimer', () => {
  const titreSupprimerQuery = queryImport('titre-supprimer')

  let id = ''

  beforeEach(async () => {
    const titre = await titreCreate(
      {
        nom: 'mon titre',
        domaineId: 'm',
        typeId: 'arm',
        propsTitreEtapesIds: {}
      },
      {}
    )
    id = titre.id
  })

  test('ne peut pas supprimer un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id })
    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test('peut supprimer un titre (utilisateur super)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id }, 'super')

    expect(res.body).toMatchObject({
      data: { titreSupprimer: expect.any(String) }
    })
  })

  test('ne peut pas supprimer un titre inexistant (utilisateur super)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id: 'toto' }, 'super')

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })
})

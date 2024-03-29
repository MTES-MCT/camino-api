import { IPermissionId } from '../src/types'
import { dbManager } from './db-manager'
import { graphQLCall, queryImport } from './_utils/index'
import { administrations } from './__mocks__/administrations'
import { titreDemarcheCreate } from '../src/database/queries/titres-demarches'
import { titreCreate } from '../src/database/queries/titres'
import { titreEtapeCreate } from '../src/database/queries/titres-etapes'
import { titreEtapePropsIds } from '../src/business/utils/titre-etape-heritage-props-find'
import Titres from '../src/database/models/titres'
import { userSuper } from '../src/database/user-super'

jest.mock('../src/tools/dir-create', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../src/tools/file-stream-create', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../src/tools/file-delete', () => ({
  __esModule: true,
  default: jest.fn()
}))

console.info = jest.fn()
console.error = jest.fn()
const knex = dbManager.getKnex()
beforeAll(async () => {
  await dbManager.populateDb(knex)
})

beforeEach(async () => {
  await Titres.query().delete()
})

afterAll(async () => {
  await dbManager.truncateDb(knex)
  await dbManager.closeKnex(knex)
})

async function etapeCreate() {
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
  const titreDemarche = await titreDemarcheCreate({
    titreId: titre.id,
    typeId: 'oct'
  })

  const titreEtape = await titreEtapeCreate(
    {
      typeId: 'mfr',
      statutId: 'fai',
      titreDemarcheId: titreDemarche.id,
      date: '2018-01-01'
    },
    userSuper,
    titre.id
  )

  return { titreDemarcheId: titreDemarche.id, titreEtapeId: titreEtape.id }
}

describe('etapeModifier', () => {
  const etapeModifierQuery = queryImport('titre-etape-modifier')

  test.each([undefined, 'editeur' as IPermissionId])(
    'ne peut pas modifier une étape (utilisateur %s)',
    async (permissionId: IPermissionId | undefined) => {
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

      expect(res.body.errors[0].message).toBe("l'étape n'existe pas")
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

    expect(res.body.errors[0].message).toBe("l'étape n'existe pas")
  })

  test('peut modifier une étape mfr avec un statut aco (utilisateur super)', async () => {
    const { titreDemarcheId, titreEtapeId } = await etapeCreate()
    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: titreEtapeId,
          typeId: 'mfr',
          statutId: 'aco',
          titreDemarcheId,
          date: '2018-01-01',
          heritageProps: titreEtapePropsIds.reduce(
            (acc, prop) => {
              acc[prop] = { actif: false }

              return acc
            },
            {} as {
              [key: string]: { actif: boolean }
            }
          ),
          heritageContenu: {
            arm: {
              mecanise: { actif: false },
              franchissements: { actif: false }
            }
          },
          contenu: {
            arm: { mecanise: true, franchissements: 3 }
          }
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
  })

  test('peut modifier une étape mia avec un statut fai (utilisateur super)', async () => {
    const { titreDemarcheId, titreEtapeId } = await etapeCreate()

    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: titreEtapeId,
          typeId: 'mia',
          statutId: 'fai',
          titreDemarcheId,
          date: '2018-01-01'
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
  })

  test('ne peut pas modifier une étape mia avec un statut fav (utilisateur admin)', async () => {
    const { titreDemarcheId, titreEtapeId } = await etapeCreate()

    const res = await graphQLCall(
      etapeModifierQuery,
      {
        etape: {
          id: titreEtapeId,
          typeId: 'mia',
          statutId: 'fav',
          titreDemarcheId,
          date: '2018-01-01'
        }
      },
      'admin',
      administrations.ptmg.id
    )

    expect(res.body.errors[0].message).toBe(
      'statut de l\'étape "fav" invalide pour une type d\'étape mia pour une démarche de type octroi'
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
          date: '2018-01-01'
        }
      },
      'admin',
      administrations.ptmg.id
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
          date: '2018-01-01',
          heritageContenu: {
            deal: { motifs: { actif: false }, agent: { actif: false } }
          },
          contenu: { deal: { motifs: 'motif', agent: 'agent' } }
        }
      },
      'admin',
      administrations.ptmg.id
    )

    expect(res.body.errors[0].message).toBe(
      'statut de l\'étape "fai" invalide pour une type d\'étape ede pour une démarche de type octroi'
    )
  })
})

describe('etapeSupprimer', () => {
  const etapeSupprimerQuery = queryImport('titre-etape-supprimer')

  test.each([undefined, 'admin' as IPermissionId])(
    'ne peut pas supprimer une étape (utilisateur %s)',
    async (permissionId: IPermissionId | undefined) => {
      const res = await graphQLCall(
        etapeSupprimerQuery,
        { id: '' },
        permissionId
      )

      expect(res.body.errors[0].message).toBe("l'étape n'existe pas")
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

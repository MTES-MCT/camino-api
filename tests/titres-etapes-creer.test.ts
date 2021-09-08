import { dbManager } from './db-manager'
import { graphQLCall, queryImport } from './_utils/index'
import { titreDemarcheCreate } from '../src/database/queries/titres-demarches'
import { titreCreate } from '../src/database/queries/titres'
import { IPermissionId } from '../src/types'
import { administrations } from './__mocks__/administrations'
import { titreEtapePropsIds } from '../src/business/utils/titre-etape-heritage-props-find'
import Titres from '../src/database/models/titres'
import TitresTypesDemarchesTypesEtapesTypes from '../src/database/models/titres-types--demarches-types-etapes-types'
import { documentCreate } from '../src/database/queries/documents'

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

beforeAll(async () => {
  await dbManager.populateDb()

  const mfrTDE = await TitresTypesDemarchesTypesEtapesTypes.query()
    .where('titreTypeId', 'arm')
    .andWhere('demarcheTypeId', 'oct')
    .andWhere('etapeTypeId', 'mfr')
    .first()
  mfrTDE!
    .sections!.find(s => s.id === 'arm')!
    .elements!.find(e => e.id === 'franchissements')!.optionnel = false
  await TitresTypesDemarchesTypesEtapesTypes.query().upsertGraph(mfrTDE)
})

beforeEach(async () => {
  await Titres.query().delete()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

const demarcheCreate = async () => {
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
    {}
  )

  await titreDemarcheCreate({
    id: 'demarche-test-id',
    titreId,
    typeId: 'oct'
  })

  return 'demarche-test-id'
}

describe('etapeCreer', () => {
  const etapeCreerQuery = queryImport('titre-etape-creer')

  test.each([undefined, 'editeur' as IPermissionId])(
    'ne peut pas créer une étape (utilisateur %s)',
    async (permissionId: IPermissionId | undefined) => {
      const res = await graphQLCall(
        etapeCreerQuery,
        { etape: { typeId: '', statutId: '', titreDemarcheId: '', date: '' } },
        permissionId
      )

      expect(res.body.errors[0].message).toBe("la démarche n'existe pas")
    }
  )

  test('ne peut pas créer une étape sur une démarche inexistante (utilisateur super)', async () => {
    const res = await graphQLCall(
      etapeCreerQuery,
      { etape: { typeId: '', statutId: '', titreDemarcheId: '', date: '' } },
      'admin'
    )

    expect(res.body.errors[0].message).toBe("la démarche n'existe pas")
  })

  test('peut créer une étape mfr avec un statut dep (utilisateur super)', async () => {
    const titreDemarcheId = await demarcheCreate()

    await documentCreate({
      id: 'dep',
      typeId: 'dep',
      date: '2020-01-01',
      uri: 'https://camino.beta.gouv.fr'
    })
    await documentCreate({
      id: 'doe',
      typeId: 'doe',
      date: '2020-01-01',
      uri: 'https://camino.beta.gouv.fr'
    })

    const res = await graphQLCall(
      etapeCreerQuery,
      {
        etape: {
          typeId: 'mfr',
          statutId: 'dep',
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
          ),
          heritageContenu: {
            arm: {
              mecanise: { actif: true },
              franchissements: { actif: true }
            },
            demande: { date: { actif: false } }
          },
          contenu: { arm: { mecanise: true, franchissements: 3 } },
          substances: [{ id: 'auru' }],
          documentIds: ['dep', 'doe'],
          points: [
            {
              groupe: 1,
              contour: 1,
              point: 1,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 1, y: 2 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 2,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 2, y: 2 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 3,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 2, y: 1 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 4,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 1, y: 1 } }
              ]
            }
          ]
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
  })

  test('ne peut pas créer une étape mia avec un statut fav (utilisateur admin)', async () => {
    const titreDemarcheId = await demarcheCreate()

    const res = await graphQLCall(
      etapeCreerQuery,
      { etape: { typeId: 'mia', statutId: 'fav', titreDemarcheId, date: '' } },
      'admin',
      administrations.ptmg.id
    )

    expect(res.body.errors[0].message).toBe(
      'statut de l\'étape "fav" invalide pour une type d\'étape mia pour une démarche de type octroi'
    )
  })

  test('peut créer une étape mia avec un statut fai (utilisateur super)', async () => {
    const titreDemarcheId = await demarcheCreate()

    const res = await graphQLCall(
      etapeCreerQuery,
      { etape: { typeId: 'mia', statutId: 'fai', titreDemarcheId, date: '' } },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
  })

  test('peut créer une étape MEN sur un titre ARM en tant que PTMG (utilisateur admin)', async () => {
    const titreDemarcheId = await demarcheCreate()
    const res = await graphQLCall(
      etapeCreerQuery,
      { etape: { typeId: 'men', statutId: 'fai', titreDemarcheId, date: '' } },
      'admin',
      administrations.ptmg.id
    )

    expect(res.body.errors).toBeUndefined()
  })

  test('ne peut pas créer une étape EDE sur un titre ARM en tant que PTMG (utilisateur admin)', async () => {
    const titreDemarcheId = await demarcheCreate()

    const res = await graphQLCall(
      etapeCreerQuery,
      {
        etape: {
          typeId: 'ede',
          statutId: 'fai',
          titreDemarcheId,
          date: '',
          heritageContenu: {
            deal: { motifs: { actif: false }, agent: { actif: false } }
          },
          contenu: {
            deal: { motifs: 'motif', agent: 'agent' }
          }
        }
      },
      'admin',
      administrations.ptmg.id
    )

    expect(res.body.errors[0].message).toBe(
      'statut de l\'étape "fai" invalide pour une type d\'étape ede pour une démarche de type octroi'
    )
  })

  test('ne peut pas créer une étape mfr avec un statut dep avec un champ obligatoire manquant (utilisateur super)', async () => {
    const titreDemarcheId = await demarcheCreate()
    const res = await graphQLCall(
      etapeCreerQuery,
      {
        etape: {
          typeId: 'mfr',
          statutId: 'dep',
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
          ),
          heritageContenu: {
            arm: {
              mecanise: { actif: true },
              franchissements: { actif: true }
            },
            demande: { date: { actif: false } }
          },
          substances: [{ id: 'auru' }],
          points: [
            {
              groupe: 1,
              contour: 1,
              point: 1,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 1, y: 2 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 2,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 2, y: 2 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 3,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 2, y: 1 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 4,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 1, y: 1 } }
              ]
            }
          ]
        }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe(
      'l’élément "Franchissements de cours d\'eau" de la section "Caractéristiques ARM" est obligatoire'
    )
  })

  test('peut créer une étape mfr avec un statut aco avec un champ obligatoire manquant (utilisateur super)', async () => {
    const titreDemarcheId = await demarcheCreate()
    const res = await graphQLCall(
      etapeCreerQuery,
      {
        etape: {
          typeId: 'mfr',
          statutId: 'aco',
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
          ),
          heritageContenu: {
            arm: {
              mecanise: { actif: true },
              franchissements: { actif: true }
            },
            demande: { date: { actif: false } }
          }
        }
      },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
  })
})

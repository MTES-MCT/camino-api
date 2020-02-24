require('dotenv/config')
const knexConfig = require('../../config/knex')
const knexDbManager = require('knex-db-manager')

const { default: knex } = require('../index')

const Titres = require('./titres')

let dbManager

beforeAll(async () => {
  dbManager = knexDbManager.databaseManagerFactory({
    knex: knexConfig.default,
    dbManager: {
      superUser: knexConfig.default.connection.user,
      superPassword: knexConfig.default.connection.password
    }
  })

  await dbManager.createDbOwnerIfNotExist()
})

beforeEach(async () => {
  await dbManager.truncateDb()
  await knex('domaines').insert({ id: 'd', nom: 'domaine', ordre: 1 })
  await knex('titres_types_types').insert({
    id: 'xx',
    nom: 'type-type',
    ordre: 1
  })
  await knex('titres_types').insert({ id: 'dxx', typeId: 'xx', domaineId: 'd' })
  await knex('titres_statuts').insert({
    id: 'kay',
    nom: 'okay',
    couleur: 'meh'
  })
})

describe('titres', () => {
  test("un titre n'est pas créé", () =>
    expect(Titres.titreCreate({})).rejects.toThrowError(
      ['id', 'nom', 'domaineId', 'typeId']
        .map(k => `${k}: is a required property`)
        .join(', ')
    ))

  test('un titre est créé', () =>
    expect(
      Titres.titreCreate({
        id: 'test',
        nom: 'test',
        domaineId: 'd',
        typeId: 'dxx',
        statutId: 'kay'
      })
    ).resolves.toMatchObject({
      id: 'test',
      nom: 'test',
      domaineId: 'd',
      typeId: 'dxx',
      statutId: 'kay'
    }))
})

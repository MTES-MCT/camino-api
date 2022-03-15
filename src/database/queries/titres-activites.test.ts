import { titresActivitesGet } from './titres-activites'
import TitresActivites from '../models/titres-activites'
import { dbManager } from '../../../tests/db-manager'
import { IUtilisateur } from '../../types'
import { idGenerate } from '../models/_format/id-create'
import Titres from '../models/titres'
import AdministrationsTitresTypes from '../models/administrations-titres-types'
console.info = jest.fn()
console.error = jest.fn()
const knex = dbManager.getKnex()
beforeAll(async () => {
  await dbManager.populateDb(knex)
})

afterAll(async () => {
  await dbManager.truncateDb(knex)
  await dbManager.closeKnex(knex)
})
describe('teste les requêtes sur les activités', () => {
  test('vérifie que le filtrage fonctionne pour les administrations', async () => {
    await TitresActivites.query().delete()

    const titreId = idGenerate()

    await Titres.query().insert({
      id: titreId,
      nom: idGenerate(),
      statutId: 'val',
      domaineId: 'm',
      typeId: 'arm'
    })

    const titreActiviteId = 'titreActiviteId'
    await TitresActivites.query().insertGraph({
      id: titreActiviteId,
      typeId: 'grx',
      titreId,
      date: '',
      statutId: 'dep',
      periodeId: 1,
      annee: 2000
    })

    await AdministrationsTitresTypes.query().delete()
    await AdministrationsTitresTypes.query().insert({
      administrationId: 'min-mtes-dgaln-01',
      titreTypeId: 'arm',
      gestionnaire: true
    })

    const adminDGALN: IUtilisateur = {
      permission: { id: 'admin', nom: 'admin', ordre: 1 },
      id: 'utilisateurId',
      permissionId: 'admin',
      nom: 'utilisateurNom',
      email: 'utilisateurEmail',
      motDePasse: 'utilisateurMotdepasse',
      administrations: [
        { id: 'min-mtes-dgaln-01', typeId: 'min', nom: 'dgaln' }
      ]
    }

    const actual = await titresActivitesGet(
      {},
      { fields: { id: {} } },
      adminDGALN
    )

    expect(actual).toHaveLength(1)
    expect(actual[0].id).toEqual(titreActiviteId)
  })
})

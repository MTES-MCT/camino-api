import { titresActivitesGet } from './titres-activites'
import TitresActivites from '../models/titres-activites'
import { dbManager } from '../../../tests/db-manager'
import { IUtilisateur } from '../../types'
import { idGenerate } from '../models/_format/id-create'
import Titres from '../models/titres'
import AdministrationsTitresTypes from '../models/administrations-titres-types'
console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
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

    await TitresActivites.query().insertGraph({
      id: 'titreActiviteId',
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

    const adminDGALN = {
      id: 'utilisateurId',
      permissionId: 'admin',
      nom: 'utilisateurNom',
      email: 'utilisateurEmail',
      motDePasse: 'utilisateurMotdepasse',
      administrations: [{ id: 'min-mtes-dgaln-01' }]
    } as IUtilisateur

    await titresActivitesGet(
      { titresSubstances: 'Or' },
      { fields: { id: {} } },
      adminDGALN
    )
  })
})

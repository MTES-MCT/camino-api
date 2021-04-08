import { dbManager } from '../../../../tests/init-db-manager'
import { IAdministration, IUtilisateur } from '../../../types'
import Administrations from '../../models/administrations'
import Permissions from '../../models/permissions'
import Utilisateurs from '../../models/utilisateurs'
import { utilisateursGet } from '../utilisateurs'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

const mockAdministration = {
  id: 'administrationId',
  typeId: 'ope',
  nom: 'administrationNom'
} as IAdministration

const mockUser = {
  id: 'utilisateurId',
  permissionId: 'editeur',
  permission: { id: 'editeur', nom: 'Éditeur', ordre: 3 },
  nom: 'utilisateurNom',
  email: 'utilisateurEmail',
  motDePasse: 'utilisateurMotdepasse',
  administrations: [mockAdministration]
} as IUtilisateur

describe('utilisateursQueryModify', () => {
  beforeEach(async () => {
    await Utilisateurs.query().delete()
    await Administrations.query().delete()
    await Permissions.query().delete()
  })

  test.each`
    permissionId    | voit
    ${'super'}      | ${true}
    ${'admin'}      | ${true}
    ${'editeur'}    | ${true}
    ${'lecteur'}    | ${true}
    ${'entreprise'} | ${true}
    ${'defaut'}     | ${false}
  `(
    "Vérifie l'écriture de la requête sur un utilisateur",
    async ({ permissionId, voit }) => {
      await Utilisateurs.query().insertGraph(mockUser)

      const user = {
        id: 'userId',
        permissionId,
        permission: { id: permissionId, nom: permissionId, ordre: 1 },
        administrations: [mockAdministration]
      } as IUtilisateur
      const utilisateurs = await utilisateursGet(
        { noms: mockUser.nom },
        {},
        user
      )

      expect(utilisateurs).toMatchObject(voit ? [mockUser] : [])
    }
  )
})

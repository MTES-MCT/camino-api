import { IEntreprise, IUtilisateur } from '../../../types'

import { dbManager } from '../../../../tests/db-manager'

import Entreprises from '../../models/entreprises'
import Utilisateurs from '../../models/utilisateurs'
import { entreprisesQueryModify } from './entreprises'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

describe('entreprisesQueryModify', () => {
  test.each`
    permission      | modification
    ${'super'}      | ${true}
    ${'admin'}      | ${true}
    ${'editeur'}    | ${true}
    ${'lecteur'}    | ${false}
    ${'entreprise'} | ${true}
    ${'defaut'}     | ${false}
  `(
    "Vérifie l'écriture de la requête sur le droit 'modification' d'une entreprise",
    async ({ permission, modification }) => {
      await Utilisateurs.query().delete()
      await Entreprises.query().delete()

      const mockEntreprise1 = {
        id: 'monEntrepriseId',
        nom: 'monEntrepriseNom'
      } as IEntreprise

      const mockUser = {
        id: '109f95',
        permissionId: permission,
        entreprises: [mockEntreprise1],
        email: 'email',
        motDePasse: 'motdepasse'
      } as IUtilisateur

      await Utilisateurs.query().insertGraph(mockUser)

      const q = entreprisesQueryModify(Entreprises.query(), {}, mockUser)

      expect(await q.first()).toMatchObject(
        Object.assign(mockEntreprise1, { modification })
      )
    }
  )
})

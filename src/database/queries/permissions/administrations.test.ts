import { dbManager } from '../../../../tests/db-manager'
import { IUtilisateur, IAdministration } from '../../../types'

import AdministrationsTitresTypes from '../../models/administrations-titres-types'
import Titres from '../../models/titres'
import Utilisateurs from '../../models/utilisateurs'
import Administrations from '../../models/administrations'
import { administrationsTitresQuery, administrationsQueryModify } from './administrations'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

// describe('administrationsTitresQuery', () => {
//   test.each`
//     gestionnaire | associee | visible
//     ${false}     | ${false} | ${false}
//     ${true}      | ${false} | ${true}
//     ${false}     | ${true}  | ${true}
//     ${true}      | ${true}  | ${true}
//   `(
//     "Vérifie l'écriture de la requête sur les titres dont une administration a des droits sur le type",
//     async ({ gestionnaire, associee, visible }) => {
//       await Titres.query().delete()
//       await AdministrationsTitresTypes.query().delete()

//       const mockTitre = {
//         id: 'monTitreId',
//         nom: 'monTitreNom',
//         domaineId: 'm',
//         statutId: 'ech',
//         typeId: 'arm'
//       }

//       await Titres.query().insertGraph(mockTitre)

//       await AdministrationsTitresTypes.query().insertGraph({
//         administrationId: 'ope-brgm-01',
//         titreTypeId: mockTitre.typeId,
//         gestionnaire,
//         associee
//       })

//       const administrationQuery = administrationsTitresQuery(
//         ['ope-brgm-01'],
//         'titres',
//         {
//           isGestionnaire: true,
//           isAssociee: true
//         }
//       ).whereNotNull('a_tt.administrationId')

//       const q = Titres.query()
//         .where('id', 'monTitreId')
//         .andWhereRaw('exists(?)', [administrationQuery])

//       const titreRes = await q.first()
//       if (visible) {
//         expect(titreRes).toMatchObject(mockTitre)
//       } else {
//         expect(titreRes).toBeUndefined()
//       }
//     }
//   )
// })

describe('administrationsQueryModify', () => {
  test.each`
    permission | emailsModification
    ${'super'} | ${true}
    ${'admin'} | ${false}
    ${'editeur'} | ${false}
    ${'lecteur'} | ${false}
  `(
    "vérifie que les membres d'une administration n'ont pas le membre emailsModification 'true' sur celle-ci",
    async ({ permission, emailsModification }) => {
      await Utilisateurs.query().delete()
      await Administrations.query().delete()

      const mockAdministration = {
        id: 'dre-nouvelle-aquitaine-01',
        typeId: 'dre',
        nom: 'administration',
      }

      const mockUser = {
        id: '109f95',
        permissionId: permission,
        administrations: [mockAdministration],
        email: 'email',
        motDePasse: 'motdepasse'
      } as IUtilisateur

      await Utilisateurs.query().insertGraph(mockUser)

      const q = administrationsQueryModify(Administrations.query(), mockUser)

      expect(await q.first()).toMatchObject(
        emailsModification ? Object.assign(mockAdministration, { emailsModification }) : mockAdministration
      )
    }
  )
})

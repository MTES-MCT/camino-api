import { dbManager } from '../../../../tests/db-manager'
import { IUtilisateur, IAdministration } from '../../../types'

import AdministrationsTitresTypes from '../../models/administrations-titres-types'
import Titres from '../../models/titres'
import Utilisateurs from '../../models/utilisateurs'
import Administrations from '../../models/administrations'
import { administrationsTitresQuery, administrationsQueryModify } from './administrations'
import { idGenerate } from '../../models/_format/id-create'
import options from "../_options"

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
    "pour une préfecture, emailsModification est 'true' pour un utilisateur super, 'false' pour tous ses membres",
    async ({ permission, emailsModification }) => {
      const mockAdministration = {
        id: 'pre-01053-01',
        nom: 'Préfecture - Vaucluse',
        typeId: 'pre',
      }

      const mockUser = {
        id: idGenerate(),
        permissionId: permission,
        administrations: [mockAdministration],
        email: 'email' + idGenerate(),
        motDePasse: 'motdepasse'
      } as IUtilisateur

      await Utilisateurs.query().insertGraph(mockUser, options.utilisateurs.update)

      const q = administrationsQueryModify(Administrations.query().where('id', mockAdministration.id), mockUser)
      const res = await q.first() as IAdministration
      if (!emailsModification) {
        expect(res.emailsModification).toBeFalsy()
      } else {
        expect(res.emailsModification).toBeTruthy()
      }
    }
  )

  // test.each`
  //   permission | emailsLecture
  //   ${'super'} | ${true}
  //   ${'admin'} | ${true}
  //   ${'editeur'} | ${true}
  //   ${'lecteur'} | ${true}
  // `(
  //   "pour une préfecture, emailsLecture est 'true' pour tous ses membres et les utilisateurs super",
  //   async ({ permission, emailsLecture }) => {
  //     await Utilisateurs.query().delete()
  //     await Administrations.query().delete()

  //     const mockAdministration = {
  //       id: 'pre-01053-01',
  //       nom: 'Préfecture - Vaucluse',
  //       typeId: 'pre',
  //     }

  //     const mockUser = {
  //       id: '109f95',
  //       permissionId: permission,
  //       administrations: [mockAdministration],
  //       email: 'email',
  //       motDePasse: 'motdepasse'
  //     } as IUtilisateur

  //     await Utilisateurs.query().insertGraph(mockUser)

  //     const q = administrationsQueryModify(Administrations.query(), mockUser)

  //     expect(await q.first()).toMatchObject(
  //       Object.assign(mockAdministration, { emailsLecture })
  //     )
  //   }
  // )

  test.each`
    permission | emailsModification
    ${'super'} | ${true}
    ${'admin'} | ${true}
  `(
    "pour une DREAL/DEAL, emailsModification est 'true' pour ses membres admins et éditeurs, pour les utilisateurs supers, 'false' pour ses autres membres",
    async ({ permission, emailsModification }) => {
      await Utilisateurs.query().delete()

      const mockDreal = {
        id: 'dre-ile-de-france-01',
        typeId: 'dre',
        nom: "Direction régionale et interdépartementale de l'environnement et de l'énergie (DRIEE) - Île-de-France",
        regionId: '11'
      }

      const mockUser = {
        id: idGenerate(),
        permissionId: permission,
        administrations: [mockDreal],
        email: 'email' + idGenerate(),
        motDePasse: 'motdepasse'
      } as IUtilisateur

      await Utilisateurs.query().insertGraph(mockUser, options.utilisateurs.update)

      const q = administrationsQueryModify(Administrations.query(), mockUser)

      expect(await q.findById('dre-ile-de-france-01')).toMatchObject(
        emailsModification ? Object.assign(mockDreal, { emailsModification }) : mockDreal
      )
    }
  )
})

import { dbManager } from '../../../../tests/db-manager'
import { IUtilisateur, IAdministration } from '../../../types'

import AdministrationsTitresTypes from '../../models/administrations-titres-types'
import Titres from '../../models/titres'
import Utilisateurs from '../../models/utilisateurs'
import AdministrationsActivitesTypesEmails from '../../models/administrations-activites-types-emails'
import Administrations from '../../models/administrations'
import {
  administrationsTitresQuery,
  administrationsQueryModify
} from './administrations'
import { idGenerate } from '../../models/_format/id-create'
import options from '../_options'

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

describe('administrationsTitresQuery', () => {
  test.each`
    gestionnaire | associee | visible
    ${false}     | ${false} | ${false}
    ${true}      | ${false} | ${true}
    ${false}     | ${true}  | ${true}
    ${true}      | ${true}  | ${true}
  `(
    "Vérifie l'écriture de la requête sur les titres dont une administration a des droits sur le type",
    async ({ gestionnaire, associee, visible }) => {
      await Titres.query().delete()
      await AdministrationsTitresTypes.query().delete()

      const mockTitre = {
        id: 'monTitreId',
        nom: 'monTitreNom',
        domaineId: 'm',
        statutId: 'ech',
        typeId: 'arm'
      }

      await Titres.query().insertGraph(mockTitre)

      await AdministrationsTitresTypes.query().insertGraph({
        administrationId: 'ope-brgm-01',
        titreTypeId: mockTitre.typeId,
        gestionnaire,
        associee
      })

      const administrationQuery = administrationsTitresQuery(
        ['ope-brgm-01'],
        'titres',
        {
          isGestionnaire: true,
          isAssociee: true
        }
      ).whereNotNull('a_tt.administrationId')

      const q = Titres.query()
        .where('id', 'monTitreId')
        .andWhereRaw('exists(?)', [administrationQuery])

      const titreRes = await q.first()
      if (visible) {
        expect(titreRes).toMatchObject(mockTitre)
      } else {
        expect(titreRes).toBeUndefined()
      }
    }
  )
})

describe('administrationsQueryModify', () => {
  test.each`
    permission   | emailsModification
    ${'super'}   | ${true}
    ${'admin'}   | ${false}
    ${'editeur'} | ${false}
    ${'lecteur'} | ${false}
  `(
    "pour une préfecture, emailsModification est 'true' pour un utilisateur super, 'false' pour tous ses membres",
    async ({ permission, emailsModification }) => {
      const mockAdministration = {
        id: 'pre-01053-01',
        nom: 'Préfecture - Vaucluse',
        typeId: 'pre'
      }

      const mockUser = {
        id: idGenerate(),
        permissionId: permission,
        administrations: [mockAdministration],
        email: 'email' + idGenerate(),
        motDePasse: 'motdepasse'
      } as IUtilisateur

      await Utilisateurs.query().insertGraph(
        mockUser,
        options.utilisateurs.update
      )

      const q = administrationsQueryModify(
        Administrations.query().where('id', mockAdministration.id),
        mockUser
      )
      const res = (await q.first()) as IAdministration
      if (!emailsModification) {
        expect(res.emailsModification).toBeFalsy()
      } else {
        expect(res.emailsModification).toBeTruthy()
      }
    }
  )

  test.each`
    permission   | emailsModification
    ${'super'}   | ${true}
    ${'admin'}   | ${true}
    ${'editeur'} | ${true}
    ${'lecteur'} | ${false}
    ${'defaut'}  | ${false}
  `(
    "pour une DREAL/DEAL, emailsModification est 'true' pour ses membres admins et éditeurs, pour les utilisateurs supers, 'false' pour ses autres membres",
    async ({ permission, emailsModification }) => {
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

      await Utilisateurs.query().insertGraph(
        mockUser,
        options.utilisateurs.update
      )

      const q = administrationsQueryModify(Administrations.query(), mockUser)
      const res = (await q.findById(mockDreal.id)) as IAdministration
      if (!emailsModification) {
        expect(res.emailsModification).toBeFalsy()
      } else {
        expect(res.emailsModification).toBeTruthy()
      }
    }
  )

  test.each`
    permission   | emailsModification
    ${'admin'}   | ${true}
    ${'editeur'} | ${true}
    ${'lecteur'} | ${false}
    ${'defaut'}  | ${false}
  `(
    "pour un membre de ministère, emailsModification est 'true' pour ses membres admins et éditeurs, 'false' pour ses lecteurs",
    async ({ permission, emailsModification }) => {
      const mockMin = {
        id: 'min-dajb-01',
        typeId: 'min',
        nom: "Ministère de l'Economie, des Finances et de la Relance"
      }

      const mockUser = {
        id: idGenerate(),
        permissionId: permission,
        administrations: [mockMin],
        email: 'email' + idGenerate(),
        motDePasse: 'motdepasse'
      } as IUtilisateur

      await Utilisateurs.query().insertGraph(
        mockUser,
        options.utilisateurs.update
      )

      const q = administrationsQueryModify(
        Administrations.query().where('id', mockMin.id),
        mockUser
      )
      const res = (await q.findById(mockMin.id)) as IAdministration
      if (!emailsModification) {
        expect(res.emailsModification).toBeFalsy()
      } else {
        expect(res.emailsModification).toBeTruthy()
      }
    }
  )

  test.each`
    permission   | emailsLecture
    ${'super'}   | ${true}
    ${'admin'}   | ${true}
    ${'editeur'} | ${true}
    ${'lecteur'} | ${true}
    ${'defaut'}  | ${false}
  `(
    "pour une préfecture, emailsLecture est 'true' pour un utilisateur super et pour tous ses membres",
    async ({ permission, emailsLecture }) => {
      const mockAdministration = {
        id: 'pre-01053-01',
        nom: 'Préfecture - Vaucluse',
        typeId: 'pre'
      }

      const email = `${idGenerate()}@bar.com`
      await AdministrationsActivitesTypesEmails.query().delete()
      await AdministrationsActivitesTypesEmails.query().insert({
        administrationId: mockAdministration.id,
        email,
        activiteTypeId: 'grx'
      })

      const mockUser = {
        id: idGenerate(),
        permissionId: permission,
        administrations: [mockAdministration],
        email: 'email' + idGenerate(),
        motDePasse: 'motdepasse'
      } as IUtilisateur

      await Utilisateurs.query().insertGraph(
        mockUser,
        options.utilisateurs.update
      )

      const q = administrationsQueryModify(
        Administrations.query().where('id', mockAdministration.id),
        mockUser
      )
      const res = (await q
        .withGraphFetched({ activitesTypesEmails: {} })
        .first()) as IAdministration
      if (!emailsLecture) {
        expect(res.emailsLecture).toBeFalsy()
        expect(res.activitesTypesEmails).toHaveLength(0)
      } else {
        expect(res.emailsLecture).toBeTruthy()
        expect(res.activitesTypesEmails?.length).toBeTruthy()
        expect(res.activitesTypesEmails![0].email).toBe(email)
      }
    }
  )

  test('vérifie que le bon nombre de couple types activites + email est retourné par une requête', async () => {
    const mockAdministration = {
      id: 'pre-01053-01',
      nom: 'Préfecture - Vaucluse',
      typeId: 'pre'
    }

    const email = `${idGenerate()}@bar.com`
    await AdministrationsActivitesTypesEmails.query().delete()
    await AdministrationsActivitesTypesEmails.query().insert({
      administrationId: mockAdministration.id,
      email,
      activiteTypeId: 'grx'
    })

    await AdministrationsActivitesTypesEmails.query().insert({
      administrationId: mockAdministration.id,
      email: 'foo@bar.cc',
      activiteTypeId: 'grx'
    })

    const mockUser = {
      id: idGenerate(),
      permissionId: 'super',
      administrations: [mockAdministration],
      email: 'email' + idGenerate(),
      motDePasse: 'motdepasse'
    } as IUtilisateur

    await Utilisateurs.query().insertGraph(
      mockUser,
      options.utilisateurs.update
    )

    const q = administrationsQueryModify(
      Administrations.query().where('id', mockAdministration.id),
      mockUser
    )
    const res = (await q
      .withGraphFetched({ activitesTypesEmails: {} })
      .first()) as IAdministration
    expect(res.activitesTypesEmails).toHaveLength(2)
  })
})

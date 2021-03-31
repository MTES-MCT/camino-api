import { dbManager } from '../../../../tests/init-db-manager'
import { IUtilisateur } from '../../../types'
import Administrations from '../../models/administrations'
import AdministrationsTitresTypes from '../../models/administrations-titres-types'
import Titres from '../../models/titres'
import TitresActivites from '../../models/titres-activites'
import { administrationsTitresQuery } from './administrations'
import {
  titresActivitesQueryModify,
  titresActivitesPropsQueryModify
} from './titres-activites'
import { administrationsEtapesTypesPropsQuery } from './metas'
import TitresTypesDemarchesTypesEtapesTypes from '../../models/titres-types--demarches-types-etapes-types'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

describe('administrationsTitresQuery', () => {
  test.each`
    gestionnaire | associee | locale
    ${false}     | ${false} | ${false}
    ${true}      | ${false} | ${false}
    ${false}     | ${true}  | ${false}
    ${true}      | ${true}  | ${false}
    ${false}     | ${false} | ${true}
    ${true}      | ${false} | ${true}
    ${false}     | ${true}  | ${true}
    ${true}      | ${true}  | ${true}
  `(
    "Vérifie l'écriture de la requête sur les titres dont une administration a des droits sur le type",
    async ({ gestionnaire, associee, locale }) => {
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

      const adminstrationQuery = Administrations.query()

      administrationsTitresQuery(['ope-brgm-01'], 'titres', {
        isGestionnaire: gestionnaire,
        isAssociee: associee,
        isLocale: locale
      }).whereNotNull('a_tt.administrationId')

      const q = Titres.query()
        .where('id', 'monTitreId')
        .andWhereRaw('exists(?)', [adminstrationQuery])

      expect(await q.first()).toMatchObject(mockTitre)
    }
  )
})

describe('titresActivitesPropsQueryModify', () => {
  test.each`
    gestionnaire | associee
    ${true}      | ${false}
    ${false}     | ${true}
    ${true}      | ${true}
    ${true}      | ${false}
    ${false}     | ${true}
    ${true}      | ${true}
  `(
    "Vérifie l'écriture de la requête sur les propriétés des activités des titres dont une administration a des droits sur le type",
    async ({ gestionnaire, associee }) => {
      await Titres.query().delete()
      await TitresActivites.query().delete()
      await AdministrationsTitresTypes.query().delete()

      const mockTitre = {
        id: 'monTitreId',
        nom: 'monTitreNom',
        domaineId: 'm',
        statutId: 'ech',
        typeId: 'arm'
      }

      const mockTitreActivite = {
        id: 'titreActiviteId',
        titreId: mockTitre.id,
        date: 'date',
        typeId: 'grp',
        statutId: 'dep',
        periodeId: 1,
        annee: 2020
      }

      await Titres.query().insertGraph(mockTitre)

      await AdministrationsTitresTypes.query().insertGraph({
        administrationId: 'ope-brgm-01',
        titreTypeId: mockTitre.typeId,
        gestionnaire,
        associee
      })

      await TitresActivites.query().insertGraph(mockTitreActivite)

      const user = {
        id: '109f95',
        permissionId: 'admin',
        permission: { id: 'admin', nom: '', ordre: 0 },
        administrations: [{ id: 'ope-brgm-01', typeId: 'ope', nom: 'BRGM' }]
      } as IUtilisateur

      const titresActivitesQuery = TitresActivites.query()

      const q = titresActivitesPropsQueryModify(
        titresActivitesQueryModify(titresActivitesQuery, user),
        user
      )

      expect(await q.first()).toMatchObject(mockTitreActivite)
    }
  )
})

describe('administrationsEtapesTypesPropsQuery', () => {
  test("Vérifie l'écriture de la requête sur les propriétés des types d'étapes sur lesquelles une administration a des droits", async () => {
    await TitresTypesDemarchesTypesEtapesTypes.query().delete()
    await Titres.query().delete()

    const mockTitre = {
      id: 'monTitreId',
      nom: 'monTitreNom',
      domaineId: 'm',
      statutId: 'ech',
      typeId: 'arm'
    }

    await Titres.query().insertGraph(mockTitre)
    await TitresTypesDemarchesTypesEtapesTypes.query().insert({
      titreTypeId: mockTitre.typeId,
      demarcheTypeId: 'oct',
      etapeTypeId: 'dpu',
      ordre: 1
    })

    const q = administrationsEtapesTypesPropsQuery(
      ['ope-brgm-01'],
      'modification'
    )

    expect((await q).length).toBeGreaterThan(0)
  })
})

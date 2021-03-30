import { dbManager } from '../../../../tests/init-db-manager'
import Administrations from '../../models/administrations'
import AdministrationsTitresTypes from '../../models/administrations-titres-types'
import Titres from '../../models/titres'
import { administrationsTitresTypesModify } from './administrations'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

describe('administrationsTitresTypesModify', () => {
  test.each`
    id              | nom              | domaineId | statutId | typeId   | gestionnaire | associe
    ${'monTitreId'} | ${'monTitreNom'} | ${'m'}    | ${'ech'} | ${'arm'} | ${false}     | ${false}
    ${'monTitreId'} | ${'monTitreNom'} | ${'m'}    | ${'ech'} | ${'arm'} | ${true}      | ${false}
    ${'monTitreId'} | ${'monTitreNom'} | ${'m'}    | ${'ech'} | ${'arm'} | ${false}     | ${true}
    ${'monTitreId'} | ${'monTitreNom'} | ${'m'}    | ${'ech'} | ${'arm'} | ${true}      | ${true}
  `(
    "Vérifie l'écriture de la requête sur les titres dont une administration a des droits sur le type",
    async ({
      id,
      nom,
      domaineId,
      statutId,
      typeId,
      gestionnaire,
      associee
    }) => {
      await Titres.query().delete()
      await AdministrationsTitresTypes.query().delete()

      const mockTitre = {
        id,
        nom,
        domaineId,
        statutId,
        typeId
      }

      await Titres.query().insertGraph(mockTitre)

      await AdministrationsTitresTypes.query().insertGraph({
        administrationId: 'ope-brgm-01',
        titreTypeId: typeId,
        gestionnaire,
        associee
      })

      const adminstrationQuery = Administrations.query()

      administrationsTitresTypesModify(
        adminstrationQuery,
        ['ope-brgm-01'],
        'titres',
        { isGestionnaire: gestionnaire, isAssociee: associee }
      )
      adminstrationQuery.whereNotNull('a_tt.administrationId')

      const q = Titres.query()
        .where('id', 'monTitreId')
        .andWhereRaw('exists(?)', [adminstrationQuery])

      expect(await q.first()).toMatchObject(mockTitre)
    }
  )
})

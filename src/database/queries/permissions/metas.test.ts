import { dbManager } from '../../../../tests/db-manager'
import DemarchesTypes from '../../models/demarches-types'
import { demarchesTypesQueryModify } from './metas'
import { idGenerate } from '../../models/_format/id-create'
import Titres from '../../models/titres'
import { IDemarcheType, IUtilisateur } from '../../../types'
import AdministrationsTitresTypes from '../../models/administrations-titres-types'
import AdministrationsTitresTypesTitresStatuts from '../../models/administrations-titres-types-titres-statuts'
import Administrations from '../../models/administrations'

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

describe('metas permissions queries', () => {
  describe('demarchesTypesQueryModify', () => {
    test.each`
      administrationId          | travauxCreation
      ${'dre-ile-de-france-01'} | ${true}
      ${'dea-guadeloupe-01'}    | ${true}
      ${'min-mtes-dgec-01'}     | ${false}
      ${'pre-42218-01'}         | ${false}
      ${'ope-ptmg-973-01'}      | ${false}
    `(
      'l’administration $administrationId peut créer des travaux',
      async ({ administrationId, travauxCreation }) => {
        const titreId = idGenerate()

        await Titres.query().insert({
          id: titreId,
          nom: idGenerate(),
          statutId: 'val',
          domaineId: 'm',
          typeId: 'arm'
        })

        await AdministrationsTitresTypes.query().delete()
        // On donne le droit gestionnaire à la DREAL
        await AdministrationsTitresTypes.query().insert({
          administrationId,
          titreTypeId: 'arm',
          gestionnaire: true
        })

        // On met une restriction sur les démarches du code minier sur ce type de titre
        await AdministrationsTitresTypesTitresStatuts.query().delete()
        await AdministrationsTitresTypesTitresStatuts.query().insert({
          administrationId,
          titreTypeId: 'arm',
          titreStatutId: 'val',
          titresModificationInterdit: false,
          demarchesModificationInterdit: true,
          etapesModificationInterdit: false
        })

        const administration = await Administrations.query().findById(
          administrationId
        )

        const q = DemarchesTypes.query()
        demarchesTypesQueryModify(
          q,
          {
            permissionId: 'admin',
            administrations: [administration!]
          } as unknown as IUtilisateur,
          {
            titreId
          }
        )

        const demarchesTypes = (await q) as unknown as IDemarcheType[]

        // a le droit de créer/modifier des travaux mais pas des démarches
        demarchesTypes.forEach(dt => {
          if (dt.travaux && travauxCreation) {
            expect(dt.demarchesCreation).toBeTruthy()
          } else {
            expect(dt.demarchesCreation).toBeFalsy()
          }
        })
      }
    )
  })
})

import { dbManager } from '../../../tests/db-manager'
import { idGenerate } from '../models/_format/id-create'
import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import TitresEtapes from '../models/titres-etapes'
import { titreDemarcheArchive } from './titres-demarches'

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
describe('teste les requêtes sur les démarches', () => {
  describe('titreDemarcheArchive', () => {
    test('vérifie que la démarche et ses étapes s’archivent correctement', async () => {
      const titre = await Titres.query().insert({
        nom: idGenerate(),
        statutId: 'val',
        domaineId: 'm',
        typeId: 'arm'
      })

      const demarche = await TitresDemarches.query().insert({
        titreId: titre.id,
        typeId: 'oct',
        statutId: 'eco'
      })
      expect(demarche.archive).toBeFalsy()

      for (let j = 0; j < 3; j++) {
        const etape = await TitresEtapes.query().insert({
          titreDemarcheId: demarche.id,
          typeId: 'mfr',
          statutId: 'aco',
          date: '2020-02-02'
        })
        expect(etape.archive).toBeFalsy()
      }

      await titreDemarcheArchive(demarche.id)

      const archiveDemarche = await TitresDemarches.query()
        .findById(demarche.id)
        .withGraphFetched('etapes')

      expect(archiveDemarche).not.toBeUndefined()
      expect(archiveDemarche?.archive).toBe(true)
      expect(archiveDemarche?.etapes).toHaveLength(3)

      for (const etape of archiveDemarche!.etapes) {
        expect(etape.archive).toBe(true)
      }
    })
  })
})

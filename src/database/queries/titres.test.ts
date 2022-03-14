import { dbManager } from '../../../tests/db-manager'
import { idGenerate } from '../models/_format/id-create'
import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import TitresEtapes from '../models/titres-etapes'
import { titreArchive } from './titres'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})
describe('teste les requêtes sur les titres', () => {
  describe('titreArchive', () => {
    test('vérifie que le titre, ses démarches et ses étapes s’archivent correctement', async () => {
      const titre = await Titres.query().insert({
        nom: idGenerate(),
        statutId: 'val',
        domaineId: 'm',
        typeId: 'arm'
      })
      expect(titre.archive).toBeFalsy()

      for (let i = 0; i < 3; i++) {
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
      }

      await titreArchive(titre.id)

      const archiveTitre = await Titres.query()
        .findById(titre.id)
        .withGraphFetched('demarches.etapes')

      expect(archiveTitre).not.toBeUndefined()
      expect(archiveTitre?.archive).toBe(true)
      expect(archiveTitre?.demarches).toHaveLength(3)

      for (const demarche of archiveTitre!.demarches) {
        expect(demarche.archive).toBe(true)
        expect(demarche.etapes).toHaveLength(3)

        for (const etape of demarche.etapes) {
          expect(etape.archive).toBe(true)
        }
      }
    })
  })
})

import { dbManager } from '../../../../tests/db-manager'

import Titres from '../../models/titres'
import { idGenerate } from '../../models/_format/id-create'
import { userSuper } from '../../user-super'
import TitresEtapes from '../../models/titres-etapes'
import { titresEtapesQueryModify } from './titres-etapes'
import TitresDemarches from '../../models/titres-demarches'

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

describe('titresEtapesQueryModify', () => {
  describe('titresEtapesArchive', () => {
    test("Vérifie si le statut archivé masque l'étape de la démarche", async () => {
      const titreId = idGenerate()
      await Titres.query().insert([
        {
          id: titreId,
          nom: titreId,
          statutId: 'val',
          domaineId: 'm',
          typeId: 'arm',
          archive: false
        }
      ])

      const titreDemarcheId = idGenerate()
      await TitresDemarches.query().insert({
        id: titreDemarcheId,
        typeId: 'oct',
        statutId: 'eco',
        titreId,
        archive: false
      })
      const titreEtapeId = idGenerate()
      const archivedTitreEtapeId = idGenerate()
      await TitresEtapes.query().insert([
        {
          id: titreEtapeId,
          date: '2022-03-09',
          typeId: 'mfr',
          statutId: 'aco',
          titreDemarcheId,
          archive: false
        },
        {
          id: archivedTitreEtapeId,
          date: '2022-03-09',
          typeId: 'mfr',
          statutId: 'aco',
          titreDemarcheId,
          archive: true
        }
      ])
      const q = TitresEtapes.query()
      titresEtapesQueryModify(q, userSuper)

      const titresEtapes = await q

      expect(titresEtapes).toHaveLength(1)
      expect(titresEtapes[0].id).toBe(titreEtapeId)
    })
  })
})

import { mocked } from 'ts-jest/utils'

import { titresEtapesDemandeACOUpdate } from './titres-etapes-demande-aco-update'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import TitresDemarches from '../../database/models/titres-demarches'
import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import { ITitreEtape } from '../../types'

jest.mock('../../database/queries/titres-etapes', () => ({
  titreEtapeUpdate: jest.fn().mockResolvedValue(true)
}))

jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheGet: jest.fn()
}))

const titreEtapeUpdateMock = mocked(titreEtapeUpdate, true)
const titreDemarcheGetMock = mocked(titreDemarcheGet, true)

console.info = jest.fn()

describe('date de la demande en construction', () => {
  test('ne fait rien si il n’y a pas d’étape de demande en construction', async () => {
    titreDemarcheGetMock.mockResolvedValue({
      etapes: [] as ITitreEtape[]
    } as TitresDemarches)
    const titresDemarchesOrdreUpdated = await titresEtapesDemandeACOUpdate(
      'titreDemarcheId'
    )
    expect(titresDemarchesOrdreUpdated.length).toEqual(0)
    expect(titreEtapeUpdateMock).not.toHaveBeenCalled()
  })

  test.each(['mfr', 'mfm'])(
    'met à jour la date de la demande en construction',
    async (typeId: string) => {
      titreDemarcheGetMock.mockResolvedValue({
        etapes: [
          { id: '1', typeId, statutId: 'aco', date: '2020-01-01' },
          { id: '2', typeId: 'rde', statutId: 'fav', date: '2020-01-03' }
        ]
      } as TitresDemarches)
      const titresDemarchesOrdreUpdated = await titresEtapesDemandeACOUpdate(
        'titreDemarcheId'
      )
      expect(titresDemarchesOrdreUpdated.length).toEqual(1)
      expect(titreEtapeUpdateMock).toHaveBeenCalledWith('1', {
        date: '2020-01-04'
      })
    }
  )

  test('ne met pas à jour la date de la demande en construction si elle n’a pas changée', async () => {
    titreDemarcheGetMock.mockResolvedValue({
      etapes: [
        { id: '1', typeId: 'mfr', statutId: 'aco', date: '2020-01-04' },
        { id: '2', typeId: 'rde', statutId: 'fav', date: '2020-01-03' }
      ]
    } as TitresDemarches)
    const titresDemarchesOrdreUpdated = await titresEtapesDemandeACOUpdate(
      'titreDemarcheId'
    )
    expect(titresDemarchesOrdreUpdated.length).toEqual(0)
    expect(titreEtapeUpdateMock).not.toHaveBeenCalled()
  })

  test('ne met pas à jour la date de la demande en construction si elle est seule', async () => {
    titreDemarcheGetMock.mockResolvedValue({
      etapes: [{ id: '1', typeId: 'mfr', statutId: 'aco', date: '2020-01-04' }]
    } as TitresDemarches)
    const titresDemarchesOrdreUpdated = await titresEtapesDemandeACOUpdate(
      'titreDemarcheId'
    )
    expect(titresDemarchesOrdreUpdated.length).toEqual(0)
    expect(titreEtapeUpdateMock).not.toHaveBeenCalled()
  })
})

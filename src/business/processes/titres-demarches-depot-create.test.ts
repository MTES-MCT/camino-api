import { ITitre } from '../../types'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import TitresDemarches from '../../database/models/titres-demarches'
import { titresEtapesDepotCreate } from './titres-demarches-depot-create'
import * as titresDemarchesDepotCreateMethods from './titres-demarches-depot-create'
import { mocked } from 'jest-mock'

jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheGet: jest.fn()
}))

const titreEtapeDepotCreateMock = jest.spyOn(
  titresDemarchesDepotCreateMethods,
  'titreEtapeDepotCreate'
)
titreEtapeDepotCreateMock.mockImplementation(() => Promise.resolve())

const titreDemarcheGetMock = mocked(titreDemarcheGet, true)

console.info = jest.fn()

describe('créer le dépot de la démarche', () => {
  test.each`
    test                                                                  | etapes                                                                                                              | creation
    ${'crée un dépot d’une ARM avec une demande faite'}                   | ${[{ date: '2021-01-01', typeId: 'mfr', statutId: 'fai' }]}                                                         | ${true}
    ${'ne crée pas un dépot d’une ARM si sa demande est en construction'} | ${[{ date: '2021-01-01', typeId: 'mfr', statutId: 'enc' }]}                                                         | ${false}
    ${'ne crée pas un dépot d’une ARM si sa demande est historique'}      | ${[{ date: '2018-01-01', typeId: 'mfr', statutId: 'fai' }]}                                                         | ${false}
    ${'ne crée pas un dépot d’une ARM si déjà déposée'}                   | ${[{ date: '2021-01-01', typeId: 'mfr', statutId: 'fai' }, { date: '2021-01-02', typeId: 'mdp', statutId: 'fai' }]} | ${false}
  `('$test', async ({ etapes, creation }) => {
    titreDemarcheGetMock.mockResolvedValue({
      titre: { typeId: 'arm' } as ITitre,
      typeId: 'oct',
      etapes
    } as TitresDemarches)

    const titresDemarchesDepotCreated = await titresEtapesDepotCreate(
      'demarcheId'
    )
    expect(titresDemarchesDepotCreated).toEqual(creation)
    if (creation) {
      expect(titreEtapeDepotCreateMock).toHaveBeenCalled()
    } else {
      expect(titreEtapeDepotCreateMock).not.toHaveBeenCalled()
    }
  })

  test.each`
    etapes                                                                                                                                                                      | creation
    ${[{ date: '2021-01-01', typeId: 'mfr', statutId: 'fai' }, { date: '2021-01-01', typeId: 'asl', statutId: 'fav' }, { date: '2021-01-01', typeId: 'dae', statutId: 'exe' }]} | ${true}
    ${[{ date: '2021-01-01', typeId: 'mfr', statutId: 'fai' }, { date: '2021-01-01', typeId: 'asl', statutId: 'fre' }, { date: '2021-01-01', typeId: 'dae', statutId: 'exe' }]} | ${true}
    ${[{ date: '2021-01-01', typeId: 'mfr', statutId: 'aco' }, { date: '2021-01-01', typeId: 'asl', statutId: 'fre' }, { date: '2021-01-01', typeId: 'dae', statutId: 'exe' }]} | ${false}
    ${[{ date: '2021-01-01', typeId: 'mfr', statutId: 'fai' }, { date: '2021-01-01', typeId: 'asl', statutId: 'def' }, { date: '2021-01-01', typeId: 'dae', statutId: 'exe' }]} | ${false}
    ${[{ date: '2021-01-01', typeId: 'mfr', statutId: 'fai' }, { date: '2021-01-01', typeId: 'asl', statutId: 'fre' }, { date: '2021-01-01', typeId: 'dae', statutId: 'req' }]} | ${false}
    ${[{ date: '2018-01-01', typeId: 'mfr', statutId: 'fai' }, { date: '2021-01-01', typeId: 'asl', statutId: 'fav' }, { date: '2021-01-01', typeId: 'dae', statutId: 'exe' }]} | ${false}
  `('test le dépot automatique d’AXM', async ({ etapes, creation }) => {
    titreDemarcheGetMock.mockResolvedValue({
      titre: { typeId: 'axm' } as ITitre,
      typeId: 'oct',
      etapes
    } as TitresDemarches)

    const titresDemarchesDepotCreated = await titresEtapesDepotCreate(
      'demarcheId'
    )
    expect(titresDemarchesDepotCreated).toEqual(creation)
    if (creation) {
      expect(titreEtapeDepotCreateMock).toHaveBeenCalled()
    } else {
      expect(titreEtapeDepotCreateMock).not.toHaveBeenCalled()
    }
  })
})

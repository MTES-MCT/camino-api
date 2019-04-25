import titreDemarchesByTypeUpdate from './titre-demarches-by-type-update'

import {
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged,
  titreWith2Mut,
  titreWithPhase,
  titreWithSubElement
} from './__mocks__/titre-demarches-by-type-update-demarches'

jest.mock('../queries/titres', () => ({
  calculatedProps: []
}))

describe("change l'id de la démarche d'un titre", () => {
  test("une démarche dont le type n'a pas changé n'est pas mise à jour", async () => {
    expect(
      await titreDemarchesByTypeUpdate(
        titreWithDemarchesNoChange.demarches,
        titreWithDemarchesNoChange
      )
    ).toEqual({
      titreDemarchesNew: [],
      titreDemarchesOldIds: []
    })
  })

  test('une démarche dont le type a changé est mise à jour', async () => {
    expect(
      await titreDemarchesByTypeUpdate(
        titreWithDemarchesChanged.demarches,
        titreWithDemarchesChanged
      )
    ).toEqual({
      titreDemarchesNew: [
        {
          id: 'h-nom-cxx-mut01',
          titreId: 'h-nom-cxx',
          typeId: 'mut',
          etapes: []
        }
      ],
      titreDemarchesOldIds: ['h-nom-cxx-oct01']
    })
  })

  test("une démarche dont l'ordre a changé suite à un changement de type d'une autre démarche est mise à jour", async () => {
    expect(
      await titreDemarchesByTypeUpdate(titreWith2Mut.demarches, titreWith2Mut)
    ).toEqual({
      titreDemarchesNew: [
        {
          id: 'h-nom-cxx-mut01',
          titreId: 'h-nom-cxx',
          typeId: 'mut',
          etapes: [
            {
              date: '2000-01-01',
              id: 'h-nom-cxx-mut01-dex01',
              ordre: 1,
              titreDemarcheId: 'h-nom-cxx-mut01',
              typeId: 'dex'
            }
          ]
        },
        {
          id: 'h-nom-cxx-mut02',
          titreId: 'h-nom-cxx',
          typeId: 'mut',
          etapes: [
            {
              date: '3000-01-01',
              id: 'h-nom-cxx-mut02-dex01',
              ordre: 1,
              titreDemarcheId: 'h-nom-cxx-mut02',
              typeId: 'dex'
            }
          ]
        }
      ],
      titreDemarchesOldIds: ['h-nom-cxx-oct01', 'h-nom-cxx-mut01']
    })
  })

  test('la phase est supprimée', async () => {
    expect(
      await titreDemarchesByTypeUpdate(titreWithPhase.demarches, titreWithPhase)
    ).toEqual({
      titreDemarchesNew: [
        {
          id: 'h-nom-cxx-mut01',
          titreId: 'h-nom-cxx',
          typeId: 'mut',
          etapes: []
        }
      ],
      titreDemarchesOldIds: ['h-nom-cxx-oct01']
    })
  })
})

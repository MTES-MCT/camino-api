import titreEtapesByTypeUpdate from './titre-etapes-by-type-update'

import * as titreQueries from '../queries/titres'

import {
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged,
  titreWith2Dpu,
  titreWithTitulaire,
  titreWithSubElement
} from './__mocks__/titre-etapes-by-type-update-etapes'

jest.mock('../queries/titres', () => ({
  calculatedProps: ['titulaires']
}))

describe("change l'id de l'étape d'un titre", () => {
  test("une étape dont le type n'a pas changé n'est pas mise à jour", async () => {
    expect(
      await titreEtapesByTypeUpdate(
        titreWithDemarchesNoChange.demarches[0].etapes,
        titreWithDemarchesNoChange
      )
    ).toEqual({ titreEtapesNew: [], titreEtapesOldIds: [], titreProps: {} })
  })

  test('une étape dont le type a changé est mise à jour', async () => {
    expect(
      await titreEtapesByTypeUpdate(
        titreWithDemarchesChanged.demarches[0].etapes,
        titreWithDemarchesChanged
      )
    ).toEqual({
      titreEtapesNew: [
        {
          id: 'h-nom-cxx-oct01-dpu01',
          titreDemarcheId: 'h-nom-cxx-oct01',
          typeId: 'dpu'
        }
      ],
      titreEtapesOldIds: ['h-nom-cxx-oct01-dex01'],
      titreProps: {}
    })
  })

  test("une étape dont l'ordre a changé suite à un changement de type d'une autre étape est mise à jour", async () => {
    expect(
      await titreEtapesByTypeUpdate(
        titreWith2Dpu.demarches[0].etapes,
        titreWith2Dpu
      )
    ).toEqual({
      titreEtapesNew: [
        {
          id: 'h-nom-cxx-oct01-dpu01',
          ordre: 1,
          titreDemarcheId: 'h-nom-cxx-oct01',
          typeId: 'dpu'
        }
      ],
      titreEtapesOldIds: ['h-nom-cxx-oct01-dex01'],
      titreProps: {}
    })
  })

  test("la propriété calculée d'un titre est mise à jour si l'id de l'étape a changé", async () => {
    expect(
      await titreEtapesByTypeUpdate(
        titreWithTitulaire.demarches[0].etapes,
        titreWithTitulaire
      )
    ).toEqual({
      titreEtapesNew: [
        {
          id: 'h-nom-cxx-oct01-dpu01',
          ordre: 1,
          titreDemarcheId: 'h-nom-cxx-oct01',
          titulaire: true,
          typeId: 'dpu'
        }
      ],
      titreEtapesOldIds: ['h-nom-cxx-oct01-dex01'],
      titreProps: { titulaires: 'h-nom-cxx-oct01-dpu01' }
    })
  })

  test("la propriété d'un sous-élément d'une étape est mise à jour", async () => {
    expect(
      await titreEtapesByTypeUpdate(
        titreWithSubElement.demarches[0].etapes,
        titreWithSubElement
      )
    ).toEqual({
      titreEtapesNew: [
        {
          id: 'h-nom-cxx-oct01-dpu01',
          ordre: 1,
          points: [
            {
              id: 'h-nom-cxx-oct01-dpu01-g01-p01-c01',
              references: [
                {
                  id: 'h-nom-cxx-oct01-dpu01-g01-p01-c01-134563',
                  titrePointId: 'h-nom-cxx-oct01-dpu01'
                }
              ],
              titreEtapeId: 'h-nom-cxx-oct01-dpu01'
            }
          ],
          titreDemarcheId: 'h-nom-cxx-oct01',
          typeId: 'dpu'
        }
      ],
      titreEtapesOldIds: ['h-nom-cxx-oct01-dex01'],
      titreProps: {}
    })
  })
})

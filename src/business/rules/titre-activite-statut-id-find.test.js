import titreActiviteStatutIdFind from './titre-activite-statut-id-find'
import {
  titreActiviteDelaiDepasse,
  titreActiviteDelaiNonDepasse
} from './__mocks__/titre-activite-statut-id-find-activites'

describe("statut d'une activité", () => {
  test('une activité dont le délai est dépassé a le statut “fermé', () => {
    expect(titreActiviteStatutIdFind(titreActiviteDelaiDepasse)).toEqual('fer')
  })

  test("une activité dont le délai n'est pas dépassé ne change pas de statut", () => {
    expect(titreActiviteStatutIdFind(titreActiviteDelaiNonDepasse)).toEqual(
      titreActiviteDelaiNonDepasse.activiteStatutId
    )
  })
})

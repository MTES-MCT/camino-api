import titreActiviteStatutIdFind from './titre-activite-statut-id-find'

import {
  titreActiviteFermee,
  titreActiviteDeposee,
  titreActiviteAbsenteDelaiDepasse,
  titreActiviteEnCoursDelaiNonDepasse
} from './__mocks__/titre-activite-statut-id-find-activites'

describe("statut d'une activité", () => {
  test('une activité dont le statut est “fermé" garde le statut "fermé"', () => {
    expect(titreActiviteStatutIdFind(titreActiviteFermee)).toEqual(
      titreActiviteFermee.statutId
    )
  })

  test('une activité dont le statut est “déposé" garde le statut "déposé"', () => {
    expect(titreActiviteStatutIdFind(titreActiviteDeposee)).toEqual(
      titreActiviteDeposee.statutId
    )
  })

  test('une activité dont statut est "abs" et le délai est dépassé a le statut “fermé', () => {
    expect(titreActiviteStatutIdFind(titreActiviteAbsenteDelaiDepasse)).toEqual(
      'fer'
    )
  })

  test('une activité dont le statut est "enc" dont le délai n\'est pas dépassé ne change pas de statut', () => {
    expect(
      titreActiviteStatutIdFind(titreActiviteEnCoursDelaiNonDepasse)
    ).toEqual(titreActiviteEnCoursDelaiNonDepasse.statutId)
  })
})

import titreDemarcheDateFinAndDureeFind from './titre-demarche-date-fin-duree-find'
import titreDemarches from './__mocks__/titre-demarches'

test("trouve la date de fin et la durée d'une démarche", () => {
  expect(titreDemarcheDateFinAndDureeFind(titreDemarches, 2)).toEqual({
    dateFin: '2013-03-12',
    duree: 25
  })
})

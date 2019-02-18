import titrePropEtapeIdFind from './titre-prop-etape-id-find'
import {
  titreDemarchesOctPointsMut,
  titreDemarchesOctPointsVides,
  titreDemarchesOctMutPoints,
  titreDemarchesOctPointsMutInstruction,
  titreDemarchesOctAccDpuRej,
  titreDemarchesOctMfrPoints
} from './__mocks__/titre-prop-etape-id-find-demarches'

describe("trouve l'id de l'étape pour laquelle une propriété est valide (dé-normalise)", () => {
  test("trouve l'id de la dernière étape acceptée de la démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(titrePropEtapeIdFind(titreDemarchesOctPointsMut, 'points')).toEqual(
      'h-cxx-courdemanges-1988-oct01-dpu01'
    )
  })

  test("le résultat est vide car la dernière étape acceptée de la dernière démarche acceptée possède une propriété 'points' à tableau vide", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctPointsVides, 'points')
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape acceptée de la démarche de mutation acceptée ayant la propriété 'points'", () => {
    expect(titrePropEtapeIdFind(titreDemarchesOctMutPoints, 'points')).toEqual(
      'h-cxx-courdemanges-1988-mut01-dpu01'
    )
  })

  test("le résultat est vide car aucune étape acceptée ne contient la propriété 'communes'", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctMutPoints, 'communes')
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape acceptée de la dernière démarche d'octroi en instruction ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctPointsMutInstruction, 'points')
    ).toEqual('h-cxx-courdemanges-1988-oct01-dpu01')
  })

  test("le résultat est vide car l'étape est rejetée", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctAccDpuRej, 'points')
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape de formalisation de la demande de la dernière démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(titrePropEtapeIdFind(titreDemarchesOctMfrPoints, 'points')).toEqual(
      'h-cxx-courdemanges-1988-oct01-mfr01'
    )
  })
})

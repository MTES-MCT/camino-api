import titrePropEtapeIdFind from './titre-prop-etape-id-find'
import {
  titreDemarchesOctPointsMut,
  titreDemarchesOctPointsVides,
  titreDemarchesOctMutPoints,
  titreDemarchesOctPointsMutInstruction,
  titreDemarchesOctAccDpuRej,
  titreDemarchesOctMfrPoints,
  titreDemarchesOctAmodiatairesPassee,
  titreDemarchesOctAmodiatairesMod,
  titreDemarchesProPointsModPhaseEch,
  titreDemarchesProPointsModPhaseVal,
  titreDemarchesMutPointsMod
} from './__mocks__/titre-prop-etape-id-find-demarches'

describe("id de l'étape d'une propriété valide (dé-normalise)", () => {
  test("trouve l'id de la dernière étape acceptée de la démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(titrePropEtapeIdFind(titreDemarchesOctPointsMut, 'points')).toEqual(
      'h-cx-courdemanges-1989-oct01-dpu01'
    )
  })

  test("ne trouve pas d'id si la dernière étape acceptée de la dernière démarche acceptée possède une propriété 'points' vide", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctPointsVides, 'points')
    ).toBeUndefined()
  })

  test("trouve l'id de la dernière étape acceptée de la démarche de mutation acceptée ayant la propriété 'points'", () => {
    expect(titrePropEtapeIdFind(titreDemarchesOctMutPoints, 'points')).toEqual(
      'h-cx-courdemanges-1986-mut01-dpu01'
    )
  })

  test("ne trouve pas d'id si aucune étape acceptée ne contient la propriété 'communes'", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctMutPoints, 'communes')
    ).toBeUndefined()
  })

  test("trouve l'id de la dernière étape acceptée de la dernière démarche d'octroi en instruction ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctPointsMutInstruction, 'points')
    ).toEqual('h-cx-courdemanges-1985-oct01-dpu01')
  })

  test("ne trouve pas d'id si l'étape est rejetée", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctAccDpuRej, 'points')
    ).toBeUndefined()
  })

  test("trouve l'id de la dernière étape de formalisation de la demande de la dernière démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(titrePropEtapeIdFind(titreDemarchesOctMfrPoints, 'points')).toEqual(
      'h-cx-courdemanges-1983-oct01-mfr01'
    )
  })

  test("ne trouve pas d'id si la démarche de l'étape contenant la propriété 'amodiataires' a une date de fin passée", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctAmodiatairesPassee, 'amodiataires')
    ).toBeUndefined()
  })

  test("trouve l'id de la dernière étape de dpu car l'étape contient la propriété 'amodiataires' et le titre a le statut 'modification en instance'", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesOctAmodiatairesMod, 'amodiataires')
    ).toEqual('h-cx-courdemanges-1981-amo01-dpu01')
  })

  test("trouve l'id de la dernière étape de dpu d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient un périmètre et le titre a le statut 'modification en instance' et aucune phase n'est valide", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesProPointsModPhaseEch, 'points')
    ).toEqual('h-cx-courdemanges-1981-pro01-dpu01')
  })

  test("ne trouve pas l'id de la dernière étape de dpu d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient un périmètre et le titre a le statut 'modification en instance' mais la phase est encore valide", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesProPointsModPhaseVal, 'points')
    ).toBeUndefined()
  })

  test("ne trouve pas l'id de la dernière étape de dpu car aucune démarche de prolongation ou de demande de titre en instruction ne contient de périmètre et le titre a le statut 'modification en instance'", () => {
    expect(
      titrePropEtapeIdFind(titreDemarchesMutPointsMod, 'points')
    ).toBeUndefined()
  })
})

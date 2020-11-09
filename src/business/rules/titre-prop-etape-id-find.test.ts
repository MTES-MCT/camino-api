import titrePropEtapeIdFind from './titre-prop-etape-id-find'
import {
  titreDemarchesOctPointsMut,
  titreDemarchesOctPointsVides,
  titreDemarchesOctMutPoints,
  titreDemarchesOctPointsMutInstruction,
  titreDemarchesOctAccDpuRej,
  titreDemarchesOctMfrPoints,
  titreDemarchesOctAmodiatairesValide,
  titreDemarchesOctAmodiatairesMod,
  titreDemarchesProPointsModPhaseEch,
  titreDemarchesProPointsModPhaseVal,
  titreDemarchesMutPointsMod,
  titreDemarchesProModPhaseEch
} from './__mocks__/titre-prop-etape-id-find-demarches'
import each from 'jest-each'

describe("id de l'étape d'une propriété valide (dé-normalise)", () => {
  test("trouve l'id de la dernière étape acceptée de la démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctPointsMut.demarches,
        titreDemarchesOctPointsMut.statutId,
        'points'
      )
    ).toEqual('h-cx-courdemanges-1989-oct01-dpu01')
  })

  test("ne trouve pas d'id si la dernière étape acceptée de la dernière démarche acceptée possède une propriété 'points' vide", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctPointsVides.demarches,
        titreDemarchesOctPointsVides.statutId,
        'points'
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape acceptée de la démarche de mutation acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctMutPoints.demarches,
        titreDemarchesOctMutPoints.statutId,
        'points'
      )
    ).toEqual('h-cx-courdemanges-1986-mut01-dpu01')
  })

  test("ne trouve pas d'id si aucune étape acceptée ne contient la propriété 'communes'", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctMutPoints.demarches,
        titreDemarchesOctMutPoints.statutId,
        'communes'
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape acceptée de la dernière démarche d'octroi en instruction ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctPointsMutInstruction.demarches,
        titreDemarchesOctPointsMutInstruction.statutId,
        'points'
      )
    ).toEqual('h-cx-courdemanges-1985-oct01-dpu01')
  })

  test("ne trouve pas d'id si l'étape est rejetée", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctAccDpuRej.demarches,
        titreDemarchesOctAccDpuRej.statutId,
        'points'
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape de formalisation de la demande de la dernière démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctMfrPoints.demarches,
        titreDemarchesOctMfrPoints.statutId,
        'points'
      )
    ).toEqual('h-cx-courdemanges-1983-oct01-mfr01')
  })

  test("trouve l'id de dernière étape contenant la propriété 'amodiataires' a une date de fin valide", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctAmodiatairesValide.demarches,
        titreDemarchesOctAmodiatairesValide.statutId,
        'amodiataires'
      )
    ).toEqual('h-cx-courdemanges-1982-oct01-dpu01')
  })

  test("trouve l'id de la dernière étape de dpu car l'étape contient la propriété 'amodiataires' et le titre a le statut 'modification en instance'", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesOctAmodiatairesMod.demarches,
        titreDemarchesOctAmodiatairesMod.statutId,
        'amodiataires'
      )
    ).toEqual('h-cx-courdemanges-1981-amo01-dpu01')
  })

  test("trouve l'id de la dernière étape de dpu d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient un périmètre et le titre a le statut 'modification en instance' et aucune phase n'est valide", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesProPointsModPhaseEch.demarches,
        titreDemarchesProPointsModPhaseEch.statutId,
        'points'
      )
    ).toEqual('h-cx-courdemanges-1981-pro01-dpu01')
  })

  test("ne trouve pas l'id de la dernière étape de dpu d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient un périmètre et le titre a le statut 'modification en instance' mais la phase est encore valide", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesProPointsModPhaseVal.demarches,
        titreDemarchesProPointsModPhaseVal.statutId,
        'points'
      )
    ).toBeNull()
  })

  test("ne trouve pas l'id de la dernière étape de dpu car aucune démarche de prolongation ou de demande de titre en instruction ne contient de périmètre et le titre a le statut 'modification en instance'", () => {
    expect(
      titrePropEtapeIdFind(
        titreDemarchesMutPointsMod.demarches,
        titreDemarchesMutPointsMod.statutId,
        'points'
      )
    ).toBeNull()
  })

  each(['points', 'surface', 'substances', 'communes']).test(
    "trouve l'id de la dernière étape de n’importe quel type d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient la propriété %s et le titre a le statut 'modification en instance' et aucune phase n'est valide",
    prop => {
      expect(
        titrePropEtapeIdFind(
          JSON.parse(JSON.stringify(titreDemarchesProModPhaseEch.demarches)),
          titreDemarchesProModPhaseEch.statutId,
          prop
        )
      ).toEqual('h-cx-courdemanges-1981-pro01-dpu01')
    }
  )

  each(['titulaires', 'amodiataires', 'administrations']).test(
    "ne trouve pas l'id de la mod car la propriété %s n’est pas modifiée par cette étape",
    prop => {
      expect(
        titrePropEtapeIdFind(
          JSON.parse(JSON.stringify(titreDemarchesProModPhaseEch.demarches)),
          titreDemarchesProModPhaseEch.statutId,
          prop
        )
      ).toEqual('h-cx-courdemanges-1981-oct01-dpu01')
    }
  )
})

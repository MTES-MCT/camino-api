import { ITitreEtapeProp } from '../../types'

import titrePropEtapeIdFind from './titre-prop-etape-id-find'
import {
  titreDemarchesOctPointsMut,
  titreDemarchesOctPointsVides,
  titreDemarchesOctMutPoints,
  titreDemarchesOctPointsMutInstruction,
  titreDemarchesOctAccDpuRej,
  titreDemarchesOctMfrPoints,
  titreDemarchesOctAmodiatairesPassee,
  titreDemarchesOctAmodiatairesValide,
  titreDemarchesOctAmodiatairesMod,
  titreDemarchesProPointsModPhaseEch,
  titreDemarchesProPointsModPhaseVal,
  titreDemarchesMutPointsMod,
  titreDemarchesProModPhaseEch
} from './__mocks__/titre-prop-etape-id-find-demarches'

describe("id de l'étape d'une propriété valide (dé-normalise)", () => {
  test("trouve l'id de la dernière étape acceptée de la démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesOctPointsMut.demarches,
        titreDemarchesOctPointsMut.statutId
      )
    ).toEqual('h-cx-courdemanges-1989-oct01-dpu01')
  })

  test("ne trouve pas d'id si la dernière étape acceptée de la dernière démarche acceptée possède une propriété 'points' vide", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesOctPointsVides.demarches,
        titreDemarchesOctPointsVides.statutId
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape acceptée de la démarche de mutation acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesOctMutPoints.demarches,
        titreDemarchesOctMutPoints.statutId
      )
    ).toEqual('h-cx-courdemanges-1986-mut01-dpu01')
  })

  test("ne trouve pas d'id si aucune étape acceptée ne contient la propriété 'communes'", () => {
    expect(
      titrePropEtapeIdFind(
        'communes',
        titreDemarchesOctMutPoints.demarches,
        titreDemarchesOctMutPoints.statutId
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape acceptée de la dernière démarche d'octroi en instruction ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesOctPointsMutInstruction.demarches,
        titreDemarchesOctPointsMutInstruction.statutId
      )
    ).toEqual('h-cx-courdemanges-1985-oct01-dpu01')
  })

  test("ne trouve pas d'id si l'étape est rejetée", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesOctAccDpuRej.demarches,
        titreDemarchesOctAccDpuRej.statutId
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape de formalisation de la demande de la dernière démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesOctMfrPoints.demarches,
        titreDemarchesOctMfrPoints.statutId
      )
    ).toEqual('h-cx-courdemanges-1983-oct01-mfr01')
  })

  test("trouve l'id de la dernière étape de dpu d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient un périmètre et le titre a le statut 'modification en instance' et aucune phase n'est valide", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesProPointsModPhaseEch.demarches,
        titreDemarchesProPointsModPhaseEch.statutId
      )
    ).toEqual('h-cx-courdemanges-1981-pro01-dpu01')
  })

  test("ne trouve pas l'id de la dernière étape de dpu d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient un périmètre et le titre a le statut 'modification en instance' mais la phase est encore valide", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesProPointsModPhaseVal.demarches,
        titreDemarchesProPointsModPhaseVal.statutId
      )
    ).toBeNull()
  })

  test("ne trouve pas l'id de la dernière étape de dpu car aucune démarche de prolongation ou de demande de titre en instruction ne contient de périmètre et le titre a le statut 'modification en instance'", () => {
    expect(
      titrePropEtapeIdFind(
        'points',
        titreDemarchesMutPointsMod.demarches,
        titreDemarchesMutPointsMod.statutId
      )
    ).toBeNull()
  })

  test.each([
    'points',
    'surface',
    'substances',
    'communes'
  ] as ITitreEtapeProp[])(
    "trouve l'id de la dernière étape de n’importe quel type d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient la propriété %s et le titre a le statut 'modification en instance' et aucune phase n'est valide",
    prop => {
      expect(
        titrePropEtapeIdFind(
          prop,
          titreDemarchesProModPhaseEch.demarches,
          titreDemarchesProModPhaseEch.statutId
        )
      ).toEqual('h-cx-courdemanges-1981-pro01-dpu01')
    }
  )

  test.each(['titulaires', 'administrations'] as ITitreEtapeProp[])(
    "ne trouve pas l'id de la mod car la propriété %s n’est pas modifiée par cette étape",
    prop => {
      expect(
        titrePropEtapeIdFind(
          prop,
          titreDemarchesProModPhaseEch.demarches,
          titreDemarchesProModPhaseEch.statutId
        )
      ).toEqual('h-cx-courdemanges-1981-oct01-dpu01')
    }
  )

  // amodiataires

  test("trouve pas d'id si la démarche de l'étape contenant la propriété 'amodiataires' a une phase valide", () => {
    expect(
      titrePropEtapeIdFind(
        'amodiataires',
        titreDemarchesOctAmodiatairesPassee.demarches,
        titreDemarchesOctAmodiatairesPassee.statutId
      )
    ).toBe('h-cx-courdemanges-1982-oct01-dpu01')
  })

  test("trouve l'id de dernière étape contenant la propriété 'amodiataires' dont la démarche précédente a une phase valide", () => {
    expect(
      titrePropEtapeIdFind(
        'amodiataires',
        titreDemarchesOctAmodiatairesValide.demarches,
        titreDemarchesOctAmodiatairesValide.statutId
      )
    ).toEqual('h-cx-courdemanges-1982-amo01-dpu01')
  })

  test("ne trouve pas l'id de la dernière étape contenant la propriété 'amodiataires'", () => {
    expect(
      titrePropEtapeIdFind(
        'amodiataires',
        titreDemarchesOctAmodiatairesMod.demarches,
        titreDemarchesOctAmodiatairesMod.statutId
      )
    ).toBeNull()
  })
})

import { ITitreDemarche, ITitreEtapeProp } from '../../types'

import {
  titreContenuEtapeFind,
  titrePropEtapeFind
} from './titre-prop-etape-find'

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
} from './__mocks__/titre-prop-etape-find-demarches'

describe("id de l'étape d'une propriété valide (dé-normalise)", () => {
  test("trouve l'id de la dernière étape acceptée de la démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeFind(
        'points',
        titreDemarchesOctPointsMut.demarches,
        titreDemarchesOctPointsMut.statutId
      )?.id
    ).toEqual('h-cx-courdemanges-1989-oct01-dpu01')
  })

  test("ne trouve pas d'id si la dernière étape acceptée de la dernière démarche acceptée possède une propriété 'points' vide", () => {
    expect(
      titrePropEtapeFind(
        'points',
        titreDemarchesOctPointsVides.demarches,
        titreDemarchesOctPointsVides.statutId
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape acceptée de la démarche de mutation acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeFind(
        'points',
        titreDemarchesOctMutPoints.demarches,
        titreDemarchesOctMutPoints.statutId
      )?.id
    ).toEqual('h-cx-courdemanges-1986-mut01-dpu01')
  })

  test("ne trouve pas d'id si aucune étape acceptée ne contient la propriété 'communes'", () => {
    expect(
      titrePropEtapeFind(
        'communes',
        titreDemarchesOctMutPoints.demarches,
        titreDemarchesOctMutPoints.statutId
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape acceptée de la dernière démarche d'octroi en instruction ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeFind(
        'points',
        titreDemarchesOctPointsMutInstruction.demarches,
        titreDemarchesOctPointsMutInstruction.statutId
      )?.id
    ).toEqual('h-cx-courdemanges-1985-oct01-dpu01')
  })

  test("ne trouve pas d'id si l'étape est rejetée", () => {
    expect(
      titrePropEtapeFind(
        'points',
        titreDemarchesOctAccDpuRej.demarches,
        titreDemarchesOctAccDpuRej.statutId
      )
    ).toBeNull()
  })

  test("trouve l'id de la dernière étape de formalisation de la demande de la dernière démarche d'octroi acceptée ayant la propriété 'points'", () => {
    expect(
      titrePropEtapeFind(
        'points',
        titreDemarchesOctMfrPoints.demarches,
        titreDemarchesOctMfrPoints.statutId
      )?.id
    ).toEqual('h-cx-courdemanges-1983-oct01-mfr01')
  })

  test("trouve l'id de la dernière étape de dpu d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient un périmètre et le titre a le statut 'modification en instance' et aucune phase n'est valide", () => {
    expect(
      titrePropEtapeFind(
        'points',
        titreDemarchesProPointsModPhaseEch.demarches,
        titreDemarchesProPointsModPhaseEch.statutId
      )?.id
    ).toEqual('h-cx-courdemanges-1981-pro01-dpu01')
  })

  test("ne trouve pas l'id de la dernière étape de dpu d'une démarche de prolongation ou de demande de titre en instruction car l'étape contient un périmètre et le titre a le statut 'modification en instance' mais la phase est encore valide", () => {
    expect(
      titrePropEtapeFind(
        'points',
        titreDemarchesProPointsModPhaseVal.demarches,
        titreDemarchesProPointsModPhaseVal.statutId
      )
    ).toBeNull()
  })

  test("ne trouve pas l'id de la dernière étape de dpu car aucune démarche de prolongation ou de demande de titre en instruction ne contient de périmètre et le titre a le statut 'modification en instance'", () => {
    expect(
      titrePropEtapeFind(
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
        titrePropEtapeFind(
          prop,
          titreDemarchesProModPhaseEch.demarches,
          titreDemarchesProModPhaseEch.statutId
        )?.id
      ).toEqual('h-cx-courdemanges-1981-pro01-dpu01')
    }
  )

  test.each(['titulaires', 'administrations'] as ITitreEtapeProp[])(
    "ne trouve pas l'id de la mod car la propriété %s n’est pas modifiée par cette étape",
    prop => {
      expect(
        titrePropEtapeFind(
          prop,
          titreDemarchesProModPhaseEch.demarches,
          titreDemarchesProModPhaseEch.statutId
        )?.id
      ).toEqual('h-cx-courdemanges-1981-oct01-dpu01')
    }
  )

  // amodiataires

  test("trouve pas d'id si la démarche de l'étape contenant la propriété 'amodiataires' a une phase valide", () => {
    expect(
      titrePropEtapeFind(
        'amodiataires',
        titreDemarchesOctAmodiatairesPassee.demarches,
        titreDemarchesOctAmodiatairesPassee.statutId
      )?.id
    ).toBe('h-cx-courdemanges-1982-oct01-dpu01')
  })

  test("trouve l'id de dernière étape contenant la propriété 'amodiataires' dont la démarche précédente a une phase valide", () => {
    expect(
      titrePropEtapeFind(
        'amodiataires',
        titreDemarchesOctAmodiatairesValide.demarches,
        titreDemarchesOctAmodiatairesValide.statutId
      )?.id
    ).toEqual('h-cx-courdemanges-1982-amo01-dpu01')
  })

  test("ne trouve pas l'id de la dernière étape contenant la propriété 'amodiataires'", () => {
    expect(
      titrePropEtapeFind(
        'amodiataires',
        titreDemarchesOctAmodiatairesMod.demarches,
        titreDemarchesOctAmodiatairesMod.statutId
      )
    ).toBeNull()
  })
})

describe("id de l'étape qui a un contenu", () => {
  test("retourne null si aucune étape n'est trouvé", () => {
    const etape1 = titreContenuEtapeFind(
      { sectionId: 'arm', elementId: 'mecanisee' },
      [{ id: 'demarche-id', etapes: [{ id: 'etape-id' }] }] as ITitreDemarche[],
      'val'
    )

    const etape2 = titreContenuEtapeFind(
      { sectionId: 'arm', elementId: 'mecanisee' },
      [
        {
          id: 'demarche-id',
          statutId: 'acc',
          etapes: [{ id: 'etape-id', statutId: 'bof' }]
        }
      ] as ITitreDemarche[],
      'val'
    )

    const etape3 = titreContenuEtapeFind(
      { sectionId: 'arm', elementId: 'mecanisee' },
      [
        {
          id: 'demarche-id',
          titreId: 'titre-id',
          typeId: 'pro',
          phase: {
            dateDebut: '2020-01-01',
            dateFin: '2020-01-02',
            statutId: 'val',
            titreDemarcheId: 'demarche-id'
          },
          etapes: [
            {
              id: 'etape-id',
              titreDemarcheId: 'demarche-id',
              typeId: 'dpu',
              date: '2020-01-01',
              statutId: 'acc',
              contenu: { arm: { mecanisee: true } }
            }
          ]
        }
      ] as ITitreDemarche[],
      'mod'
    )

    expect(etape1).toBeNull()
    expect(etape2).toBeNull()
    expect(etape3).toBeNull()
  })

  test("retourne l'id de l'étape si elle existe", () => {
    const etape1 = titreContenuEtapeFind(
      { sectionId: 'arm', elementId: 'mecanisee' },
      [
        {
          id: 'demarche-id',
          titreId: 'titre-id',
          typeId: 'oct',
          etapes: [
            {
              id: 'etape-id',
              titreDemarcheId: 'demarche-id',
              typeId: 'dpu',
              date: '2020-01-03',
              statutId: 'acc',
              contenu: { arm: { mecanisee: true } }
            }
          ]
        },
        {
          id: 'demarche-id-2',
          titreId: 'titre-id',
          typeId: 'pro',
          etapes: [
            {
              id: 'etape-id-2',
              titreDemarcheId: 'demarche-id',
              typeId: 'dex',
              date: '2020-01-01',
              statutId: 'dex'
            }
          ]
        }
      ] as ITitreDemarche[],
      'val'
    )

    const etape2 = titreContenuEtapeFind(
      { sectionId: 'arm', elementId: 'mecanisee' },
      [
        {
          id: 'demarche-id',
          titreId: 'titre-id',
          typeId: 'pro',
          etapes: [
            {
              id: 'etape-id',
              titreDemarcheId: 'demarche-id',
              typeId: 'dpu',
              date: '2020-01-01',
              statutId: 'acc',
              contenu: { arm: { mecanisee: true } }
            }
          ]
        }
      ] as ITitreDemarche[],
      'mod'
    )

    expect(etape1?.id).toEqual('etape-id')
    expect(etape2?.id).toEqual('etape-id')
  })
})

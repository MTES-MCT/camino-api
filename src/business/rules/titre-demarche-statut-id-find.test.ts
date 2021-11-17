import {
  ITitreEtape,
  TitreEtapesTravauxTypes as Travaux,
  DemarchesStatutsTypes as Demarches
} from '../../types'

import { titreDemarcheStatutIdFind } from './titre-demarche-statut-id-find'

const etapesBuild = (etapesProps: Partial<ITitreEtape>[]) =>
  etapesProps.map(
    (etapeProps, i) =>
      ({
        ...etapeProps,
        ordre: i + 1
      } as unknown as ITitreEtape)
  )

describe("statut d'une démarche", () => {
  test('une démarche sans étape a le statut “indéfini”', () => {
    expect(titreDemarcheStatutIdFind('oct', [], 'pxm')).toEqual('ind')
  })

  test("une démarche d'octroi sans étape décisive a le statut “indéfini”", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'anf' }]), 'pxm')
    ).toEqual('ind')
  })

  test("une démarche d'octroi dont l'étape de dpu la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          { typeId: 'dex', statutId: 'acc' },
          { typeId: 'dpu', statutId: 'acc' }
        ]),
        'pxm'
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre AXM dont l'étape de dex la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'dex', statutId: 'acc' }]),
        'axm'
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre ARM dont l'étape de def la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'def', statutId: 'acc' }]),
        'arm'
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre PRM dont l'étape de rpu la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'rpu', statutId: 'acc' }]),
        'prm'
      )
    ).toEqual('acc')
  })

  test("une démarche de prolongation dont l'étape de dpu la plus récente est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'pro',
        etapesBuild([
          { typeId: 'dex', statutId: 'acc' },
          { typeId: 'dpu', statutId: 'acc' }
        ]),
        'pxm'
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi dont l'étape de sco est faite a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'sco', statutId: 'fai' }]),
        'arm'
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre autre qu'ARM dont l'étape de sco est faite a le statut “indéfini”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'sco', statutId: 'fai' }]),
        'pxm'
      )
    ).toEqual('ind')
  })

  test("une démarche d'octroi ne contenant une unique étape de dex acceptée a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'dex', statutId: 'acc' }]),
        'pxm'
      )
    ).toEqual('ins')
  })

  test("une démarche d'octroi contenant une étape de publication acceptée après une dex acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([
          { typeId: 'dex', statutId: 'acc' },
          { typeId: 'dpu', statutId: 'acc' }
        ]),
        'pxm'
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi dont l'unique étape de dex est rejetée a le statut “rejeté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'dex', statutId: 'rej' }]),
        'pxm'
      )
    ).toEqual('rej')
  })

  test("une démarche d'octroi dont l'étape est men a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'men' }]), 'pxm')
    ).toEqual('ind')
  })

  test("une démarche d'octroi d'un titre ARM dont l'étape de mdp (statut fai) a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'mdp', statutId: 'fai' }]),
        'arm'
      )
    ).toEqual('ins')
  })

  test("une démarche d'octroi d'un titre ARM dont l'étape de mcp a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'mcp' }]), 'arm')
    ).toEqual('ins')
  })

  test("une démarche d'octroi d'un titre ARM dont la dernière étape de def est acceptée a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'def', statutId: 'acc' }]),
        'arm'
      )
    ).toEqual('acc')
  })

  test("une démarche d'octroi d'un titre ARM dont la dernière étape de def est rejetée a le statut “rejeté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'def', statutId: 'rej' }]),
        'arm'
      )
    ).toEqual('rej')
  })

  test("une démarche d'octroi d'un titre autre qu'ARM dont la dernière étape est une def a le statut “indéfini”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'def', statutId: 'rej' }]),
        'prh'
      )
    ).toEqual('ind')
  })

  test("une démarche d'octroi dont l'étape la plus récente est des a le statut “désisté”", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'des' }]), 'pxm')
    ).toEqual('des')
  })

  test("une démarche d'octroi dont l'étape la plus récente est mdp (statut fai) a le statut “déposé”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'mdp', statutId: 'fai' }]),
        'pxm'
      )
    ).toEqual('dep')
  })

  test("une démarche d'octroi dont l'étape la plus récente est mfr a le statut “en construction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'mfr', statutId: 'aco' }]),
        'pxm'
      )
    ).toEqual('eco')
  })

  test("une démarche d'octroi dont l'étape la plus récente est mcr a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'mcr' }]), 'pxm')
    ).toEqual('ins')
  })

  test("une démarche d'octroi dont l'étape la plus récente est css a le statut “classé sans suite”", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'css' }]), 'pxm')
    ).toEqual('cls')
  })

  test("une démarche d'octroi dont l'étape la plus récente d'aca est défavorable a le statut “rejeté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'aca', statutId: 'def' }]),
        'arm'
      )
    ).toEqual('rej')
  })

  test("une démarche d'octroi dont l'étape la plus récente d'aca est favorable reste “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'aca', statutId: 'acc' }]),
        'arm'
      )
    ).toEqual('ins')
  })

  test('une démarche de retrait sans aucune étape décisive a le statut “indéterminé”', () => {
    expect(
      titreDemarcheStatutIdFind('ret', etapesBuild([{ typeId: 'xxx' }]), 'pxm')
    ).toEqual('ind')
  })

  test("une démarche de retrait dont l'étape la plus récente de dup a été faite a le statut “terminé”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'dup', statutId: 'fai' }]),
        'pxm'
      )
    ).toEqual('ter')
  })

  test("une démarche de retrait dont l'étape la plus récente est ide faite a le statut “initié”", () => {
    expect(
      titreDemarcheStatutIdFind('ret', etapesBuild([{ typeId: 'ide' }]), 'pxm')
    ).toEqual('ini')
  })

  test("une démarche de retrait dont l'étape la plus récente est spp a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind('ret', etapesBuild([{ typeId: 'spp' }]), 'pxm')
    ).toEqual('ins')
  })

  test("une démarche de retrait dont l'étape la plus récente est eof a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'ide' }, { typeId: 'eof' }]),
        'pxm'
      )
    ).toEqual('ins')
  })

  test("une démarche de retrait dont l'étape la plus récente est aco a le statut “terminé”", () => {
    expect(
      titreDemarcheStatutIdFind('ret', etapesBuild([{ typeId: 'aco' }]), 'pxm')
    ).toEqual('ter')
  })

  test("une démarche de retrait dont l'étape la plus récente est aof refusée a le statut “css”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'ret',
        etapesBuild([{ typeId: 'aof', statutId: 'def' }]),
        'pxm'
      )
    ).toEqual('cls')
  })

  test("une démarche de retrait dont l'étape la plus récente de css a été faite a le statut “classé sans suite”", () => {
    expect(
      titreDemarcheStatutIdFind('ret', etapesBuild([{ typeId: 'css' }]), 'pxm')
    ).toEqual('cls')
  })

  test("une démarche de demande dont l'étape la plus récente est spp ne change pas de statut", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'spp' }]), 'pxm')
    ).toEqual('ind')
  })

  test("une démarche dont l'étape la plus récente est de type “retrait de la décision” a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'rtd' }]), 'pxm')
    ).toEqual('ins')
  })

  test("une démarche dont l'étape la plus récente est de type “abrogation de la décision” a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind('oct', etapesBuild([{ typeId: 'abd' }]), 'pxm')
    ).toEqual('ins')
  })

  test("une démarche dont l'étape la plus récente d'annulation de la décision est favorable a le statut “en instruction”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'and', statutId: 'fai' }]),
        'pxm'
      )
    ).toEqual('ins')
  })

  test("une démarche dont l'étape la plus récente d'annulation de la décision est favorable a le statut “accepté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'and', statutId: 'acc' }]),
        'pxm'
      )
    ).toEqual('acc')
  })

  test("une démarche dont l'étape la plus récente d'annulation de la décision est favorable a le statut “rejeté”", () => {
    expect(
      titreDemarcheStatutIdFind(
        'oct',
        etapesBuild([{ typeId: 'and', statutId: 'rej' }]),
        'pxm'
      )
    ).toEqual('rej')
  })

  test('une démarche inexistante a le statut “indéfini”', () => {
    expect(
      titreDemarcheStatutIdFind('xxx', etapesBuild([{ typeId: 'mfr' }]), 'pxm')
    ).toEqual('ind')
  })

  test.each`
    etapeTypeId                               | statutId | resultId
    ${Travaux.DemandeAutorisationOuverture}   | ${'fai'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}                   | ${'def'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}                   | ${'fav'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrescriptionsDemandeur}     | ${'def'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrescriptionsDemandeur}     | ${'fav'} | ${Demarches.Accepte}
    ${Travaux.PubliDecisionRecueilActesAdmin} | ${'fai'} | ${Demarches.Accepte}
    ${Travaux.Abandon}                        | ${'fai'} | ${Demarches.Desiste}
  `(
    "pour une démarche de travaux de type 'aom' sur un titre, dont l'étape récente est $etapeTypeId au statut $statutId, le résultat est $resultId",
    ({ etapeTypeId, statutId, resultId }) => {
      expect(
        titreDemarcheStatutIdFind(
          'aom',
          etapesBuild([{ typeId: etapeTypeId, statutId }]),
          'pxm'
        )
      ).toEqual(resultId)
    }
  )

  test.each`
    etapeTypeId                           | statutId | resultId
    ${Travaux.DeclarationOuverture}       | ${'def'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}               | ${'def'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}               | ${'fav'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrescriptionsDemandeur} | ${'def'} | ${Demarches.EnInstruction}
    ${Travaux.AvisPrescriptionsDemandeur} | ${'fav'} | ${Demarches.Accepte}
    ${Travaux.DonneActeDeclaration}       | ${'fai'} | ${Demarches.Accepte}
    ${Travaux.Abandon}                    | ${'fai'} | ${Demarches.Desiste}
  `(
    "pour une démarche de travaux de type $demarcheTypeId sur un titre, dont l'étape récente est $etapeTypeId au statut $statutId, le résultat est $resultId",
    ({ etapeTypeId, statutId, resultId }) => {
      expect(
        titreDemarcheStatutIdFind(
          'dot',
          etapesBuild([{ typeId: etapeTypeId, statutId }]),
          'pxm'
        )
      ).toEqual(resultId)
    }
  )

  test.each`
    etapeTypeId                               | statutId | resultId
    ${Travaux.DeclarationArret}               | ${'def'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}                   | ${'def'} | ${Demarches.Depose}
    ${Travaux.Recevabilite}                   | ${'fav'} | ${Demarches.EnInstruction}
    ${Travaux.Recolement}                     | ${'fav'} | ${Demarches.FinPoliceMines}
    ${Travaux.Recolement}                     | ${'def'} | ${Demarches.EnInstruction}
    ${Travaux.ArretePrefectDonneActe2}        | ${'fav'} | ${Demarches.FinPoliceMines}
    ${Travaux.PubliDecisionRecueilActesAdmin} | ${'fav'} | ${Demarches.FinPoliceMines}
  `(
    "pour une démarche de travaux de type $demarcheTypeId sur un titre, dont l'étape récente est $etapeTypeId au statut $statutId, le résultat est $resultId",
    ({ etapeTypeId, statutId, resultId }) => {
      expect(
        titreDemarcheStatutIdFind(
          'dam',
          etapesBuild([{ typeId: etapeTypeId, statutId }]),
          'pxm'
        )
      ).toEqual(resultId)
    }
  )
})

import { ITitreEtape } from '../../types'

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

  test.each([
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "demande d'autorisation d'ouverture de travaux miniers (AOTM)",
      'wfa',
      'déposé',
      'dep'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'dépot de la demande',
      'wdd',
      'déposé',
      'dep'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'demande de compléments (AOT)',
      'wdc',
      'déposé',
      'dep'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'reception de compléments',
      'wrc',
      'déposé',
      'dep'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'Recevabilité',
      'wre',
      'déposé',
      'dep'
    ],

    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'avis de réception',
      'war',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "saisine de l'autorité environnementale",
      'wse',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "avis de l'autorité environnementale",
      'wae',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "saisine des services de l'Etat",
      'wss',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "avis d'un service administratif local",
      'wal',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'avis de la direction départementale des territoires et de la mer - DDT(M)',
      'wad',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "avis de l'autorité militaire",
      'wam',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "avis de l'agence régionale de santé - ARS",
      'was',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'avis de direction régionale des affaires culturelles - DRAC',
      'wac',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'avis du préfet maritime',
      'wap',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'avis des autres instances',
      'wai',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "memoire en réponse de l'exploitant (par rapport à l'avis de l'AE)",
      'wmm',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "ouverture de l'enquête publique",
      'woe',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "clôture de l'enquête publique",
      'wce',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "avis et rapport du directeur régional chargé de l'environnement, de l'aménagement et du logement",
      'wrl',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'transmission du projet de prescriptions au demandeur',
      'wtp',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      "avis du conseil départemental de l'environnement et des risques sanitaires et technologiques (Coderst)",
      'wat',
      'en instruction',
      'ins'
    ],
    [
      "autorisation d'ouverture de travaux",
      'aom',
      "permis d'exploitation (minéraux et métaux)",
      'pxm',
      'avis du demandeur sur les prescriptions proposées',
      'wau',
      'en instruction',
      'ins'
    ]
  ])(
    "une démarche de travaux de type “%s” (%s) dans un titre de type “%s” (%s), dont l'étape la plus récente est “%s” (%s) a le statut “%s” (%s)",
    (
      demarcheTypeLabel: string,
      demarcheTypeId: string,
      titreTypeLabel: string,
      titreTypeId: string,
      etapeTypeLabel: string,
      etapeTypeId: string,
      statutLabel: string,
      statutId: string
    ) => {
      expect(
        titreDemarcheStatutIdFind(
          demarcheTypeId,
          etapesBuild([{ typeId: etapeTypeId }]),
          titreTypeId
        )
      ).toEqual(statutId)
    }
  )
})

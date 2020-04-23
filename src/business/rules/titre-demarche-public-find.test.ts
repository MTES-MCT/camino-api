import { ITitreEtape } from '../../types'

import titreDemarchePublicFind from './titre-demarche-public-find'

const etapesBuild = (etapesProps: Partial<ITitreEtape>[]) =>
  etapesProps.map(
    (etapeProps, i) =>
      (({
        ...etapeProps,
        ordre: i + 1
      } as unknown) as ITitreEtape)
  )

describe("public d'une démarche", () => {
  test("une démarche sans étape n'est pas publique", () => {
    expect(titreDemarchePublicFind('oct', [], [])).toMatchObject({
      publicLecture: false,
      entrepriseLecture: false
    })
  })

  test("une démarche d'octroi sans étape décisive n'est pas publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'mdp' }]))
    ).toMatchObject({ publicLecture: false, entrepriseLecture: false })
  })

  test("une démarche de retrait dont l'étape la plus récente est une saisine du préfet est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'spp' }]))
    ).toMatchObject({ publicLecture: false, entrepriseLecture: false })
  })

  test("une démarche de retrait dont l'étape la plus récente est une saisine du préfet est publique", () => {
    expect(
      titreDemarchePublicFind('ret', [], etapesBuild([{ typeId: 'spp' }]))
    ).toMatchObject({ publicLecture: true, entrepriseLecture: true })
  })

  test("une démarche de déchéance dont l'étape la plus récente est une saisine du préfet est publique", () => {
    expect(
      titreDemarchePublicFind('dec', [], etapesBuild([{ typeId: 'spp' }]))
    ).toMatchObject({ publicLecture: true, entrepriseLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une demande est visible par l'entreprise", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'mfr' }]))
    ).toMatchObject({ publicLecture: false, entrepriseLecture: true })
  })

  test("une démarche dont l'étape la plus récente est classement sans suite n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'css' }, { typeId: 'mfr' }])
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche d'un titre AXM dont l'étape la plus récente est classement sans suite ne change pas de visibilité", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'mcr' }, { typeId: 'css' }]),
        'axm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est classement sans suite ne change pas de visibilité", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'sca' }, { typeId: 'css' }]),
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche ne pouvant pas faire l'objet d'une mise en concurrence dont l'étape la plus récente est une recevabilité est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'mcr' }]))
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM ne pouvant pas faire l'objet d'une mise en concurrence dont l'étape la plus récente est une recevabilité n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'mcr' }]),
        'arm'
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche pouvant faire l'objet d'une mise en concurrence dont l'étape la plus récente est une recevabilité n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [{ id: 'anf', nom: 'anf', ordre: 1 }],
        etapesBuild([{ typeId: 'mcr' }])
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche dont l'étape la plus récente est une mise en concurrence au JORF est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'anf' }]))
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une publication de l'avis de décision implicite (historique) est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'apu' }]))
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une mise en concurrence au JOUE est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'ane' }]))
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une participation du public est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'ppu' }]))
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est une décision de l'ONF peu importe son statut (historique) est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'def' }]),
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est une commission ARM peu importe son statut (historique) est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'aca' }]),
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est une saisine de la commission ARM est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'sca' }]),
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une décision implicite au statut accepté est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dim', statutId: 'acc' }])
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une décision implicite au statut rejeté n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dim', statutId: 'rej' }])
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche d'un titre non AXM dont l'étape la plus récente est une décision de l'administration au statut rejeté n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dex', statutId: 'rej' }])
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("une démarche d'un titre AXM dont l'étape la plus récente est une décision de l'administration au statut rejeté est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'mcr' }, { typeId: 'dex', statutId: 'rej' }]),
        'axm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre AXM dont l'étape la plus récente est une décision de l'administration au statut accepté est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dex', statutId: 'acc' }]),
        'axm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une publication de décision au JORF au statut au statut accepté publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'dpu', statutId: 'acc' }])
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une décision unilatérale est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'dux' }]))
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une publication de décision unilatérale est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'dup' }]))
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une publication de décision au recueil des actes administratifs est publique", () => {
    expect(
      titreDemarchePublicFind('oct', [], etapesBuild([{ typeId: 'rpu' }]))
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est une signature de l'autorisation de recherche minière est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'sco' }]),
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche d'un titre ARM dont l'étape la plus récente est une signature de l'avenant à l'autorisation de recherche minière est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'sco' }]),
        'arm'
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une décision d'annulation par le juge administratif est publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'and', statutId: 'fav' }])
      )
    ).toMatchObject({ publicLecture: true })
  })

  test("une démarche dont l'étape la plus récente est une décision d'annulation par le juge administratif au statut fait n'est pas publique", () => {
    expect(
      titreDemarchePublicFind(
        'oct',
        [],
        etapesBuild([{ typeId: 'and', statutId: 'fai' }])
      )
    ).toMatchObject({ publicLecture: false })
  })
})

import { ITitreDemarche } from '../../types'

import titrePublicFind from './titre-public-find'

const demarchesBuild = (etapesProps: Partial<ITitreDemarche>[]) =>
  etapesProps.map(
    (etapeProps, i) =>
      (({
        ...etapeProps,
        ordre: i + 1
      } as unknown) as ITitreDemarche)
  )

describe("public d'un titre", () => {
  test('un titre est toujours visible par son demandeur ou titulaire', () => {
    expect(titrePublicFind('prm', 'dmi', [], [])).toMatchObject({
      entrepriseLecture: true
    })
  })

  test("un titre sans étape n'est pas public", () => {
    expect(titrePublicFind('prm', 'dmi', [], [])).toMatchObject({
      publicLecture: false
    })
  })

  test("un titre sans autorisation de statut n'est pas public", () => {
    expect(titrePublicFind('prm', 'dmi', [], [])).toMatchObject({
      publicLecture: false
    })
  })

  test("un titre dont l'autorisation pour son statut est mise à `false` n'est pas public", () => {
    expect(
      titrePublicFind(
        'prm',
        'dmi',
        [{ titreTypeId: 'prm', titreStatutId: 'dmi', publicLecture: false }],
        []
      )
    ).toMatchObject({
      publicLecture: false
    })
  })

  test("un titre dont l'autorisation pour son statut est mise à `true` et dont la démarche d'octroi n'est pas publique n'est pas public", () => {
    expect(
      titrePublicFind(
        'prm',
        'dmi',
        [{ titreTypeId: 'prm', titreStatutId: 'dmi', publicLecture: true }],
        demarchesBuild([{ typeId: 'oct', publicLecture: false }])
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("un titre dont l'autorisation pour son statut est mise à `true` et qui n'a pas de démarche d'octroi n'est pas public", () => {
    expect(
      titrePublicFind(
        'prm',
        'dmi',
        [{ titreTypeId: 'prm', titreStatutId: 'dmi', publicLecture: true }],
        demarchesBuild([{ typeId: 'pro', publicLecture: true }])
      )
    ).toMatchObject({ publicLecture: false })
  })

  test("un titre dont l'autorisation pour son statut est mise à `true` et dont la démarche d'octroi est publique est public", () => {
    expect(
      titrePublicFind(
        'prm',
        'dmi',
        [{ titreTypeId: 'prm', titreStatutId: 'dmi', publicLecture: true }],
        demarchesBuild([{ typeId: 'oct', publicLecture: true }])
      )
    ).toMatchObject({ publicLecture: true })
  })
})

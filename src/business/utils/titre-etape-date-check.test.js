import titreEtapeDateCheck from './titre-etape-date-check'
import {
  titreEtapeHistorique,
  titreEtapeAucuneRestriction,
  titreDemarcheAucuneRestriction,
  titreEtapeAnterieureAvant,
  titreEtapeAnterieureApres,
  titreDemarcheAnterieure,
  titreEtapePosterieureApres,
  titreEtapePosterieureAvant,
  titreDemarchePosterieure,
  titreEtapePremiereApres,
  titreEtapePremiereAvant,
  titreDemarchePremiere,
  titreEtapeMecanisee,
  titreDemarcheMecanisee,
  titreAutre,
  titreArm,
  titreArmMecanisee
} from './__mocks__/titre-etape-date-check-titres'

jest.mock('./titre-etapes-types-restrictions', () => ({
  default: [
    null,
    {},
    { condition: null },
    { condition: {} },
    {
      condition: { etape: { typeId: 'etape-avant' } },
      obligatoireApresUne: {
        typeId: 'etape-anterieure',
        statutId: ['ok', 'ko']
      },
      impossibleApresUne: null
    },
    {
      condition: { etape: { typeId: 'etape-apres' } },
      obligatoireApresUne: null,
      impossibleApresUne: { typeId: 'etape-posterieure' }
    },
    {
      condition: { etape: { typeId: 'etape-premiere' } },
      obligatoireApresUne: null,
      impossibleApresUne: '*'
    },
    {
      condition: {
        etape: { typeId: 'etape-mecanisee' },
        titre: { contenu: { onf: { mecanisee: true } } }
      },
      obligatoireApresUne: null,
      impossibleApresUne: { propArray: [1, 2] }
    }
  ]
}))

describe("vérifie la date d'une étape pour une démarche en fonction des autres étapes d'une démarche", () => {
  test("un titre de type autre que ARM n'est pas validé", () => {
    expect(titreEtapeDateCheck({}, {}, titreAutre)).toBeNull()
  })

  test("une étape historique dont la date est antérieure au 31 octobre 2019 n'est pas validée", () => {
    expect(titreEtapeDateCheck(titreEtapeHistorique, {}, titreArm)).toBeNull()
  })

  test('aucune restriction', () => {
    expect(
      titreEtapeDateCheck(
        titreEtapeAucuneRestriction,
        titreDemarcheAucuneRestriction,
        titreArm
      )
    ).toBeNull()
  })

  test('anterieure apres', () => {
    expect(
      titreEtapeDateCheck(
        titreEtapeAnterieureAvant,
        titreDemarcheAnterieure,
        titreArm
      )
    ).toEqual(
      "Une étape « etape-anterieure » antérieure est nécessaire pour la création d'une étape « etape-avant »."
    )
  })

  test('anterieure avant', () => {
    expect(
      titreEtapeDateCheck(
        titreEtapeAnterieureApres,
        titreDemarcheAnterieure,
        titreArm
      )
    ).toBeNull()
  })

  test('posterieure apres', () => {
    expect(
      titreEtapeDateCheck(
        titreEtapePosterieureApres,
        titreDemarchePosterieure,
        titreArm
      )
    ).toEqual(
      'Une étape « etape-apres » ne peut être créée après une étape « etape-posterieure ».'
    )
  })

  test('posterieure avant', () => {
    expect(
      titreEtapeDateCheck(
        titreEtapePosterieureAvant,
        titreDemarchePosterieure,
        titreArm
      )
    ).toBeNull()
  })

  test('premiere après', () => {
    expect(
      titreEtapeDateCheck(
        titreEtapePremiereApres,
        titreDemarchePremiere,
        titreArm
      )
    ).toEqual(
      'Une étape « etape-premiere » ne peut être créée après aucune autre étape.'
    )
  })

  test('premiere avant', () => {
    expect(
      titreEtapeDateCheck(
        titreEtapePremiereAvant,
        titreDemarchePremiere,
        titreArm
      )
    ).toBeNull()
  })

  test('mecanisee', () => {
    expect(
      titreEtapeDateCheck(
        titreEtapeMecanisee,
        titreDemarcheMecanisee,
        titreArmMecanisee
      )
    ).toBeNull()
  })
})

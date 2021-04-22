import {
  IEntreprise,
  IHeritageProps,
  ITitreEtape,
  ITitrePoint
} from '../../types'

import {
  titreEtapeHeritagePropsFind,
  titreEtapePropsIds
} from './titre-etape-heritage-props-find'

import { objectClone } from '../../tools/index'

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe('retourne l’étape en fonction de son héritage', () => {
  test('l’étape n’est pas modifiée si elle n’a pas d’étape précédente et qu’elle n’a aucun héritage d’actif', () => {
    const titreEtape = {
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    expect(titreEtapeHeritagePropsFind(titreEtape)).toEqual({
      hasChanged: false,
      titreEtape
    })
  })

  test.each`
    propId         | heritageValeur  | etapeValeur
    ${'surface'}   | ${3}            | ${2}
    ${'duree'}     | ${10}           | ${20}
    ${'dateDebut'} | ${'2020-01-01'} | ${'2023-01-01'}
    ${'dateFin'}   | ${'2021-01-01'} | ${'2021-03-01'}
  `(
    'l’étape est modifiée si elle a une étape précédente et qu’elle au moins un héritage non renseigné',
    ({
      propId,
      heritageValeur,
      etapeValeur
    }: {
      propId: keyof ITitreEtape
      heritageValeur: any
      etapeValeur: any
    }) => {
      const titreEtapePrecedente = {
        id: 'titreEtapePrecedenteId',
        heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
          acc[prop] = { actif: false, etapeId: null }

          return acc
        }, {} as IHeritageProps)
      } as ITitreEtape
      // @ts-ignore
      titreEtapePrecedente[propId] = heritageValeur

      const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
      titreEtape.heritageProps![propId].actif = true
      titreEtape[propId] = etapeValeur
      titreEtape.id = 'titreEtapeId'

      const titreEtapeNew = objectClone(titreEtape) as ITitreEtape
      titreEtapeNew[propId] = heritageValeur
      titreEtapePropsIds.forEach(
        prop =>
          (titreEtapeNew.heritageProps![prop].etapeId = titreEtapePrecedente.id)
      )

      expect(
        titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
      ).toEqual({
        hasChanged: true,
        titreEtape: titreEtapeNew
      })
    }
  )

  test('l’étape n’est pas modifiée si pas de changement sur les titulaires', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      titulaires: [{ id: 'toto' }, { id: 'tata' }] as IEntreprise[],
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
    titreEtape.heritageProps!.titulaires.actif = true
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop =>
        (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
    )

    expect(
      titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: false,
      titreEtape
    })
  })

  test.each(['titulaires', 'amodiataires', 'substances'])(
    'l’étape est modifiée si changement sur les $propId',
    propId => {
      const titreEtapePrecedente = {
        id: 'titreEtapePrecedenteId',
        heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
          acc[prop] = { actif: false, etapeId: null }

          return acc
        }, {} as IHeritageProps)
      } as ITitreEtape
      // @ts-ignore
      titreEtapePrecedente[propId] = [{ id: 'toto' }, { id: 'tata' }]

      const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
      titreEtape.heritageProps![propId].actif = true
      titreEtape.id = 'titreEtapeId'
      titreEtapePropsIds.forEach(
        prop =>
          (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
      )
      titreEtape[propId] = [{ id: 'haha' }, { id: 'toto' }]

      const titreEtapeNew = objectClone(titreEtape) as ITitreEtape
      titreEtapeNew[propId] = [{ id: 'toto' }, { id: 'tata' }]

      expect(
        titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
      ).toEqual({
        hasChanged: true,
        titreEtape: titreEtapeNew
      })
    }
  )

  test('l’étape est modifiée si il y a un titulaire en moins', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      titulaires: [{ id: 'toto' }] as IEntreprise[],
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
    titreEtape.heritageProps!.titulaires.actif = true
    titreEtape.titulaires = [{ id: 'haha' }, { id: 'toto' }] as IEntreprise[]
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop =>
        (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
    )

    const titreEtapeNew = objectClone(titreEtape) as ITitreEtape
    titreEtapeNew.titulaires = [{ id: 'toto' }] as IEntreprise[]

    expect(
      titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: true,
      titreEtape: titreEtapeNew
    })
  })

  test('l’étape est modifiée si on récupère l’héritage déjà présent sur l’étape précédente', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      titulaires: [{ id: 'toto' }, { id: 'tata' }] as IEntreprise[],
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: true, etapeId: 'premiereEtapeId' }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop =>
        (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
    )

    const titreEtapeNew = objectClone(titreEtape) as ITitreEtape
    titreEtapePropsIds.forEach(
      prop => (titreEtapeNew.heritageProps![prop].etapeId = 'premiereEtapeId')
    )

    expect(
      titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: true,
      titreEtape: titreEtapeNew
    })
  })

  test('l’étape n’est pas modifiée si pas de changement sur les points', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      points: ([
        { coordonnees: { x: 1, y: 2 } },
        { coordonnees: { x: 2, y: 3 } }
      ] as unknown) as ITitrePoint[],
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
    titreEtape.heritageProps!.points.actif = true
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop =>
        (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
    )

    expect(
      titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: false,
      titreEtape
    })
  })

  test('l’étape est modifiée si changement sur les points', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      points: ([
        { id: '1', coordonnees: { x: 1, y: 2 }, references: [{ id: '23' }] },
        { id: '2', coordonnees: { x: 2, y: 3 }, references: [] }
      ] as unknown) as ITitrePoint[],
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
    titreEtape.heritageProps!.points.actif = true
    titreEtape.id = 'titreEtapeId'
    titreEtape.points = ([
      { id: '3', coordonnees: { x: 1, y: 2 } },
      { id: '4', coordonnees: { x: 2, y: 4 } }
    ] as unknown) as ITitrePoint[]
    titreEtapePropsIds.forEach(
      prop =>
        (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
    )

    const newTitreEtape = objectClone(titreEtape) as ITitreEtape
    newTitreEtape.points = titreEtapePrecedente.points

    expect(
      titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: true,
      titreEtape: newTitreEtape
    })
  })

  test('l’étape est modifiée si changement d’incertitude', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      incertitudes: { surface: true },
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
    titreEtape.heritageProps!.surface.actif = true
    titreEtape.incertitudes = {}
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop =>
        (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
    )

    const newTitreEtape = objectClone(titreEtape) as ITitreEtape
    newTitreEtape.incertitudes = { surface: true }

    expect(
      titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: true,
      titreEtape: newTitreEtape
    })
  })

  test('l’étape est modifiée si suppression de l’incertitude', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
    titreEtape.heritageProps!.surface.actif = true
    titreEtape.incertitudes = { surface: true }
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop =>
        (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
    )

    const newTitreEtape = objectClone(titreEtape) as ITitreEtape
    newTitreEtape.incertitudes = null

    expect(
      titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: true,
      titreEtape: newTitreEtape
    })
  })

  test('l’étape est modifiée si ajout de l’incertitude', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      incertitudes: { surface: true },
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente) as ITitreEtape
    titreEtape.heritageProps!.surface.actif = true
    titreEtape.incertitudes = null
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop =>
        (titreEtape.heritageProps![prop].etapeId = titreEtapePrecedente.id)
    )

    const newTitreEtape = objectClone(titreEtape) as ITitreEtape
    newTitreEtape.incertitudes = { surface: true }

    expect(
      titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: true,
      titreEtape: newTitreEtape
    })
  })

  test('l’héritage est désactivé si l’étape précédente n’existe plus', () => {
    const titreEtape = {
      id: 'titreEtapeId',
      heritageProps: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: true, etapeId: 'prevTitreEtapeId' }

        return acc
      }, {} as IHeritageProps)
    } as ITitreEtape

    const newTitreEtape = objectClone(titreEtape) as ITitreEtape
    newTitreEtape.heritageProps = titreEtapePropsIds.reduce((acc, prop) => {
      acc[prop] = { actif: false, etapeId: undefined }

      return acc
    }, {} as IHeritageProps)

    expect(titreEtapeHeritagePropsFind(titreEtape, null)).toEqual({
      hasChanged: true,
      titreEtape: newTitreEtape
    })
  })
})

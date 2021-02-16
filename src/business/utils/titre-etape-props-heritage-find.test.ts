import {
  titreEtapePropsHeritageFind,
  titreEtapePropsIds
} from './titre-etape-props-heritage-find'
import { IEntreprise, IPropsHeritage, ITitreEtape } from '../../types'
import { objectClone } from '../../tools'

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe('retourne l’étape en fonction de son héritage', () => {
  test('l’étape n’est pas modifiée si elle n’a pas d’étape précédente et qu’elle n’a aucun héritage d’actif', () => {
    const titreEtape = {
      propsHeritage: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IPropsHeritage)
    } as ITitreEtape

    expect(titreEtapePropsHeritageFind(titreEtape)).toEqual({
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
        propsHeritage: titreEtapePropsIds.reduce((acc, prop) => {
          acc[prop] = { actif: false, etapeId: null }

          return acc
        }, {} as IPropsHeritage)
      } as ITitreEtape
      // @ts-ignore
      titreEtapePrecedente[propId] = heritageValeur

      const titreEtape = objectClone(titreEtapePrecedente)
      titreEtape.propsHeritage[propId].actif = true
      titreEtape[propId] = etapeValeur
      titreEtape.id = 'titreEtapeId'

      const titreEtapeNew = objectClone(titreEtape)
      titreEtapeNew[propId] = heritageValeur
      titreEtapePropsIds.forEach(
        prop =>
          (titreEtapeNew.propsHeritage[prop].etapeId = titreEtapePrecedente.id)
      )

      expect(
        titreEtapePropsHeritageFind(titreEtape, titreEtapePrecedente)
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
      propsHeritage: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IPropsHeritage)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente)
    titreEtape.propsHeritage.titulaires.actif = true
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop => (titreEtape.propsHeritage[prop].etapeId = titreEtapePrecedente.id)
    )

    expect(
      titreEtapePropsHeritageFind(titreEtape, titreEtapePrecedente)
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
        propsHeritage: titreEtapePropsIds.reduce((acc, prop) => {
          acc[prop] = { actif: false, etapeId: null }

          return acc
        }, {} as IPropsHeritage)
      } as ITitreEtape
      // @ts-ignore
      titreEtapePrecedente[propId] = [{ id: 'toto' }, { id: 'tata' }]

      const titreEtape = objectClone(titreEtapePrecedente)
      titreEtape.propsHeritage[propId].actif = true
      titreEtape.id = 'titreEtapeId'
      titreEtapePropsIds.forEach(
        prop =>
          (titreEtape.propsHeritage[prop].etapeId = titreEtapePrecedente.id)
      )
      titreEtape[propId] = [{ id: 'haha' }, { id: 'toto' }]

      const titreEtapeNew = objectClone(titreEtape)
      titreEtapeNew[propId] = [{ id: 'toto' }, { id: 'tata' }]

      expect(
        titreEtapePropsHeritageFind(titreEtape, titreEtapePrecedente)
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
      propsHeritage: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: false, etapeId: null }

        return acc
      }, {} as IPropsHeritage)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente)
    titreEtape.propsHeritage.titulaires.actif = true
    titreEtape.titulaires = [{ id: 'haha' }, { id: 'toto' }] as IEntreprise[]
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop => (titreEtape.propsHeritage[prop].etapeId = titreEtapePrecedente.id)
    )

    const titreEtapeNew = objectClone(titreEtape)
    titreEtapeNew.titulaires = [{ id: 'toto' }] as IEntreprise[]

    expect(
      titreEtapePropsHeritageFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: true,
      titreEtape: titreEtapeNew
    })
  })

  test('l’étape est modifiée si on récupère l’héritage déjà présent sur l’étape précédente', () => {
    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      titulaires: [{ id: 'toto' }, { id: 'tata' }] as IEntreprise[],
      propsHeritage: titreEtapePropsIds.reduce((acc, prop) => {
        acc[prop] = { actif: true, etapeId: 'premiereEtapeId' }

        return acc
      }, {} as IPropsHeritage)
    } as ITitreEtape

    const titreEtape = objectClone(titreEtapePrecedente)
    titreEtape.id = 'titreEtapeId'
    titreEtapePropsIds.forEach(
      prop => (titreEtape.propsHeritage[prop].etapeId = titreEtapePrecedente.id)
    )

    const titreEtapeNew = objectClone(titreEtape)
    titreEtapePropsIds.forEach(
      prop => (titreEtapeNew.propsHeritage[prop].etapeId = 'premiereEtapeId')
    )

    expect(
      titreEtapePropsHeritageFind(titreEtape, titreEtapePrecedente)
    ).toEqual({
      hasChanged: true,
      titreEtape: titreEtapeNew
    })
  })
})

/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ISectionElement } from '../../../types'

import { heritageContenuValidate } from './heritage-contenu-validate'

describe('vérifie la structure json de heritageContenu', () => {
  test('la structure est correcte', () => {
    expect(heritageContenuValidate([], {})).toHaveLength(0)
    expect(heritageContenuValidate(null, {})).toHaveLength(0)
    expect(heritageContenuValidate([], null)).toHaveLength(0)
    expect(
      heritageContenuValidate(
        [{ id: 'section', elements: [{ id: 'element' }] as ISectionElement[] }],
        { section: { element: { actif: true } } }
      )
    ).toHaveLength(0)
    expect(
      heritageContenuValidate(
        [{ id: 'section', elements: [{ id: 'element' }] as ISectionElement[] }],
        { section: { element: { actif: false } } }
      )
    ).toHaveLength(0)
  })

  test('la structure n’est pas correcte car l’héritage est absent', () => {
    expect(
      heritageContenuValidate(
        [{ id: 'section', elements: [{ id: 'element' }] as ISectionElement[] }],
        null
      )
    ).toContain('la section "section" n’a pas d’héritage')
  })

  test('la structure n’est pas correcte car il y a une section manquante', () => {
    expect(
      heritageContenuValidate(
        [{ id: 'section', elements: [{ id: 'element' }] as ISectionElement[] }],
        {}
      )
    ).toContain('la section "section" n’a pas d’héritage')
  })

  test('la structure n’est pas correcte car il y a une section en trop', () => {
    expect(
      heritageContenuValidate([], {
        section: { element: { actif: true } }
      })
    ).toContain('la section "section" est inconnue')
  })

  test('la structure n’est pas correcte car il y a un element inconnu dans une section', () => {
    expect(
      heritageContenuValidate(
        [{ id: 'section', elements: [{ id: 'element' }] as ISectionElement[] }],
        {
          section: { element: { actif: true }, toto: { actif: true } }
        }
      )
    ).toContain('l’élement "toto" de la section "section" est inconnu')
  })

  test('la structure n’est pas correcte car il y a un element en trop dans une section', () => {
    expect(
      heritageContenuValidate(
        [
          {
            id: 'section',
            elements: [{ id: 'element' }, { id: 'toto' }] as ISectionElement[]
          }
        ],
        {
          section: { element: { actif: true } }
        }
      )
    ).toContain('l’élement "toto" de la section "section" n’a pas d’héritage')
  })

  test('la structure n’est pas correcte car il y a un champ en trop dans un élément', () => {
    expect(
      heritageContenuValidate(
        [{ id: 'section', elements: [{ id: 'element' }] as ISectionElement[] }],
        {
          // @ts-ignore
          section: { element: { actif: true, toto: 1 } }
        }
      )
    ).toContain(
      'le champ "toto" de l’élement "element" de la section "section" est inconnu'
    )
  })

  test('la structure n’est pas correcte car le champ actif d’un élément n’est pas un booléen', () => {
    expect(
      heritageContenuValidate(
        [{ id: 'section', elements: [{ id: 'element' }] as ISectionElement[] }],
        {
          // @ts-ignore
          section: { element: { actif: 'toto' } }
        }
      )
    ).toContain(
      'le champ "actif" de l’élement "element" de la section "section" doit être un booléen'
    )
  })
})

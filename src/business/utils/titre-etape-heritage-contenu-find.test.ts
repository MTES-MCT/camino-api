import { mocked } from 'ts-jest/utils'

import {
  IContenu,
  IEtapeType,
  IHeritageContenu,
  Index,
  ISection,
  ITitreEtape
} from '../../types'

import {
  etapeSectionsDictionaryBuild,
  heritageContenuFind,
  titreEtapeHeritageContenuFind
} from './titre-etape-heritage-contenu-find'
import { etapeTypeSectionsFormat } from '../../api/_format/etapes-types'
import { objectClone } from '../../tools'

jest.mock('../../api/_format/etapes-types', () => ({
  etapeTypeSectionsFormat: jest.fn()
}))

describe('retourne le contenu spécifique d’un élément d’une section en fonction de son héritage', () => {
  test('l’étape n’est pas modifiée si elle n’a pas d’étape précédente et qu’elle n’a aucun héritage d’actif', () => {
    const heritageContenu: IHeritageContenu = {
      section: { element: { actif: false } }
    }
    const titreEtape = {
      heritageContenu
    } as ITitreEtape

    expect(heritageContenuFind('section', 'element', titreEtape)).toEqual({
      hasChanged: false,
      value: undefined,
      etapeId: undefined
    })
  })

  test('l’étape est modifiée si elle a une étape précédente et que son héritage n’est pas renseigné', () => {
    const heritageContenu: IHeritageContenu = {
      section: { element: { actif: false } }
    }

    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      heritageContenu
    } as ITitreEtape

    const titreEtape = {
      heritageContenu
    } as ITitreEtape

    expect(
      heritageContenuFind(
        'section',
        'element',
        titreEtape,
        titreEtapePrecedente
      )
    ).toEqual({
      hasChanged: true,
      value: undefined,
      etapeId: titreEtapePrecedente.id
    })
  })

  test('l’étape est modifiée si elle a une étape précédente et que son héritage est actif', () => {
    const contenu: IContenu = {
      section: { element: 'toto' }
    }
    const heritageContenu: IHeritageContenu = {
      section: { element: { actif: false } }
    }

    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      contenu,
      heritageContenu
    } as ITitreEtape

    const titreEtape = {
      heritageContenu
    } as ITitreEtape
    titreEtape.heritageContenu!.section.element.actif = true

    expect(
      heritageContenuFind(
        'section',
        'element',
        titreEtape,
        titreEtapePrecedente
      )
    ).toEqual({
      hasChanged: true,
      value: contenu.section.element,
      etapeId: titreEtapePrecedente.id
    })
  })

  test('l’étape est modifiée et récupère l’héritage déjà présent sur l’étape précédente', () => {
    const contenu: IContenu = {
      section: { element: 'toto' }
    }
    const heritageContenu: IHeritageContenu = {
      section: { element: { actif: true, etapeId: 'firstEtapeId' } }
    }

    const titreEtapePrecedente = {
      id: 'titreEtapePrecedenteId',
      contenu,
      heritageContenu
    } as ITitreEtape

    const titreEtape = {
      heritageContenu: objectClone(heritageContenu)
    } as ITitreEtape
    titreEtape.heritageContenu!.section.element.actif = true
    delete titreEtape.heritageContenu!.section.element.etapeId

    expect(
      heritageContenuFind(
        'section',
        'element',
        titreEtape,
        titreEtapePrecedente
      )
    ).toEqual({
      hasChanged: true,
      value: contenu.section.element,
      etapeId: 'firstEtapeId'
    })
  })
})

describe('retourne le contenu de l’étape en fonction de son héritage', () => {
  test('l’étape n’est pas modifiée si elle n’a pas d’étape précédente et qu’elle n’a aucun héritage d’actif', () => {
    const heritageContenu: IHeritageContenu = {
      section: { element: { actif: false } }
    }
    const titreEtape = {
      id: 'etapeId',
      heritageContenu
    } as ITitreEtape

    expect(
      titreEtapeHeritageContenuFind([titreEtape], titreEtape, {
        [titreEtape.id]: []
      })
    ).toEqual({
      hasChanged: false,
      contenu: undefined,
      heritageContenu
    })
  })

  test('l’étape est modifiée si elle un héritage actif et une étape précédente avec un élément d’une section en commun', () => {
    const heritageContenu: IHeritageContenu = {
      section: { element: { actif: false } }
    }
    const prevTitreEtape = {
      id: 'prevEtapeId',
      contenu: { section: { element: 'toto' } } as IContenu,
      heritageContenu
    } as ITitreEtape

    const titreEtape = {
      id: 'etapeId',
      heritageContenu
    } as ITitreEtape
    titreEtape.heritageContenu!.section.element.actif = true

    const dictionary = {
      [prevTitreEtape.id]: [{ id: 'section', elements: [{ id: 'element' }] }],
      [titreEtape.id]: [{ id: 'section', elements: [{ id: 'element' }] }]
    } as Index<ISection[]>

    expect(
      titreEtapeHeritageContenuFind(
        [prevTitreEtape, titreEtape],
        titreEtape,
        dictionary
      )
    ).toEqual({
      hasChanged: true,
      contenu: prevTitreEtape.contenu,
      heritageContenu: {
        section: { element: { actif: true, etapeId: prevTitreEtape.id } }
      }
    })
  })

  test('l’étape est modifiée si elle un héritage actif et que son contenu est supprimé', () => {
    const heritageContenu: IHeritageContenu = {
      section: { element: { actif: false } }
    }
    const prevTitreEtape = {
      id: 'prevEtapeId',
      heritageContenu
    } as ITitreEtape

    const titreEtape = {
      id: 'etapeId',
      contenu: { section: { element: 'toto' } } as IContenu,
      heritageContenu
    } as ITitreEtape
    titreEtape.heritageContenu!.section.element.actif = true

    const dictionary = {
      [prevTitreEtape.id]: [{ id: 'section', elements: [{ id: 'element' }] }],
      [titreEtape.id]: [{ id: 'section', elements: [{ id: 'element' }] }]
    } as Index<ISection[]>

    expect(
      titreEtapeHeritageContenuFind(
        [prevTitreEtape, titreEtape],
        titreEtape,
        dictionary
      )
    ).toEqual({
      hasChanged: true,
      contenu: { section: {} },
      heritageContenu: {
        section: { element: { actif: true, etapeId: prevTitreEtape.id } }
      }
    })
  })
})

describe('construit le dictionnaire les sections', () => {
  const etapeTypeSectionsFormatMock = mocked(etapeTypeSectionsFormat, true)

  test('retourne un dictionnaire vide', () => {
    const dictionary = etapeSectionsDictionaryBuild([], [], 'arm')
    expect(dictionary).toEqual({})
  })

  test('retourne un dictionnaire vide car pas de sections', () => {
    etapeTypeSectionsFormatMock.mockReturnValue([])

    const dictionary = etapeSectionsDictionaryBuild(
      [{ id: 'etapeId', type: { id: 'mfr' } as IEtapeType }] as ITitreEtape[],
      [],
      'arm'
    )
    expect(dictionary).toEqual({})
  })

  test('retourne un dictionnaire avec les sections par étapes', () => {
    const sections = {
      id: 'section1',
      nom: 'sectionOne',
      elements: [{ id: 'element1', nom: 'elementOne' }]
    }
    etapeTypeSectionsFormatMock.mockReturnValue([sections] as ISection[])

    const etape = {
      id: 'etapeId',
      type: {
        id: 'mfr'
      } as IEtapeType
    } as ITitreEtape

    const dictionary = etapeSectionsDictionaryBuild([etape], [], 'arm')
    expect(dictionary).toEqual({ [etape.id]: [sections] })
  })
})

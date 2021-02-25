import { titreEtapeHeritageContenuFind } from './titre-etape-heritage-contenu-find'
import { IContenu, IHeritageContenu, ITitreEtape } from '../../types'

describe('retourne le contenu en fonction de son héritage', () => {
  test('l’étape n’est pas modifiée si elle n’a pas d’étape précédente et qu’elle n’a aucun héritage d’actif', () => {
    const heritageContenu: IHeritageContenu = {
      section: { element: { actif: false } }
    }
    const titreEtape = {
      heritageContenu
    } as ITitreEtape

    expect(
      titreEtapeHeritageContenuFind('section', 'element', titreEtape)
    ).toEqual({
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
      titreEtapeHeritageContenuFind(
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
      titreEtapeHeritageContenuFind(
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
})

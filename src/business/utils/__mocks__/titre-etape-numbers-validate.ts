import { ITitreEtape, ISection } from '../../../types'

const titreEtapesSections = [
  {
    id: 'section',
    elements: [
      {
        id: 'nombre',
        type: 'number'
      },
      {
        id: 'mot',
        type: 'string'
      }
    ]
  }
] as ISection[]

const titreEtapesSectionsSansElement = [
  {
    id: 'section-sans-elements',
    elements: null
  }
] as ISection[]

const titreEtapeSansContenu = ({
  duree: 1,
  contenu: null
} as unknown) as ITitreEtape

const titreEtapeNombresValides = ({
  duree: 1,
  contenu: {
    nombre: 1
  }
} as unknown) as ITitreEtape

const titreEtapeNombresNegatifs = ({
  duree: -1,
  contenu: {
    section: {
      nombre: -1
    }
  }
} as unknown) as ITitreEtape

export {
  titreEtapesSections,
  titreEtapesSectionsSansElement,
  titreEtapeSansContenu,
  titreEtapeNombresValides,
  titreEtapeNombresNegatifs
}

import { IContenu, ISection } from '../../../types'

const sections = [
  {
    id: 'section',
    elements: [
      { id: 'date', type: 'date' },
      { id: 'mot', type: 'string' }
    ]
  }
] as ISection[]

const sectionsSansElement = [
  { id: 'section-sans-elements', elements: null }
] as ISection[]

const contenuDatesValides = {
  section: { date: '2000-01-01', mot: 'coucou' }
} as IContenu

const contenuDatesInvalides = {
  section: { date: '2000-42-42', mot: 'coucou' }
} as IContenu

export {
  sections,
  sectionsSansElement,
  contenuDatesValides,
  contenuDatesInvalides
}

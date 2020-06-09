import { ISection } from '../../../types'

const sections = [
  {
    id: 'section',
    elements: [
      {
        id: 'number',
        type: 'number'
      }
    ]
  }
] as ISection[]

const sectionsSansElement = [
  {
    id: 'section-sans-elements',
    elements: null
  }
] as ISection[]

const contenuNumber = {
  section: {
    number: 123
  }
}

const contenuNumberNeg = {
  section: {
    number: -1
  }
}

export { sections, sectionsSansElement, contenuNumber, contenuNumberNeg }

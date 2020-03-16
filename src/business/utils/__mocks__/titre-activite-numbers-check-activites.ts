import { ISection } from '../../../types'

const titreActiviteContenuNumber = {
  section: {
    number: 123
  }
}

const titreActiviteContenuNumberNeg = {
  section: {
    number: -1
  }
}

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

export { titreActiviteContenuNumber, titreActiviteContenuNumberNeg, sections }

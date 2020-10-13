import { IAdministration, Index } from '../../src/types'

const administrations = {
  ptmg: {
    id: 'ope-ptmg-973-01',
    typeId: 'ope',
    nom: 'PTMG',
    type: { id: 'ope', nom: 'Opérateur', ordre: 5 }
  },
  dealGuyane: {
    id: 'dea-guyane-01',
    typeId: 'dea',
    nom: 'DEAL Guyane',
    type: { id: 'dea', nom: 'Déal', ordre: 3 }
  },
  cacem: {
    id: 'ope-cacem-01',
    typeId: 'ope',
    nom: 'Cacem',
    type: { id: 'ope', nom: 'Opérateur', ordre: 5 }
  }
} as Index<IAdministration>

export { administrations }

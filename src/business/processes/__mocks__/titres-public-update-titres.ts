import { ITitre } from '../../../types'

const titresPublicModifie = ([
  {
    typeId: 'cxh',
    type: {
      autorisationsTitresStatuts: []
    },
    demarches: [],
    publicLecture: true,
    entreprisesLecture: false
  }
] as unknown) as ITitre[]

const titresPublicIdentique = ([
  {
    typeId: 'cxh',
    type: {
      autorisationsTitresStatuts: []
    },
    demarches: null,
    publicLecture: false,
    entreprisesLecture: true
  }
] as unknown) as ITitre[]

export { titresPublicModifie, titresPublicIdentique }

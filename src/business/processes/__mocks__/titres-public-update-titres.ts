import { ITitre } from '../../../types'

const titresPublicModifie = ([
  {
    typeId: 'cxh',
    type: {
      autorisationsTitresStatuts: []
    },
    demarches: [],
    publicLecture: true,
    entrepriseLecture: false
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
    entrepriseLecture: true
  }
] as unknown) as ITitre[]

export { titresPublicModifie, titresPublicIdentique }

import { ITitre } from '../../../types'

const titresPublicModifie = ([
  {
    typeId: 'cxh',
    type: {
      autorisationsTitresStatuts: []
    },
    demarches: [],
    publicLecture: true,
    entrepriseLecture: true
  }
] as unknown) as ITitre[]

const titresPublicIdentique = ([
  {
    typeId: 'cxh',
    type: {
      autorisationsTitresStatuts: []
    },
    demarches: [],
    publicLecture: false,
    entrepriseLecture: true
  }
] as unknown) as ITitre[]

export { titresPublicModifie, titresPublicIdentique }

import Titres from '../../../database/models/titres'

const titresPublicModifie = [
  ({
    typeId: 'cxh',
    type: {
      autorisationsTitresStatuts: []
    },
    demarches: [],
    publicLecture: true,
    entreprisesLecture: false
  } as unknown) as Titres
]

const titresPublicIdentique = [
  ({
    typeId: 'cxh',
    type: {
      autorisationsTitresStatuts: []
    },
    demarches: null,
    publicLecture: false,
    entreprisesLecture: true
  } as unknown) as Titres
]

export { titresPublicModifie, titresPublicIdentique }

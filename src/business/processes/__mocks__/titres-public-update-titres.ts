import Titres from '../../../database/models/titres'

const titresPublicModifie = [
  ({
    typeId: 'cxh',
    type: {
      titresTypesTitresStatuts: []
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
      titresTypesTitresStatuts: []
    },
    demarches: null,
    publicLecture: false,
    entreprisesLecture: true
  } as unknown) as Titres
]

export { titresPublicModifie, titresPublicIdentique }

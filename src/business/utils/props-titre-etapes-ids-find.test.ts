import { contenusTitreEtapesIdsFind } from './props-titre-etapes-ids-find'

describe("liste des propriétés et les étapes qui en sont à l'origine", () => {
  test('trouve la liste des propriétés', () => {
    expect(
      contenusTitreEtapesIdsFind(
        'val',
        [
          {
            id: 'demarche-id',
            titreId: 'titre-id',
            typeId: 'oct',
            statutId: 'acc',
            etapes: []
          }
        ],
        [{ elementId: 'mecanise', sectionId: 'arm' }]
      )
    ).toBeNull()
  })
})

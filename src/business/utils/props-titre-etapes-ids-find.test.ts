import { propsTitreEtapesIdsFind } from './props-titre-etapes-ids-find'

describe("liste des propriétés et les étapes qui en sont à l'origine", () => {
  test('trouve la liste des propriétés', () => {
    expect(
      propsTitreEtapesIdsFind(
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

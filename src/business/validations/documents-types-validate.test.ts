import { IDocument, IDocumentType } from '../../types'

import { documentsTypesValidate } from './documents-types-validate'

describe('teste documentsTypesValidate', () => {
  test('aucun document type n’est possible', () => {
    const errors = documentsTypesValidate(null)
    expect(errors).toHaveLength(0)
  })

  test('aucun document type n’est possible mais avec des documents', () => {
    const errors = documentsTypesValidate([{}] as IDocument[])
    expect(errors).toHaveLength(1)
  })

  test('tous les documents sont optionnels', () => {
    const errors = documentsTypesValidate([], [
      { id: 'arr', optionnel: true }
    ] as IDocumentType[])
    expect(errors).toHaveLength(0)
  })

  test('il manque un document obligatoire', () => {
    const errors = documentsTypesValidate(null, [
      { id: 'arr', optionnel: false }
    ] as IDocumentType[])
    expect(errors).toHaveLength(1)
  })

  test('il manque la date à un document obligatoire', () => {
    const errors = documentsTypesValidate(
      [
        {
          typeId: 'arr',
          fichier: true,
          fichierTypeId: 'pdf'
        }
      ] as IDocument[],
      [{ id: 'arr', optionnel: false }] as IDocumentType[]
    )
    expect(errors).toHaveLength(1)
  })

  test('il manque le fichier à un document obligatoire', () => {
    const errors = documentsTypesValidate(
      [
        {
          typeId: 'arr',
          fichierTypeId: 'pdf',
          date: '2002-10-10'
        }
      ] as IDocument[],
      [{ id: 'arr', optionnel: false }] as IDocumentType[]
    )
    expect(errors).toHaveLength(1)
  })

  test('le document obligatoire est complet', () => {
    const errors = documentsTypesValidate(
      [
        {
          typeId: 'arr',
          fichier: true,
          fichierTypeId: 'pdf',
          date: '2002-10-10'
        }
      ] as IDocument[],
      [{ id: 'arr', optionnel: false }] as IDocumentType[]
    )
    expect(errors).toHaveLength(0)
  })
})

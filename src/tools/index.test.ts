import { objectsDiffer, dupRemove, dupFind, diffFind } from './index'

describe('comparaison entre des objets', () => {
  test('retourne false si les objets sont identiques (dates)', () => {
    const res = objectsDiffer({ date: '1910-01-01' }, { date: '1910-01-01' })

    expect(res).toBe(false)
  })

  test('retourne true si au moins une propriété des objets est différente (dates)', () => {
    const res = objectsDiffer({ date: null }, { date: '1000-01-01' })

    expect(res).toBe(true)
  })

  test('retourne false si les objets sont identiques (tableaux)', () => {
    const res = objectsDiffer({ arr: [1, 2] }, { arr: [1, 2] })

    expect(res).toBe(false)
  })

  test('retourne true si au moins une propriété des objets est différente (tableaux)', () => {
    const res = objectsDiffer({ arr: [1, 2] }, { arr: [1] })

    expect(res).toBe(true)
  })

  test('retourne false si les objets sont identiques (objets)', () => {
    const res = objectsDiffer({ obj: { prop: true } }, { obj: { prop: true } })

    expect(res).toBe(false)
  })

  test('retourne true si au moins une propriété des objets est différente (objets)', () => {
    const res = objectsDiffer({ obj: { prop: true } }, { obj: { prop: false } })

    expect(res).toBe(true)
  })
})

describe('comparaison entre des tableaux', () => {
  test('retourne un seul tableau en combinant les éléments', () => {
    const res = dupRemove(
      'id',
      [
        { id: 1, nom: 'nom-1' },
        { id: 2, nom: 'nom-2' }
      ],
      [
        { id: 1, nom: 'nom-1-bis' },
        { id: 3, nom: 'nom-3' }
      ]
    )

    expect(res).toEqual([
      { id: 1, nom: 'nom-1' },
      { id: 2, nom: 'nom-2' },
      { id: 3, nom: 'nom-3' }
    ])
  })

  test('retourne un seul tableau en combinant les éléments en doublon', () => {
    const res = dupFind(
      'id',
      [
        { id: 1, nom: 'nom-1' },
        { id: 2, nom: 'nom-2' }
      ],
      [
        { id: 1, nom: 'nom-1-bis' },
        { id: 3, nom: 'nom-3' }
      ]
    )

    expect(res).toEqual([{ id: 1, nom: 'nom-1-bis' }])
  })

  test('retourne un seul tableau d\'éléments uniques à chaque tableau', () => {
    const res = diffFind(
      'id',
      [
        { id: 1, nom: 'nom-1' },
        { id: 2, nom: 'nom-2' }
      ],
      [
        { id: 1, nom: 'nom-1-bis' },
        { id: 3, nom: 'nom-3' }
      ]
    )

    expect(res).toEqual([{ id: 2, nom: 'nom-2' }, { id: 3, nom: 'nom-3' }])
  })
})

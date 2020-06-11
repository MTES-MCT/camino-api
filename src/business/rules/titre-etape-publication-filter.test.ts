import titreEtapePublicationFilter from './titre-etape-publication-filter'

describe("étape de publication d'une étape", () => {
  test('une étape de dpu est une étape de publication', () => {
    expect(titreEtapePublicationFilter('dpu')).toEqual(true)
  })

  test("une étape de mdp n'est pas une étape de publication", () => {
    expect(titreEtapePublicationFilter('mdp')).toEqual(false)
  })

  test("une étape de dex n'est pas une étape de publication pour un titre non-spécifique", () => {
    expect(titreEtapePublicationFilter('dex')).toEqual(false)
  })

  test('une étape de dex est une étape de publication pour un titre AXM', () => {
    expect(titreEtapePublicationFilter('dex', 'axm')).toEqual(true)
  })

  test('une étape de sco est une étape de publication pour un titre ARM', () => {
    expect(titreEtapePublicationFilter('sco', 'arm')).toEqual(true)
  })

  test('une étape de rpu est une étape de publication pour un titre PRM', () => {
    expect(titreEtapePublicationFilter('rpu', 'prm')).toEqual(true)
  })

  test("un titre non reconnu n'est pas géré", () => {
    expect(titreEtapePublicationFilter('rpu', 'xxx')).toEqual(false)
  })
})

import taxeOrCheckAndCalc from './titre-taxes-or-calc'

import {
  titreSansActivite,
  titreActiviteSansContenu,
  titreActiviteSansRenseignements,
  titreActivite2017,
  titreActivite2017SansOr,
  titreActivite2018,
  titreActivite2018SansOr,
  titreActivite2018MauvaisePeriode,
  titreActiviteTaxeAConserver,
  titreActiviteTaxeARemplacer,
  titreActivite2018PlafondInvest,
  taxeVide,
  taxeRco,
  taxeTor
} from './__mocks__/titre-taxe-or-calc-titres'

describe("calcule la taxe d'un type d'une annee pour un titre", () => {
  test("ne calcule pas la taxe si le titre n'a pas d'activités", () => {
    const res = taxeOrCheckAndCalc(titreSansActivite, taxeVide)

    expect(res).toBeNull()
  })

  test("ne calcule pas la taxe si la taxe n'a pas de section", () => {
    const res = taxeOrCheckAndCalc(titreActivite2018, taxeVide)

    expect(res).toBeNull()
  })

  test('ne calcule pas la taxe si le titre ne possede pas de contenu', () => {
    const res = taxeOrCheckAndCalc(titreActiviteSansContenu, taxeRco)

    expect(res).toBeNull()
  })

  test('ne calcule pas la taxe si le titre ne possede pas de renseignements', () => {
    const res = taxeOrCheckAndCalc(titreActiviteSansRenseignements, taxeRco)

    expect(res).toBeNull()
  })

  test("calcule la taxe d'un titre en 2017", () => {
    const res = taxeOrCheckAndCalc(titreActivite2017, taxeRco)

    expect(res).toEqual([
      {
        annee: 2017,
        contenu: { investissements: '', montant: 40, tonnageExtrait: 400 },
        frequencePeriodeId: 12,
        taxeTypeId: 'rco',
        titreId: 'h-cxx-courdemanges-1988'
      }
    ])
  })

  test("ne calcule pas la taxe d'un titre en 2017 s'il ne possede pas d'orExtrait", () => {
    const res = taxeOrCheckAndCalc(titreActivite2017SansOr, taxeRco)

    expect(res).toBeNull()
  })

  test("calcule la taxe d'un titre en 2018", () => {
    const res = taxeOrCheckAndCalc(titreActivite2018, taxeRco)

    expect(res).toEqual([
      {
        annee: 2018,
        contenu: { investissements: '', montant: 36, tonnageExtrait: 300 },
        frequencePeriodeId: 12,
        taxeTypeId: 'rco',
        titreId: 'h-cxx-courdemanges-1988'
      }
    ])
  })

  test("ne calcule pas la taxe d'un titre en 2018 s'il ne possede pas d'orNet", () => {
    const res = taxeOrCheckAndCalc(titreActivite2018SansOr, taxeRco)

    expect(res).toBeNull()
  })

  test("ne calcule pas la taxe d'un titre en 2018 si il ne s'agit pas du dernier trimestre", () => {
    const res = taxeOrCheckAndCalc(titreActivite2018MauvaisePeriode, taxeRco)

    expect(res).toBeNull()
  })

  test("ne modifie pas la taxe d'un titre si il est deja présent", () => {
    const res = taxeOrCheckAndCalc(titreActiviteTaxeAConserver, taxeRco)

    expect(res).toBeNull()
  })

  test("modifie la taxe d'un titre", () => {
    const res = taxeOrCheckAndCalc(titreActiviteTaxeARemplacer, taxeRco)

    expect(res).toEqual([
      {
        annee: 2018,
        contenu: { investissements: '', montant: 12, tonnageExtrait: 100 },
        frequencePeriodeId: 12,
        taxeTypeId: 'rco',
        titreId: 'h-cxx-courdemanges-1988'
      }
    ])
  })

  test("ajoute un investissement si il s'agit de la taxe sur l'or", () => {
    const res = taxeOrCheckAndCalc(titreActivite2018, taxeTor)

    expect(res).toEqual([
      {
        annee: 2018,
        contenu: { investissements: 13.5, montant: 30, tonnageExtrait: 300 },
        frequencePeriodeId: 12,
        taxeTypeId: 'tor',
        titreId: 'h-cxx-courdemanges-1988'
      }
    ])
  })

  test("plafonne l'investissement", () => {
    const res = taxeOrCheckAndCalc(titreActivite2018PlafondInvest, taxeTor)

    expect(res).toEqual([
      {
        annee: 2018,
        contenu: {
          investissements: 5000,
          montant: 50000000,
          tonnageExtrait: 500000000
        },
        frequencePeriodeId: 12,
        taxeTypeId: 'tor',
        titreId: 'h-cxx-courdemanges-1988'
      }
    ])
  })
})

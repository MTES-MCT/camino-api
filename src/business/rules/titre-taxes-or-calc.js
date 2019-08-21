const titreOrInvestissementCalc = montant => {
  const invest = montant * 0.45

  return invest > 5000 ? 5000 : invest
}

const titreOrTaxeCalc = (orNet, tarif) =>
  Math.round((orNet / 1000) * tarif * 100) / 100

const titreOrContenuCalc = (orNet, tarif, taxeTypeId) => {
  const montant = titreOrTaxeCalc(orNet, tarif)
  let investissements = ''
  if (taxeTypeId === 'tor') {
    investissements = titreOrInvestissementCalc(montant)
  }

  return {
    montant: Math.round(montant),
    tonnageExtrait: Math.round(orNet * 100) / 100,
    investissements: Math.round(investissements)
  }
}

const titreOrTaxeBuild = (
  taxeTypeId,
  titreId,
  annee,
  orNet,
  tarif,
  frequencePeriodeId
) => ({
  titreId,
  taxeTypeId,
  contenu: titreOrContenuCalc(orNet, tarif, taxeTypeId),
  frequencePeriodeId,
  annee
})

const taxeOrTitreTaxe = (
  { taxeTypeId, titreId, productions, entrepriseType },
  taxesSectionsType
) =>
  productions.reduce((titreTaxes, { annee, orNet }) => {
    const taxeSection = taxesSectionsType.find(
      taxeSection =>
        parseInt(taxeSection.dateDebut.slice(0, 4)) === annee &&
        taxeSection.entrepriseTypesIds.includes(entrepriseType)
    )

    if (taxeSection) {
      titreTaxes.push(
        titreOrTaxeBuild(
          taxeTypeId,
          titreId,
          annee,
          orNet,
          taxeSection.tarif,
          taxeSection.frequencePeriodeId
        )
      )
    }

    return titreTaxes
  }, [])

const taxeOrCheckDoublon = (production, titreTaxes, taxeTypeId) =>
  // cherche si la taxe existe deja pour le titre
  !titreTaxes.find(
    taxe =>
      taxe.taxeTypeId === taxeTypeId &&
      taxe.contenu.tonnageExtrait === production.orNet &&
      taxe.annee === production.annee
  )
// si la taxe existe déjà pour le titre
// il n'est pas nécessaire de la créer

const taxeOrTitre2017Calc = titreActivitesFiltered => {
  const orNet = titreActivitesFiltered.reduce(
    (somme, activite) => somme + activite.contenu.renseignements.orExtrait,
    0
  )

  return [{ annee: 2017, orNet }]
}

const taxeOrTitre20182019Calc = titreActivitesFiltered =>
  titreActivitesFiltered.map(activite => ({
    annee: activite.annee,
    orNet: activite.contenu.renseignements.orNet
  }))

const taxeOrTitre2017Filter = titreActivitesAnnee =>
  titreActivitesAnnee.filter(
    ({ contenu }) =>
      contenu.renseignements.orExtrait && contenu.renseignements.orExtrait !== 0
  )

const taxeOrTitre20182019Filter = titreActivitesAnnee =>
  titreActivitesAnnee.filter(
    ({ frequencePeriodeId, contenu }) =>
      frequencePeriodeId === 4 &&
      contenu.renseignements.orNet &&
      contenu.renseignements.orNet !== 0
  )

const taxeOrTitreDateFilterCalc = (
  titreActivites,
  taxeOrTitreAnneeFilter,
  taxeOrTitreAnneeCalc,
  annees
) => {
  const titreActivitesFiltered = taxeOrTitreAnneeFilter(
    titreActivites.filter(
      ({ annee, contenu }) =>
        contenu && contenu.renseignements && annees.includes(annee)
    )
  )

  if (!titreActivitesFiltered.length) return []

  return taxeOrTitreAnneeCalc(titreActivitesFiltered)
}

const taxeOrCheckAndCalc = (
  {
    activites: titreActivites,
    taxes: titreTaxes,
    id: titreId,
    titulaires: titreTitulaires
  },
  { id: taxeTypeId, sections: taxesSectionsType }
) => {
  const titreTaxesProductions2017 = taxeOrTitreDateFilterCalc(
    titreActivites,
    taxeOrTitre2017Filter,
    taxeOrTitre2017Calc,
    [2017]
  )
  const titreTaxesProductions20182019 = taxeOrTitreDateFilterCalc(
    titreActivites,
    taxeOrTitre20182019Filter,
    taxeOrTitre20182019Calc,
    [2018, 2019]
  )

  let productions = [].concat(
    titreTaxesProductions2017,
    titreTaxesProductions20182019
  )

  if (productions.length === 0) return null

  productions = productions.filter(production =>
    taxeOrCheckDoublon(production, titreTaxes, taxeTypeId)
  )

  const titreTaxesParametres = {
    taxeTypeId,
    titreId,
    productions,
    entrepriseType: titreTitulaires[0].categorie || 'PME'
  }

  const titreTaxesNew = taxeOrTitreTaxe(titreTaxesParametres, taxesSectionsType)

  return titreTaxesNew.length ? titreTaxesNew : null
}

export default taxeOrCheckAndCalc
